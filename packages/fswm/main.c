#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <xcb/xcb.h>

#define MAX_CLIENTS 256

static xcb_window_t clients[MAX_CLIENTS];
static int client_count = 0;
static int current_client_index = 0;

static void focus_client(xcb_connection_t *conn, int target_index) {
    uint32_t stack;
    if (client_count == 0) return;

    current_client_index = (target_index % client_count + client_count) % client_count;

    stack = XCB_STACK_MODE_ABOVE;
    xcb_configure_window(conn, clients[current_client_index], XCB_CONFIG_WINDOW_STACK_MODE, &stack);
    xcb_set_input_focus(conn, XCB_INPUT_FOCUS_POINTER_ROOT, clients[current_client_index], XCB_CURRENT_TIME);
    xcb_flush(conn);
}

int main(int argc, char *argv[]) {
    xcb_connection_t *conn;
    xcb_screen_t *screen;
    xcb_generic_event_t *ev;
    uint32_t event_mask;
    uint32_t screen_geometry[4];
    xcb_keycode_t KEY_TAB, KEY_T, KEY_DEL;

    int i, j;

    if (argc < 2) {
        fprintf(stderr, "usage: add 'exec fswm <terminal>' to ~/.xinitrc\n");
        return EXIT_FAILURE;
    }

    KEY_TAB = 23;
    KEY_T   = 28;
    KEY_DEL = 119;

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

    screen_geometry[0] = 0;
    screen_geometry[1] = 0;
    screen_geometry[2] = screen->width_in_pixels;
    screen_geometry[3] = screen->height_in_pixels;

    xcb_grab_key(conn, 1, screen->root, XCB_MOD_MASK_1, KEY_TAB, XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    xcb_grab_key(conn, 1, screen->root, XCB_MOD_MASK_1 | XCB_MOD_MASK_SHIFT, KEY_TAB, XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    xcb_grab_key(conn, 1, screen->root, XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1, KEY_T, XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    xcb_grab_key(conn, 1, screen->root, XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1, KEY_DEL, XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);

    while (1) {
        int forward;
        int next_index;

        xcb_flush(conn);
        ev = xcb_wait_for_event(conn);
        if (!ev) break;

        switch (ev->response_type & ~0x80) {

            case XCB_KEY_PRESS: {
                xcb_key_press_event_t *kp;

                kp = (xcb_key_press_event_t *)ev;

                if ((kp->state & XCB_MOD_MASK_1) && kp->detail == KEY_TAB) {
                    forward = !(kp->state & XCB_MOD_MASK_SHIFT);
                    next_index = current_client_index + (forward ? 1 : -1);
                    focus_client(conn, next_index);
                }

                else if ((kp->state & (XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1)) ==
                         (XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1) && kp->detail == KEY_T) {
                    if (!fork()) execvp(argv[1], &argv[1]);
                }

                else if ((kp->state & (XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1)) ==
                         (XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1) && kp->detail == KEY_DEL) {
                    xcb_disconnect(conn);
                    free(ev);
                    return 0;
                }

                break;
            }

            case XCB_MAP_REQUEST: {
                xcb_map_request_event_t *me;

                me = (xcb_map_request_event_t *)ev;

                if (client_count < MAX_CLIENTS)
                    clients[client_count++] = me->window;

                xcb_map_window(conn, me->window);
                focus_client(conn, client_count - 1);
                xcb_configure_window(conn, clients[current_client_index],
                                     XCB_CONFIG_WINDOW_X |
                                     XCB_CONFIG_WINDOW_Y |
                                     XCB_CONFIG_WINDOW_WIDTH |
                                     XCB_CONFIG_WINDOW_HEIGHT,
                                     screen_geometry);
                break;
            }

            case XCB_UNMAP_NOTIFY: {
                xcb_unmap_notify_event_t *ue;

                ue = (xcb_unmap_notify_event_t *)ev;

                for (i = 0; i < client_count; i++) {
                    if (clients[i] == ue->window) {
                        for (j = i; j < client_count - 1; j++)
                            clients[j] = clients[j + 1];
                        client_count--;
                        break;
                    }
                }

                if (client_count > 0)
                    focus_client(conn, current_client_index);
                else
                    current_client_index = 0;

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
