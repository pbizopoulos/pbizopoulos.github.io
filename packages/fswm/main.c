#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <xcb/xcb.h>

#define MAX_CLIENTS 256

static xcb_window_t clients[MAX_CLIENTS];
static int client_count = 0;
static int current_index = 0;

static void focus_client(xcb_connection_t *conn, int index) {
    uint32_t stack = XCB_STACK_MODE_ABOVE;
    if (client_count == 0) return;
    current_index = (index % client_count + client_count) % client_count;
    xcb_configure_window(conn, clients[current_index], XCB_CONFIG_WINDOW_STACK_MODE, &stack);
    xcb_set_input_focus(conn, XCB_INPUT_FOCUS_POINTER_ROOT, clients[current_index], XCB_CURRENT_TIME);
    xcb_flush(conn);
}

int main(int argc, char *argv[]) {
    xcb_connection_t *conn;
    xcb_screen_t *screen;
    xcb_generic_event_t *ev;
    uint32_t event_mask;
    uint32_t cfg[4];
    xcb_keycode_t del = 119;
    xcb_keycode_t t = 28;
    xcb_keycode_t tab = 23;
    if (argc < 2) {
        fprintf(stderr, "usage: add 'exec fswm <terminal>' to ~/.xinitrc\n");
        return EXIT_FAILURE;
    }
    conn = xcb_connect(NULL, NULL);
    if (!conn || xcb_connection_has_error(conn)) {
        fprintf(stderr, "fswm: cannot connect to X server\n");
        return EXIT_FAILURE;
    }
    screen = xcb_setup_roots_iterator(xcb_get_setup(conn)).data;
    event_mask = XCB_EVENT_MASK_SUBSTRUCTURE_REDIRECT |
                 XCB_EVENT_MASK_SUBSTRUCTURE_NOTIFY |
                 XCB_EVENT_MASK_PROPERTY_CHANGE;
    if (xcb_request_check(conn,
        xcb_change_window_attributes_checked(conn, screen->root, XCB_CW_EVENT_MASK, &event_mask))) {
        fprintf(stderr, "fswm: another window manager is running\n");
        xcb_disconnect(conn);
        return EXIT_FAILURE;
    }
    signal(SIGCHLD, SIG_IGN);
    cfg[0] = 0;
    cfg[1] = 0;
    cfg[2] = screen->width_in_pixels;
    cfg[3] = screen->height_in_pixels;
    xcb_grab_key(conn, 1, screen->root, XCB_MOD_MASK_1, tab,
                 XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    xcb_grab_key(conn, 1, screen->root, XCB_MOD_MASK_1 | XCB_MOD_MASK_SHIFT, tab,
                 XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    xcb_grab_key(conn, 1, screen->root, XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1, t,
                 XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    xcb_grab_key(conn, 1, screen->root, XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1, del,
                 XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    while (1) {
        xcb_flush(conn);
        ev = xcb_wait_for_event(conn);
        if (!ev) break;
        switch (ev->response_type & ~0x80) {
            case XCB_KEY_PRESS: {
                xcb_key_press_event_t *kp = (xcb_key_press_event_t *)ev;
                int next = -1;
                if (kp->detail == tab && (kp->state & XCB_MOD_MASK_1)) {
                    if (kp->state & XCB_MOD_MASK_SHIFT)
                        next = current_index - 1;
                    else
                        next = current_index + 1;
                    focus_client(conn, next);
                } else if (kp->detail == del) {
                    break;
                } else if (kp->detail == t && (kp->state & (XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1))) {
                    if (!fork()) execvp(argv[1], &argv[1]);
                }
                break;
            }
            case XCB_MAP_REQUEST: {
                xcb_map_request_event_t *me = (xcb_map_request_event_t *)ev;
                if (client_count < MAX_CLIENTS)
                    clients[client_count++] = me->window;
                xcb_map_window(conn, me->window);
                focus_client(conn, client_count - 1);
                xcb_configure_window(conn, clients[current_index],
                                     XCB_CONFIG_WINDOW_X |
                                     XCB_CONFIG_WINDOW_Y |
                                     XCB_CONFIG_WINDOW_WIDTH |
                                     XCB_CONFIG_WINDOW_HEIGHT, cfg);
                break;
            }
            case XCB_UNMAP_NOTIFY: {
                xcb_unmap_notify_event_t *ue = (xcb_unmap_notify_event_t *)ev;
                int i, j;
                for (i = 0; i < client_count; i++) {
                    if (clients[i] == ue->window) {
                        for (j = i; j < client_count - 1; j++)
                            clients[j] = clients[j + 1];
                        client_count--;
                        break;
                    }
                }
                if (client_count > 0)
                    focus_client(conn, current_index);
                else
                    current_index = 0;
                break;
            }
            default:
                break;
        }
        free(ev);
    }
    xcb_disconnect(conn);
    return 0;
}
