#define COLOR(hex)                                                             \
  {((hex >> 24) & 0xFF) / 255.0f, ((hex >> 16) & 0xFF) / 255.0f,               \
   ((hex >> 8) & 0xFF) / 255.0f, (hex & 0xFF) / 255.0f}
static const int sloppyfocus = 1;
static const int bypass_surface_visibility = 0;
static const unsigned int borderpx = 1;
static const float rootcolor[] = COLOR(0x222222ff);
static const float bordercolor[] = COLOR(0x444444ff);
static const float focuscolor[] = COLOR(0x005577ff);
static const float urgentcolor[] = COLOR(0xff0000ff);
static const float fullscreen_bg[] = COLOR(0x000000ff);
#define TAGCOUNT (9)
static int log_level = WLR_ERROR;
static const Rule rules[] = {
    {NULL, NULL, 0, 0, -1},
};
static const Layout layouts[] = {
    {"[M]", monocle},
    {"[]=", tile},
    {"><>", NULL},
};
static const MonitorRule monrules[] = {
    {NULL, 0.55f, 1, 1, &layouts[0], WL_OUTPUT_TRANSFORM_NORMAL, -1, -1},
};
static const struct xkb_rule_names xkb_rules = {
    .layout = "us,gr",
    .options = "grp:win_space_toggle",
};
static const int repeat_rate = 25;
static const int repeat_delay = 600;
static const int tap_to_click = 1;
static const int tap_and_drag = 1;
static const int drag_lock = 1;
static const int natural_scrolling = 0;
static const int disable_while_typing = 1;
static const int left_handed = 0;
static const int middle_button_emulation = 0;
static const enum libinput_config_scroll_method scroll_method =
    LIBINPUT_CONFIG_SCROLL_2FG;
static const enum libinput_config_click_method click_method =
    LIBINPUT_CONFIG_CLICK_METHOD_BUTTON_AREAS;
static const uint32_t send_events_mode = LIBINPUT_CONFIG_SEND_EVENTS_ENABLED;
static const enum libinput_config_accel_profile accel_profile =
    LIBINPUT_CONFIG_ACCEL_PROFILE_ADAPTIVE;
static const double accel_speed = 0.0;
static const enum libinput_config_tap_button_map button_map =
    LIBINPUT_CONFIG_TAP_MAP_LRM;
static const char *termcmd[] = {"foot", NULL};
static const Key keys[] = {
    {WLR_MODIFIER_CTRL | WLR_MODIFIER_ALT, XKB_KEY_t, spawn, {.v = termcmd}},
    {WLR_MODIFIER_ALT, XKB_KEY_Tab, focusstack, {.i = +1}},
    {WLR_MODIFIER_ALT | WLR_MODIFIER_SHIFT,
     XKB_KEY_ISO_Left_Tab,
     focusstack,
     {.i = -1}},
};
static const Button buttons[] = {
    {0, 0, NULL, {0}},
};
