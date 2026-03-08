use calloop::generic::Generic;
use calloop::{EventLoop, Interest, Mode, PostAction};
use smithay::backend::input::{KeyState, Keycode};
use smithay::delegate_compositor;
use smithay::delegate_seat;
use smithay::delegate_shm;
use smithay::delegate_xdg_shell;
use smithay::input::keyboard::{FilterResult, KeysymHandle, ModifiersState, XkbConfig, keysyms};
use smithay::input::{Seat, SeatHandler, SeatState};
use smithay::reexports::wayland_protocols_misc::zwp_virtual_keyboard_v1::server::{
    zwp_virtual_keyboard_manager_v1::{self, ZwpVirtualKeyboardManagerV1},
    zwp_virtual_keyboard_v1::{self, ZwpVirtualKeyboardV1},
};
use smithay::reexports::wayland_server::backend::GlobalId;
use smithay::reexports::wayland_server::protocol::wl_keyboard::KeymapFormat;
use smithay::reexports::wayland_server::protocol::wl_surface::WlSurface;
use smithay::reexports::wayland_server::{
    Client, DataInit, Dispatch, Display, DisplayHandle, GlobalDispatch, New, Resource,
};
use smithay::utils::{SERIAL_COUNTER, Serial};
use smithay::wayland::buffer::BufferHandler;
use smithay::wayland::compositor::{
    CompositorClientState, CompositorHandler, CompositorState, with_states,
};
use smithay::wayland::shell::xdg::{
    PopupSurface, PositionerState, ToplevelSurface, XdgShellHandler, XdgShellState,
    XdgToplevelSurfaceData,
};
use smithay::wayland::shm::{ShmHandler, ShmState};
use smithay::wayland::socket::ListeningSocketSource;
use std::env;
use std::fs::OpenOptions;
use std::io::Write;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
struct Window {
    surface: ToplevelSurface,
    wl_surface: WlSurface,
}
struct State {
    display_handle: DisplayHandle,
    compositor_state: CompositorState,
    xdg_shell_state: XdgShellState,
    shm_state: ShmState,
    seat_state: SeatState<Self>,
    seat: Seat<State>,
    virtual_keyboard_state: FswmVirtualKeyboardManagerState,
    windows: Vec<Window>,
    current: Option<usize>,
    previous: Option<usize>,
    spawn_argv: Vec<String>,
    focus_log: Option<PathBuf>,
    exit_requested: bool,
}
#[derive(Debug)]
struct ClientState {
    compositor: CompositorClientState,
}
impl smithay::reexports::wayland_server::backend::ClientData for ClientState {}
struct FswmVirtualKeyboardManagerState {
    global: GlobalId,
}
struct FswmVirtualKeyboardManagerGlobalData {
    filter: Box<dyn for<'c> Fn(&'c Client) -> bool + Send + Sync>,
}
struct FswmVirtualKeyboardUserData {
    seat: Seat<State>,
    keymap_set: Mutex<bool>,
}
impl FswmVirtualKeyboardManagerState {
    fn new<F>(display: &DisplayHandle, filter: F) -> Self
    where
        F: for<'c> Fn(&'c Client) -> bool + Send + Sync + 'static,
    {
        let data = FswmVirtualKeyboardManagerGlobalData {
            filter: Box::new(filter),
        };
        let global = display.create_global::<State, ZwpVirtualKeyboardManagerV1, _>(1, data);
        Self { global }
    }
}
impl State {
    fn handle_keybinding(
        &mut self,
        mods: &ModifiersState,
        sym: KeysymHandle<'_>,
        pressed: bool,
    ) -> bool {
        if !pressed {
            return false;
        }
        let keysym = sym
            .raw_latin_sym_or_raw_current_sym()
            .unwrap_or(sym.modified_sym());
        let tab = keysyms::KEY_Tab.into();
        let t = keysyms::KEY_t.into();
        let t_upper = keysyms::KEY_T.into();
        let delete = keysyms::KEY_Delete.into();
        if mods.alt && keysym == tab {
            if mods.shift {
                self.cycle_focus_reverse();
            } else {
                self.cycle_focus();
            }
            return true;
        }
        if mods.ctrl && mods.alt && (keysym == t || keysym == t_upper) {
            self.spawn_terminal();
            return true;
        }
        if mods.ctrl && mods.alt && keysym == delete {
            self.exit_requested = true;
            return true;
        }
        false
    }
    fn log_focus(&self, window: Option<&Window>) {
        let Some(path) = self.focus_log.as_ref() else {
            return;
        };
        let Ok(mut file) = OpenOptions::new().create(true).append(true).open(path) else {
            return;
        };
        let (app_id, title) = match window {
            Some(win) => with_states(&win.wl_surface, |states| {
                if let Some(data) = states.data_map.get::<XdgToplevelSurfaceData>() {
                    let data = data.lock().unwrap();
                    (
                        data.app_id.clone().unwrap_or_default(),
                        data.title.clone().unwrap_or_default(),
                    )
                } else {
                    (String::new(), String::new())
                }
            }),
            None => (String::new(), String::new()),
        };
        let _ = writeln!(file, "focus app_id={} title={}", app_id, title);
    }
    fn focus_window(&mut self, index: Option<usize>) {
        self.current = index;
        let focused_surface = self
            .current
            .and_then(|idx| self.windows.get(idx))
            .map(|w| w.wl_surface.clone());
        if let Some(keyboard) = self.seat.get_keyboard() {
            keyboard.set_focus(self, focused_surface, SERIAL_COUNTER.next_serial());
        }
        let window = self.current.and_then(|idx| self.windows.get(idx));
        self.log_focus(window);
    }
    fn prev_index(&self, idx: usize) -> Option<usize> {
        if self.windows.is_empty() {
            return None;
        }
        if idx == 0 {
            Some(self.windows.len() - 1)
        } else {
            Some(idx - 1)
        }
    }
    fn next_index(&self, idx: usize) -> Option<usize> {
        if self.windows.is_empty() {
            return None;
        }
        Some((idx + 1) % self.windows.len())
    }
    fn update_focus(&mut self, focus: Option<usize>) {
        if let Some(focus_idx) = focus {
            if self.previous == Some(focus_idx) {
                self.current = self.previous;
                self.previous = self.current.and_then(|idx| self.prev_index(idx));
            } else {
                self.previous = self.current;
                self.current = Some(focus_idx);
            }
        } else {
            if self.previous.is_some() {
                self.current = self.previous;
            } else if self.windows.is_empty() {
                self.current = None;
            } else {
                self.current = Some(0);
            }
            if let Some(current) = self.current {
                self.previous = self.prev_index(current);
            } else {
                self.previous = None;
            }
        }
        self.focus_window(self.current);
    }
    fn cycle_focus(&mut self) {
        if self.windows.is_empty() {
            self.update_focus(None);
            return;
        }
        let next = match self.current {
            Some(idx) => self.next_index(idx),
            None => Some(0),
        };
        self.update_focus(next);
    }
    fn cycle_focus_reverse(&mut self) {
        if self.windows.is_empty() {
            self.update_focus(None);
            return;
        }
        let next = match self.current {
            Some(idx) => self.prev_index(idx),
            None => Some(self.windows.len() - 1),
        };
        self.update_focus(next);
    }
    fn spawn_terminal(&self) {
        if self.spawn_argv.is_empty() {
            return;
        }
        let cmd = &self.spawn_argv[0];
        let args = &self.spawn_argv[1..];
        let _ = std::process::Command::new(cmd).args(args).spawn();
    }
}
impl CompositorHandler for State {
    fn compositor_state(&mut self) -> &mut CompositorState {
        &mut self.compositor_state
    }
    fn client_compositor_state<'a>(&self, client: &'a Client) -> &'a CompositorClientState {
        &client
            .get_data::<ClientState>()
            .expect("client data")
            .compositor
    }
    fn commit(&mut self, _surface: &WlSurface) {}
}
delegate_compositor!(State);
impl ShmHandler for State {
    fn shm_state(&self) -> &ShmState {
        &self.shm_state
    }
}
delegate_shm!(State);
impl BufferHandler for State {
    fn buffer_destroyed(
        &mut self,
        _buffer: &smithay::reexports::wayland_server::protocol::wl_buffer::WlBuffer,
    ) {
    }
}
impl XdgShellHandler for State {
    fn xdg_shell_state(&mut self) -> &mut XdgShellState {
        &mut self.xdg_shell_state
    }
    fn new_toplevel(&mut self, toplevel: ToplevelSurface) {
        let wl_surface = toplevel.wl_surface().clone();
        toplevel.send_configure();
        let index = self.windows.len();
        self.windows.push(Window {
            surface: toplevel,
            wl_surface,
        });
        self.update_focus(Some(index));
    }
    fn toplevel_destroyed(&mut self, surface: ToplevelSurface) {
        let Some(pos) = self.windows.iter().position(|w| w.surface == surface) else {
            return;
        };
        let was_current = self.current == Some(pos);
        let was_previous = self.previous == Some(pos);
        self.windows.remove(pos);
        if let Some(current) = self.current {
            if current > pos {
                self.current = Some(current - 1);
            }
        }
        if let Some(previous) = self.previous {
            if previous > pos {
                self.previous = Some(previous - 1);
            }
        }
        if was_previous {
            self.previous = self.current.and_then(|idx| self.prev_index(idx));
        }
        if self.windows.is_empty() {
            self.update_focus(None);
        } else {
            self.update_focus(self.previous);
        }
    }
    fn new_popup(&mut self, surface: PopupSurface, _positioner: PositionerState) {
        let _ = surface.send_configure();
    }
    fn reposition_request(
        &mut self,
        surface: PopupSurface,
        positioner: PositionerState,
        token: u32,
    ) {
        surface.with_pending_state(|state| {
            state.positioner = positioner;
            state.geometry = positioner.get_geometry();
        });
        let _ = surface.send_repositioned(token);
    }
    fn grab(
        &mut self,
        _surface: PopupSurface,
        _seat: smithay::reexports::wayland_server::protocol::wl_seat::WlSeat,
        _serial: Serial,
    ) {
    }
}
delegate_xdg_shell!(State);
impl SeatHandler for State {
    type KeyboardFocus = WlSurface;
    type PointerFocus = WlSurface;
    type TouchFocus = WlSurface;
    fn seat_state(&mut self) -> &mut SeatState<Self> {
        &mut self.seat_state
    }
    fn focus_changed(&mut self, _seat: &Seat<Self>, _focused: Option<&Self::KeyboardFocus>) {}
}
delegate_seat!(State);
impl GlobalDispatch<ZwpVirtualKeyboardManagerV1, FswmVirtualKeyboardManagerGlobalData, State>
    for State
{
    fn bind(
        _state: &mut State,
        _handle: &DisplayHandle,
        _client: &Client,
        resource: New<ZwpVirtualKeyboardManagerV1>,
        _global_data: &FswmVirtualKeyboardManagerGlobalData,
        data_init: &mut DataInit<'_, State>,
    ) {
        data_init.init(resource, ());
    }
    fn can_view(client: Client, global_data: &FswmVirtualKeyboardManagerGlobalData) -> bool {
        (global_data.filter)(&client)
    }
}
impl Dispatch<ZwpVirtualKeyboardManagerV1, (), State> for State {
    fn request(
        _state: &mut State,
        _client: &Client,
        _resource: &ZwpVirtualKeyboardManagerV1,
        request: zwp_virtual_keyboard_manager_v1::Request,
        _data: &(),
        _handle: &DisplayHandle,
        data_init: &mut DataInit<'_, State>,
    ) {
        match request {
            zwp_virtual_keyboard_manager_v1::Request::CreateVirtualKeyboard { seat, id } => {
                let seat = Seat::<State>::from_resource(&seat).expect("seat");
                data_init.init(
                    id,
                    FswmVirtualKeyboardUserData {
                        seat,
                        keymap_set: Mutex::new(false),
                    },
                );
            }
            _ => unreachable!(),
        }
    }
}
impl Dispatch<ZwpVirtualKeyboardV1, FswmVirtualKeyboardUserData, State> for State {
    fn request(
        state: &mut State,
        _client: &Client,
        virtual_keyboard: &ZwpVirtualKeyboardV1,
        request: zwp_virtual_keyboard_v1::Request,
        data: &FswmVirtualKeyboardUserData,
        _handle: &DisplayHandle,
        _data_init: &mut DataInit<'_, State>,
    ) {
        match request {
            zwp_virtual_keyboard_v1::Request::Keymap {
                format,
                fd: _,
                size: _,
            } => {
                if format == KeymapFormat::XkbV1 as u32 {
                    if let Ok(mut keymap_set) = data.keymap_set.lock() {
                        *keymap_set = true;
                    }
                }
            }
            zwp_virtual_keyboard_v1::Request::Key {
                time,
                key,
                state: key_state,
            } => {
                if data.keymap_set.lock().map(|v| !*v).unwrap_or(true) {
                    virtual_keyboard.post_error(
                        zwp_virtual_keyboard_v1::Error::NoKeymap,
                        "`key` sent before keymap.",
                    );
                    return;
                }
                let key_state = if key_state == 1 {
                    KeyState::Pressed
                } else {
                    KeyState::Released
                };
                let pressed = key_state == KeyState::Pressed;
                let keycode: Keycode = Keycode::from(key + 8);
                if let Some(keyboard) = data.seat.get_keyboard() {
                    let serial = SERIAL_COUNTER.next_serial();
                    let _ = keyboard.input(
                        state,
                        keycode,
                        key_state,
                        serial,
                        time,
                        move |state, mods, sym| {
                            if state.handle_keybinding(mods, sym, pressed) {
                                FilterResult::Intercept(())
                            } else {
                                FilterResult::Forward
                            }
                        },
                    );
                }
            }
            zwp_virtual_keyboard_v1::Request::Modifiers { .. } => {}
            zwp_virtual_keyboard_v1::Request::Destroy => {}
            _ => unreachable!(),
        }
    }
}
fn main() {
    let mut args = env::args().collect::<Vec<_>>();
    if args.len() < 2 {
        eprintln!("usage: fswm-wayland <terminal_emulator_command> [args...]");
        std::process::exit(1);
    }
    let spawn_argv = args.split_off(1);
    tracing_subscriber::fmt().with_target(false).init();
    let mut event_loop: EventLoop<State> = EventLoop::try_new().expect("event loop");
    let display = Display::new().expect("display");
    let display_handle = display.handle();
    let compositor_state = CompositorState::new::<State>(&display_handle);
    let xdg_shell_state = XdgShellState::new::<State>(&display_handle);
    let shm_state = ShmState::new::<State>(&display_handle, vec![]);
    let virtual_keyboard_state =
        FswmVirtualKeyboardManagerState::new(&display_handle, |_client| true);
    let mut seat_state = SeatState::<State>::new();
    let mut seat = seat_state.new_wl_seat(&display_handle, "seat0");
    seat.add_keyboard(XkbConfig::default(), 200, 25)
        .expect("keyboard");
    let focus_log = env::var("FSWM_WAYLAND_FOCUS_LOG").ok().map(PathBuf::from);
    let state = State {
        display_handle,
        compositor_state,
        xdg_shell_state,
        shm_state,
        seat_state,
        seat,
        virtual_keyboard_state,
        windows: Vec::new(),
        current: None,
        previous: None,
        spawn_argv,
        focus_log,
        exit_requested: false,
    };
    let socket_name = env::var("WAYLAND_DISPLAY").unwrap_or_else(|_| "wayland-0".to_string());
    let socket = ListeningSocketSource::with_name(&socket_name).expect("socket");
    env::set_var("WAYLAND_DISPLAY", &socket_name);
    let display_source = Generic::new(display, Interest::READ, Mode::Level);
    event_loop
        .handle()
        .insert_source(display_source, |_, display, state| {
            let display = unsafe { display.get_mut() };
            let _ = display.dispatch_clients(state);
            let _ = display.flush_clients();
            Ok(PostAction::Continue)
        })
        .expect("insert display source");
    event_loop
        .handle()
        .insert_source(socket, move |client, _, state| {
            let client_state = Arc::new(ClientState {
                compositor: CompositorClientState::default(),
            });
            state
                .display_handle
                .insert_client(client, client_state)
                .expect("insert client");
        })
        .expect("insert socket source");
    let mut state = state;
    state.spawn_terminal();
    loop {
        event_loop.dispatch(None, &mut state).expect("dispatch");
        if state.exit_requested {
            break;
        }
    }
}
