#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <xcb/xcb.h>

typedef struct ClientList {
    struct Client *head;
    struct Client *tail;
} ClientList;

typedef struct Client {
    struct Client *next;
    struct Client *previous;
    struct ClientList *parent;
    xcb_window_t window;
} Client;

static Client *client_current = NULL;
static ClientList client_list;

static Client *create_client(xcb_window_t window, ClientList *parent) {
    Client *client = calloc(1, sizeof(Client));
    if (!client) return NULL;
    client->window = window;
    client->parent = parent;
    client->previous = parent->tail;
    if (client->previous)
        client->previous->next = client;
    else
        parent->head = client;
    parent->tail = client;
    return client;
}

static void remove_client(Client *client) {
    if (client->previous) client->previous->next = client->next;
    if (client->next)     client->next->previous = client->previous;
    if (client->parent->head == client) client->parent->head = client->next;
    if (client->parent->tail == client) client->parent->tail = client->previous;
    free(client);
}

static void update_client(Client *new_client, xcb_connection_t *connection) {
    const uint32_t stack_mode = XCB_STACK_MODE_ABOVE;
    client_current = new_client;
    if (!client_current)
        client_current = client_list.head;
    if (!client_current)
        return;
    xcb_configure_window(connection, client_current->window, XCB_CONFIG_WINDOW_STACK_MODE, &stack_mode);
    xcb_set_input_focus(connection, XCB_INPUT_FOCUS_POINTER_ROOT, client_current->window, XCB_CURRENT_TIME);
}

static Client *find_client_by_window(xcb_window_t window) {
    Client *client = client_list.head;
    while (client) {
        if (client->window == window) return client;
        client = client->next;
    }
    return NULL;
}

int main(int argc, char *argv[]) {
    xcb_keycode_t delete_keycode = 119;
    xcb_keycode_t t_keycode = 28;
    xcb_keycode_t tab_keycode = 23;
    unsigned int map_request_configure_value_list[4];
    unsigned int root_value_list[] = { XCB_EVENT_MASK_SUBSTRUCTURE_REDIRECT | XCB_EVENT_MASK_SUBSTRUCTURE_NOTIFY | XCB_EVENT_MASK_PROPERTY_CHANGE };
    xcb_connection_t *connection = xcb_connect(NULL, NULL);
    xcb_generic_event_t *generic_event = NULL;
    xcb_screen_t *screen = xcb_setup_roots_iterator(xcb_get_setup(connection)).data;
    xcb_generic_error_t *xcb_request_error = NULL;
    xcb_void_cookie_t wm_cookie = xcb_change_window_attributes_checked(connection, screen->root, XCB_CW_EVENT_MASK, root_value_list);
    xcb_request_error = xcb_request_check(connection, wm_cookie);
    if (argc < 2) {
        fprintf(stderr, "usage: printf 'exec fswm <terminal_emulator_command>\\n' >> ~/.xinitrc\n");
        goto cleanup;
    }
    if (xcb_connection_has_error(connection)) {
        fprintf(stderr, "fswm: cannot connect to the X server\n");
        goto cleanup;
    } else if (xcb_request_error) {
        fprintf(stderr, "fswm: another window manager is already running\n");
        goto cleanup;
    }
    signal(SIGCHLD, SIG_IGN);
    map_request_configure_value_list[0] = 0;
    map_request_configure_value_list[1] = 0;
    map_request_configure_value_list[2] = screen->width_in_pixels;
    map_request_configure_value_list[3] = screen->height_in_pixels;
    xcb_grab_key(connection, 1, screen->root, XCB_MOD_MASK_1, tab_keycode, XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    xcb_grab_key(connection, 1, screen->root, XCB_MOD_MASK_1 | XCB_MOD_MASK_SHIFT, tab_keycode, XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    xcb_grab_key(connection, 1, screen->root, XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1, t_keycode, XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    xcb_grab_key(connection, 1, screen->root, XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1, delete_keycode, XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
    while (1) {
        xcb_flush(connection);
        generic_event = xcb_wait_for_event(connection);
        if (!generic_event) break;
        if (generic_event->response_type == XCB_KEY_PRESS) {
            const xcb_key_press_event_t *key_press_event = (xcb_key_press_event_t *)generic_event;
            const xcb_keycode_t key = key_press_event->detail;
            const uint16_t state = key_press_event->state;
            Client *new_client = NULL;
            if ((key == tab_keycode) && (state & XCB_MOD_MASK_1)) {
                if (state & XCB_MOD_MASK_SHIFT)
                    new_client = client_current && client_current->previous ? client_current->previous : client_list.tail;
                else
                    new_client = client_current && client_current->next ? client_current->next : client_list.head;
            } else if (key == delete_keycode) {
                break;
            } else if ((key == t_keycode) && (state & (XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1))) {
                if (!fork()) execvp(argv[1], &argv[1]);
            }
            if (new_client) {
                update_client(new_client, connection);
            }
        } else if (generic_event->response_type == XCB_MAP_REQUEST) {
            const xcb_map_request_event_t *map_request_event =
                (xcb_map_request_event_t *)generic_event;
            Client *map_request_client = find_client_by_window(map_request_event->window);
            if (!map_request_client)
                map_request_client = create_client(map_request_event->window, &client_list);
            if (!map_request_client) {
                fprintf(stderr, "fswm: failed to allocate memory for new client\n");
            } else {
                xcb_map_window(connection, map_request_client->window);
                update_client(map_request_client, connection);
                xcb_configure_window(connection, client_current->window, XCB_CONFIG_WINDOW_X | XCB_CONFIG_WINDOW_Y | XCB_CONFIG_WINDOW_WIDTH | XCB_CONFIG_WINDOW_HEIGHT, map_request_configure_value_list);
            }
        } else if (generic_event->response_type == XCB_UNMAP_NOTIFY) {
            const xcb_unmap_notify_event_t *unmap_event = (xcb_unmap_notify_event_t *)generic_event;
            Client *client = find_client_by_window(unmap_event->window);
            if (client) {
                remove_client(client);
                update_client(NULL, connection);
            }
        }
        free(generic_event);
    }
    while (client_list.head) {
        remove_client(client_list.head);
    }
cleanup:
    free(xcb_request_error);
    if (connection)
        xcb_disconnect(connection);
    return xcb_request_error ? EXIT_FAILURE : 0;
}
