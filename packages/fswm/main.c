/* cppcheck-suppress-file checkersReport */
/* cppcheck-suppress-file normalCheckLevelMaxBranches */
#include <X11/keysym.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <xcb/xcb.h>
#include <xcb/xcb_keysyms.h>
typedef struct List {
  struct Client *head;
  struct Client *tail;
} List;
typedef struct Client {
  struct Client *next;
  struct Client *previous;
  struct List *parent;
  xcb_window_t window;
} Client;
static void update_client(Client *client, xcb_connection_t *connection);
static Client *find_client(xcb_window_t window);
static Client *append_client(xcb_window_t window);
static int handle_key_press(const xcb_key_press_event_t *key_press_event,
                            xcb_connection_t *connection,
                            const xcb_keycode_t *delete_keycode,
                            const xcb_keycode_t *t_keycode,
                            const xcb_keycode_t *tab_keycode,
                            char *argv[]);
static void handle_map_request(const xcb_map_request_event_t *map_request_event,
                               xcb_connection_t *connection,
                               const unsigned int *configure_value_list);
static void handle_unmap_notify(
    const xcb_unmap_notify_event_t *unmap_notify_event,
    xcb_connection_t *connection);
static Client *client_current = NULL;
static Client *client_previous_focus = NULL;
static List clients;
static Client *remove_client(Client *client) {
  Client *next;
  List *parent;
  Client *previous;
  if (!client || !client->parent) {
    return NULL;
  }
  next = client->next;
  parent = client->parent;
  previous = client->previous;
  if (previous) {
    previous->next = next;
  } else {
    parent->head = next;
  }
  if (next) {
    next->previous = previous;
  } else {
    parent->tail = previous;
  }
  client->previous = client->next = NULL;
  client->parent = NULL;
  return client;
}
static Client *find_client(xcb_window_t window) {
  Client *client_iter = clients.head;
  while (client_iter) {
    if (client_iter->window == window) {
      break;
    }
    client_iter = client_iter->next;
  }
  return client_iter;
}
static Client *append_client(xcb_window_t window) {
  Client *client_new = calloc(1, sizeof(Client));
  if (!client_new) {
    return NULL;
  }
  client_new->window = window;
  client_new->parent = &clients;
  if (clients.tail) {
    clients.tail->next = client_new;
    client_new->previous = clients.tail;
  } else {
    clients.head = client_new;
  }
  clients.tail = client_new;
  return client_new;
}
void update_client(Client *client_focus, xcb_connection_t *connection) {
  unsigned int key_press_value_list[] = {XCB_STACK_MODE_ABOVE};
  if (client_focus) {
    client_previous_focus = client_current;
    client_current = client_focus;
  } else {
    client_current = client_previous_focus;
    if (!client_current) {
      client_current = clients.head;
    }
    if (client_current) {
      client_previous_focus = client_current->previous;
    }
  }
  if (!client_current) {
    return;
  }
  xcb_configure_window(connection, client_current->window,
                       XCB_CONFIG_WINDOW_STACK_MODE, key_press_value_list);
  xcb_set_input_focus(connection, XCB_INPUT_FOCUS_POINTER_ROOT,
                      client_current->window, XCB_CURRENT_TIME);
}
static int handle_key_press(const xcb_key_press_event_t *key_press_event,
                            xcb_connection_t *connection,
                            const xcb_keycode_t *delete_keycode,
                            const xcb_keycode_t *t_keycode,
                            const xcb_keycode_t *tab_keycode,
                            char *argv[]) {
  Client *client_focus = NULL;
  if (key_press_event->detail == *tab_keycode &&
      key_press_event->state == (XCB_MOD_MASK_1 | XCB_MOD_MASK_SHIFT)) {
    client_focus = client_current ? client_current->next : NULL;
    if (!client_focus) {
      client_focus = clients.head;
    }
    update_client(client_focus, connection);
    return 0;
  }
  if (key_press_event->detail == *tab_keycode) {
    client_focus = client_current ? client_current->previous : NULL;
    if (!client_focus) {
      client_focus = clients.tail;
    }
    update_client(client_focus, connection);
    return 0;
  }
  if (key_press_event->detail == *delete_keycode) {
    return 1;
  }
  if (key_press_event->detail == *t_keycode) {
    if (!(fork())) {
      execvp(argv[1], &argv[1]);
      _exit(1);
    }
  }
  return 0;
}
static void handle_map_request(const xcb_map_request_event_t *map_request_event,
                               xcb_connection_t *connection,
                               const unsigned int *configure_value_list) {
  Client *client_map_request = find_client(map_request_event->window);
  if (!client_map_request) {
    client_map_request = append_client(map_request_event->window);
    if (!client_map_request) {
      fprintf(stderr, "fswm: out of memory\n");
      return;
    }
  }
  xcb_map_window(connection, client_map_request->window);
  update_client(client_map_request, connection);
  xcb_configure_window(connection, client_current->window,
                       XCB_CONFIG_WINDOW_X | XCB_CONFIG_WINDOW_Y |
                           XCB_CONFIG_WINDOW_WIDTH | XCB_CONFIG_WINDOW_HEIGHT,
                       configure_value_list);
}
static void handle_unmap_notify(
    const xcb_unmap_notify_event_t *unmap_notify_event,
    xcb_connection_t *connection) {
  Client *client_unmap_notify = find_client(unmap_notify_event->window);
  if (!client_unmap_notify) {
    return;
  }
  remove_client(client_unmap_notify);
  if (client_unmap_notify == client_current) {
    client_current = NULL;
  }
  if (client_unmap_notify == client_previous_focus) {
    client_previous_focus = NULL;
  }
  update_client(NULL, connection);
}
int main(int argc, char *argv[]) {
  unsigned int map_request_configure_value_list[4];
  unsigned int root_value_list[] = {XCB_EVENT_MASK_SUBSTRUCTURE_REDIRECT |
                                    XCB_EVENT_MASK_SUBSTRUCTURE_NOTIFY |
                                    XCB_EVENT_MASK_PROPERTY_CHANGE};
  xcb_connection_t *connection = xcb_connect(NULL, NULL);
  xcb_generic_event_t *generic_event = NULL;
  xcb_key_symbols_t *key_symbols = xcb_key_symbols_alloc(connection);
  xcb_keycode_t *delete_keycode =
      xcb_key_symbols_get_keycode(key_symbols, XK_Delete);
  xcb_keycode_t *t_keycode = xcb_key_symbols_get_keycode(key_symbols, XK_T);
  xcb_keycode_t *tab_keycode = xcb_key_symbols_get_keycode(key_symbols, XK_Tab);
  xcb_screen_t *screen =
      xcb_setup_roots_iterator(xcb_get_setup(connection)).data;
  xcb_void_cookie_t wm_cookie = xcb_change_window_attributes_checked(
      connection, screen->root, XCB_CW_EVENT_MASK, root_value_list);
  xcb_generic_error_t *xcb_request_error =
      xcb_request_check(connection, wm_cookie);
  xcb_key_symbols_free(key_symbols);
  if (argc < 2) {
    fprintf(stderr, "usage: printf 'exec fswm <terminal_emulator_command>\\n' "
                    ">> ~/.xinitrc\n");
    fflush(stderr);
    _exit(0);
  } else if (!delete_keycode || !t_keycode || !tab_keycode) {
    fprintf(stderr, "fswm: cannot get keycodes\n");
    goto error_exit;
  } else if (xcb_connection_has_error(connection) > 0) {
    fprintf(stderr, "fswm: cannot connect to the X server\n");
    goto error_exit;
  } else if (xcb_request_error) {
    fprintf(stderr, "fswm: another window manager is already running\n");
    goto error_exit;
  }
  signal(SIGCHLD, SIG_IGN);
  map_request_configure_value_list[0] = 0;
  map_request_configure_value_list[1] = 0;
  map_request_configure_value_list[2] = screen->width_in_pixels;
  map_request_configure_value_list[3] = screen->height_in_pixels;
  xcb_grab_key(connection, 1, screen->root, XCB_MOD_MASK_1, *tab_keycode,
               XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
  xcb_grab_key(connection, 1, screen->root, XCB_MOD_MASK_1 | XCB_MOD_MASK_SHIFT,
               *tab_keycode, XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
  xcb_grab_key(connection, 1, screen->root,
               XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1, *t_keycode,
               XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
  xcb_grab_key(connection, 1, screen->root,
               XCB_MOD_MASK_CONTROL | XCB_MOD_MASK_1, *delete_keycode,
               XCB_GRAB_MODE_ASYNC, XCB_GRAB_MODE_ASYNC);
  while (1) {
    xcb_flush(connection);
    if (!(generic_event = xcb_wait_for_event(connection))) {
      break;
    }
    if ((generic_event->response_type & ~0x80) == XCB_KEY_PRESS) {
      const xcb_key_press_event_t *key_press_event =
          (xcb_key_press_event_t *)generic_event;
      if (handle_key_press(key_press_event, connection, delete_keycode, t_keycode,
                           tab_keycode, argv)) {
        free(generic_event);
        break;
      }
    } else if ((generic_event->response_type & ~0x80) == XCB_MAP_REQUEST) {
      const xcb_map_request_event_t *map_request_event =
          (xcb_map_request_event_t *)generic_event;
      handle_map_request(map_request_event, connection,
                         map_request_configure_value_list);
    } else if ((generic_event->response_type & ~0x80) == XCB_UNMAP_NOTIFY ||
               (generic_event->response_type & ~0x80) == XCB_DESTROY_NOTIFY) {
      const xcb_unmap_notify_event_t *unmap_notify_event =
          (xcb_unmap_notify_event_t *)generic_event;
      handle_unmap_notify(unmap_notify_event, connection);
    }
    free(generic_event);
  }
  free(delete_keycode);
  free(t_keycode);
  free(tab_keycode);
  free(xcb_request_error);
  xcb_disconnect(connection);
  return 0;
error_exit:
  free(delete_keycode);
  free(generic_event);
  free(t_keycode);
  free(tab_keycode);
  free(xcb_request_error);
  xcb_disconnect(connection);
  return EXIT_FAILURE;
}
