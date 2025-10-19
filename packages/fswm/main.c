#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <xcb/xcb.h>

#define MAX_CLIENTS 256

static xcb_window_t clients[MAX_CLIENTS];
static int num_clients = 0;
static int focused_index = 0;

static void focus_client_at_index(xcb_connection_t *conn, int target_index)
{
    uint32_t stack_mode = XCB_STACK_MODE_ABOVE;
    if (num_clients == 0) return;
    focused_index = (target_index % num_clients + num_clients) % num_clients;
    xcb_configure_window(conn, clients[focused_index], XCB_CONFIG_WINDOW_STACK_MODE, &stack_mode);
    xcb_set_input_focus(conn, XCB_INPUT_FOCUS_POINTER_ROOT, clients[focused_index], XCB_CURRENT_TIME);
    xcb_flush(conn);
}

int main(int argc, char *argv[])
{
    xcb_connection_t *conn;
    xcb_screen_t *screen;
    xcb_generic_event_t *event;
    uint32_t event_mask;
    uint32_t screen_geometry[4];
    int i, j;
    const xcb_keycode_t KEY_TAB = 23;
    const xcb_keycode_t KEY_T = 28;
    const xcb_keycode_t KEY_DEL = 119;
    if (argc < 2) return EXIT_FAILURE;
    conn = xcb_connect(NULL, NULL);
    if (!conn || xcb_connection_has_error(conn)) return EXIT_FAILURE;
    screen = xcb_setup_roots_iterator(xcb_get_setup(conn)).data;
    event_mask = XCB_EVENT_MASK_SUBSTRUCTURE_REDIRECT | XCB_EVENT_MASK_SUBSTRUCTURE_NOTIFY | XCB_EVENT_MASK_PROPERTY_CHANGE;
    if (xcb_request_check(conn, xcb_change_window_attributes_checked(conn, screen->root, XCB_CW_EVENT_MASK, &event_mask))) {
        xcb_disconnect(conn);
        return EXIT_FAILURE;
    }
    signal(SIGCHLD, SIG_IGN);
    screen_geometry[0] = 0;
    screen_geometry[1] = 0;
    screen_geometry[2] = screen->width_in_pixels;
    screen_geometry[3] = screen->height_in_pixels;
    xcb_grab_key(conn, 1, screen->root, XCB_MOD_MASK_1, KEY_TAB, XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    xcb_grab_key(conn, 1, screen->root, XCB_MOD_MASK_1 | XCB_MOD_MASK_SHIFT, KEY_TAB, XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    xcb_grab_key(conn, 1, screen->root, XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1, KEY_T, XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    xcb_grab_key(conn, 1, screen->root, XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1, KEY_DEL, XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    while (1) {
        xcb_flush(conn);
        event = xcb_wait_for_event(conn);
        if (!event) break;
        switch (event->response_type & ~0x80) {
            case XCB_KEY_PRESS: {
                xcb_key_press_event_t *key_event = (xcb_key_press_event_t *)event;
                if ((key_event->state & XCB_MOD_MASK_1) && key_event->detail == KEY_TAB) {
                    int direction = (key_event->state & XCB_MOD_MASK_SHIFT) ? -1 : 1;
                    focus_client_at_index(conn, focused_index + direction);
                }
                else if ((key_event->state & (XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1)) == (XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1) && key_event->detail == KEY_T) {
                    if (!fork()) execvp(argv[1], &argv[1]);
                }
                else if ((key_event->state & (XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1)) == (XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1) && key_event->detail == KEY_DEL) {
                    xcb_disconnect(conn);
                    free(event);
                    return 0;
                }
                break;
            }
            case XCB_MAP_REQUEST: {
                xcb_map_request_event_t *map_event = (xcb_map_request_event_t *)event;
                if (num_clients < MAX_CLIENTS) clients[num_clients++] = map_event->window;
                xcb_map_window(conn, map_event->window);
                focus_client_at_index(conn, num_clients - 1);
                xcb_configure_window(conn, clients[focused_index], XCB_CONFIG_WINDOW_X | XCB_CONFIG_WINDOW_Y | XCB_CONFIG_WINDOW_WIDTH | XCB_CONFIG_WINDOW_HEIGHT, screen_geometry);
                break;
            }
            case XCB_UNMAP_NOTIFY: {
                xcb_unmap_notify_event_t *unmap_event = (xcb_unmap_notify_event_t *)event;
                for (i = 0; i < num_clients; i++) {
                    if (clients[i] == unmap_event->window) {
                        for (j = i; j < num_clients - 1; j++) clients[j] = clients[j + 1];
                        num_clients--;
                        break;
                    }
                }
                if (num_clients > 0) focus_client_at_index(conn, focused_index);
                else focused_index = 0;
                break;
            }
            default: break;
        }
        free(event);
    }
    xcb_disconnect(conn);
    return 0;
}
