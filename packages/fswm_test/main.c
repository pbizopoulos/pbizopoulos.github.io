/* cppcheck-suppress-file checkersReport */
/* cppcheck-suppress-file normalCheckLevelMaxBranches */
#include <errno.h>
#include <fcntl.h>
#include <signal.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#ifndef SHELL_BIN
#define SHELL_BIN "/bin/sh"
#endif
#ifndef FSWM_BIN
#define FSWM_BIN "fswm"
#endif
#ifndef XVFB_BIN
#define XVFB_BIN "Xvfb"
#endif
#ifndef XTERM_BIN
#define XTERM_BIN "xterm"
#endif
#ifndef XDOTOOL_BIN
#define XDOTOOL_BIN "xdotool"
#endif
#ifndef XDPYINFO_BIN
#define XDPYINFO_BIN "xdpyinfo"
#endif
#ifndef XWININFO_BIN
#define XWININFO_BIN "xwininfo"
#endif
#ifndef RUNTIME_PATH_1
#define RUNTIME_PATH_1 ""
#endif
#ifndef RUNTIME_PATH_2
#define RUNTIME_PATH_2 ""
#endif
#define DISPLAY_VALUE ":1"
#define TEST_TIMEOUT_SECONDS 20
#define SCREEN_WIDTH 1024
#define SCREEN_HEIGHT 768
#define RSS_PIN_KIB 8824L
#define HWM_PIN_KIB 10000L
typedef struct {
  char temp_dir[256];
  char xvfb_log[320];
  char fswm_log[320];
  char fswm_conflict_log[320];
  char xterm_one_log[320];
  char xterm_two_log[320];
  pid_t xvfb_pid;
  pid_t fswm_pid;
} Context;
typedef struct {
  long width;
  long height;
  long x;
  long y;
} WindowGeometry;
extern int setenv(const char *name, const char *value, int overwrite);
extern int snprintf(char *str, size_t size, const char *format, ...);
extern int vsnprintf(char *str, size_t size, const char *format, va_list ap);
extern FILE *popen(const char *command, const char *type);
extern int pclose(FILE *stream);
extern int usleep(unsigned int usec);
extern int kill(pid_t pid, int sig);
static Context context;
#if defined(__GNUC__)
#define PRINTF_LIKE(format_index, first_arg_index)                             \
  __attribute__((format(printf, format_index, first_arg_index)))
#define NORETURN __attribute__((noreturn))
#else
#define PRINTF_LIKE(format_index, first_arg_index)
#define NORETURN
#endif
static void cleanup(void);
static void fail(const char *format, ...) PRINTF_LIKE(1, 2) NORETURN;
static void info(const char *label);
static int read_command_output(char *buffer, size_t buffer_size,
                               const char *format, ...) PRINTF_LIKE(3, 4);
static int run_shell(const char *format, ...) PRINTF_LIKE(1, 2);
static void wait_until_succeeds(int timeout_seconds, const char *format, ...)
    PRINTF_LIKE(2, 3);
static pid_t spawn_logged_process(const char *log_path, char *const argv[]);
static void start_environment(void);
static void assert_no_sanitizer_errors(void);
static long parse_status_field(pid_t pid, const char *field_name);
static void churn_window(const char *window_id, int cycles);
static void assert_root_child(const char *window_id);
static int get_stacking_order(const char *window_ids[], size_t window_count,
                              char order[][32], size_t order_capacity);
static void assert_in_stacking(const char *window_id, const char *window_ids[],
                               size_t window_count);
static void get_first_window_by_name(const char *name, char *buffer,
                                     size_t buffer_size);
static void get_window_name(const char *window_id, char *buffer,
                            size_t buffer_size);
static void get_window_geometry(const char *window_id,
                                WindowGeometry *geometry);
static void get_focused_window(char *buffer, size_t buffer_size);
static int count_windows_by_name(const char *name_pattern);
static int get_windows_by_class(const char *class_name, char windows[][32],
                                size_t capacity);
static int find_new_window(const char *existing[], size_t existing_count,
                           const char *current[], size_t current_count,
                           char *buffer, size_t buffer_size);
static void send_root_key(const char *key_spec);
static void close_window(const char *window_id);
static void kill_window(const char *window_id);
static void map_window(const char *window_id);
static void unmap_window(const char *window_id);
static int process_alive(pid_t pid);
static void ensure_directory(void);
static void trim_trailing_newlines(char *buffer);
static void wait_for_window_count_by_name(const char *name_pattern,
                                          int expected_count);
static void assert_file_contains(const char *path, const char *needle);
static void assert_focus_unchanged(const char *key_spec,
                                   const char *expected_window_id);
static void assert_fswm_survives_key(const char *key_spec);
static void assert_second_wm_rejected(void);
static void run_test(void);
static void cleanup(void) {
  if (context.fswm_pid > 0 && process_alive(context.fswm_pid)) {
    kill(context.fswm_pid, SIGTERM);
    waitpid(context.fswm_pid, NULL, 0);
  }
  if (context.xvfb_pid > 0 && process_alive(context.xvfb_pid)) {
    kill(context.xvfb_pid, SIGTERM);
    waitpid(context.xvfb_pid, NULL, 0);
  }
}
static void fail(const char *format, ...) {
  va_list arguments;
  fprintf(stderr, "fswm_test: ");
  va_start(arguments, format);
  vfprintf(stderr, format, arguments);
  va_end(arguments);
  fputc('\n', stderr);
  cleanup();
  exit(EXIT_FAILURE);
}
static void info(const char *label) {
  printf("%s\n", label);
  fflush(stdout);
}
static int read_command_output(char *buffer, size_t buffer_size,
                               const char *format, ...) {
  char command[4096];
  FILE *pipe;
  size_t length;
  va_list arguments;
  int needed;
  int status;
  if (!buffer || buffer_size == 0U) {
    fail("invalid output buffer");
  }
  va_start(arguments, format);
  needed = vsnprintf(command, sizeof(command), format, arguments);
  va_end(arguments);
  if (needed >= (int)sizeof(command)) {
    fail("command too long");
  }
  pipe = popen(command, "r");
  if (!pipe) {
    fail("popen failed for command: %s", command);
  }
  length = fread(buffer, (size_t)1, buffer_size - (size_t)1, pipe);
  buffer[length] = '\0';
  status = pclose(pipe);
  trim_trailing_newlines(buffer);
  if (status == -1) {
    fail("pclose failed for command: %s", command);
  }
  return status;
}
static int run_shell(const char *format, ...) {
  char command[4096];
  va_list arguments;
  int needed;
  va_start(arguments, format);
  needed = vsnprintf(command, sizeof(command), format, arguments);
  va_end(arguments);
  if (needed >= (int)sizeof(command)) {
    fail("shell command too long");
  }
  return system(command);
}
static void wait_until_succeeds(int timeout_seconds, const char *format, ...) {
  char command[4096];
  int elapsed_tenths = 0;
  va_list arguments;
  int needed;
  va_start(arguments, format);
  needed = vsnprintf(command, sizeof(command), format, arguments);
  va_end(arguments);
  if (needed >= (int)sizeof(command)) {
    fail("wait command too long");
  }
  while (elapsed_tenths < timeout_seconds * 10) {
    if (system(command) == 0) {
      return;
    }
    usleep(100000U);
    elapsed_tenths += 1;
  }
  fail("timeout waiting for command: %s", command);
}
#if defined(__GNUC__) && !defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wanalyzer-fd-leak"
#endif
static pid_t spawn_logged_process(const char *log_path, char *const argv[]) {
  pid_t pid;
  pid = fork();
  if (pid < 0) {
    fail("fork failed");
  }
  if (pid == 0) {
    int log_fd;
    if (setenv("DISPLAY", DISPLAY_VALUE, 1) != 0) {
      perror("setenv DISPLAY");
      _exit(127);
    }
    log_fd = open(log_path, O_WRONLY | O_CREAT | O_TRUNC, 0600);
    if (log_fd < 0) {
      perror("open log");
      _exit(127);
    }
    if (dup2(log_fd, STDOUT_FILENO) < 0) {
      perror("dup2 stdout");
      close(log_fd);
      _exit(127);
    }
    if (dup2(log_fd, STDERR_FILENO) < 0) {
      perror("dup2 stderr");
      close(log_fd);
      _exit(127);
    }
    if (close(log_fd) != 0) {
      perror("close log");
      _exit(127);
    }
    execvp(argv[0], argv);
    perror(argv[0]);
    _exit(127);
  }
  return pid;
}
#if defined(__GNUC__) && !defined(__clang__)
#pragma GCC diagnostic pop
#endif
static int process_alive(pid_t pid) {
  int status;
  pid_t wait_result;
  if (pid <= 0) {
    return 0;
  }
  wait_result = waitpid(pid, &status, WNOHANG);
  if (wait_result == pid) {
    return 0;
  }
  if (wait_result < 0 && errno == ECHILD) {
    return 0;
  }
  return kill(pid, 0) == 0 || errno == EPERM;
}
static void ensure_directory(void) {
  int result;
  snprintf(context.temp_dir, sizeof(context.temp_dir), "/tmp/fswm-test-%ld",
           (long)getpid());
  result = mkdir(context.temp_dir, 0700);
  if (result != 0 && errno != EEXIST) {
    fail("mkdir failed for %s", context.temp_dir);
  }
  snprintf(context.xvfb_log, sizeof(context.xvfb_log), "%s/Xvfb.log",
           context.temp_dir);
  snprintf(context.fswm_log, sizeof(context.fswm_log), "%s/fswm.log",
           context.temp_dir);
  snprintf(context.fswm_conflict_log, sizeof(context.fswm_conflict_log),
           "%s/fswm-conflict.log", context.temp_dir);
  snprintf(context.xterm_one_log, sizeof(context.xterm_one_log),
           "%s/xterm-one.log", context.temp_dir);
  snprintf(context.xterm_two_log, sizeof(context.xterm_two_log),
           "%s/xterm-two.log", context.temp_dir);
}
static void start_environment(void) {
  char runtime_path[1024];
  char xvfb_bin[] = XVFB_BIN;
  char display_value[] = DISPLAY_VALUE;
  char xvfb_screen[] = "-screen";
  char xvfb_screen_index[] = "0";
  char xvfb_mode[] = "1024x768x24";
  char fswm_bin[] = FSWM_BIN;
  char xterm_bin[] = XTERM_BIN;
  char xterm_title_flag[] = "-T";
  char spawn_title[] = "spawn";
  char ready_title[] = "wm-ready";
  char *xvfb_argv[6];
  char *fswm_argv[5];
  char *ready_argv[4];
  char ready_window[32];
  xvfb_argv[0] = xvfb_bin;
  xvfb_argv[1] = display_value;
  xvfb_argv[2] = xvfb_screen;
  xvfb_argv[3] = xvfb_screen_index;
  xvfb_argv[4] = xvfb_mode;
  xvfb_argv[5] = NULL;
  fswm_argv[0] = fswm_bin;
  fswm_argv[1] = xterm_bin;
  fswm_argv[2] = xterm_title_flag;
  fswm_argv[3] = spawn_title;
  fswm_argv[4] = NULL;
  ready_argv[0] = xterm_bin;
  ready_argv[1] = xterm_title_flag;
  ready_argv[2] = ready_title;
  ready_argv[3] = NULL;
  ensure_directory();
  if (setenv("DISPLAY", DISPLAY_VALUE, 1) != 0) {
    fail("setenv DISPLAY failed");
  }
  runtime_path[0] = '\0';
  if (snprintf(runtime_path, sizeof(runtime_path), "%s%s", RUNTIME_PATH_1,
               RUNTIME_PATH_2) >= (int)sizeof(runtime_path)) {
    fail("runtime PATH too long");
  }
  if (runtime_path[0] != '\0' && setenv("PATH", runtime_path, 1) != 0) {
    fail("setenv PATH failed");
  }
  if (setenv("ASAN_OPTIONS",
             "abort_on_error=1:detect_leaks=1:strict_string_checks=1:"
             "detect_stack_use_after_return=1:detect_invalid_pointer_pairs=2:"
             "check_printf=1:allocator_may_return_null=0",
             1) != 0) {
    fail("setenv ASAN_OPTIONS failed");
  }
  if (setenv("LSAN_OPTIONS", "exitcode=23:report_objects=1", 1) != 0) {
    fail("setenv LSAN_OPTIONS failed");
  }
  if (setenv("UBSAN_OPTIONS",
             "halt_on_error=1:print_stacktrace=1:report_error_type=1",
             1) != 0) {
    fail("setenv UBSAN_OPTIONS failed");
  }
  context.xvfb_pid = spawn_logged_process(context.xvfb_log, xvfb_argv);
  wait_until_succeeds(TEST_TIMEOUT_SECONDS,
                      "%s -c 'DISPLAY=%s %s >/dev/null 2>&1'", SHELL_BIN,
                      DISPLAY_VALUE, XDPYINFO_BIN);
  context.fswm_pid = spawn_logged_process(context.fswm_log, fswm_argv);
  wait_until_succeeds(TEST_TIMEOUT_SECONDS,
                      "%s -c 'kill -0 %ld >/dev/null 2>&1'", SHELL_BIN,
                      (long)context.fswm_pid);
  spawn_logged_process(context.xterm_one_log, ready_argv);
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c 'DISPLAY=%s %s search --name \"^wm-ready$\" >/dev/null'",
      SHELL_BIN, DISPLAY_VALUE, XDOTOOL_BIN);
  get_first_window_by_name("wm-ready", ready_window, sizeof(ready_window));
  close_window(ready_window);
  wait_for_window_count_by_name("^wm-ready$", 0);
}
static void assert_no_sanitizer_errors(void) {
  FILE *log_file;
  char line[1024];
  log_file = fopen(context.fswm_log, "r");
  if (!log_file) {
    fail("failed to open fswm log");
  }
  while (fgets(line, (int)sizeof(line), log_file)) {
    if (strstr(line, "AddressSanitizer") ||
        strstr(line, "UndefinedBehaviorSanitizer") ||
        strstr(line, "runtime error:") || strstr(line, "LeakSanitizer")) {
      fclose(log_file);
      fail("sanitizer error detected: %s", line);
    }
  }
  fclose(log_file);
}
static long parse_status_field(pid_t pid, const char *field_name) {
  char path[128];
  char line[256];
  FILE *status_file;
  size_t field_length;
  long value;
  snprintf(path, sizeof(path), "/proc/%ld/status", (long)pid);
  status_file = fopen(path, "r");
  if (!status_file) {
    fail("failed to open %s", path);
  }
  field_length = strlen(field_name);
  while (fgets(line, (int)sizeof(line), status_file)) {
    if (strncmp(line, field_name, field_length) == 0 &&
        line[field_length] == ':') {
      value = 0L;
      if (sscanf(line + field_length + 1U, "%ld", &value) != 1) {
        fail("failed to parse status field %s", field_name);
      }
      fclose(status_file);
      return value;
    }
  }
  fclose(status_file);
  fail("missing status field %s", field_name);
  return 0L;
}
static void churn_window(const char *window_id, int cycles) {
  if (run_shell("%s -c 'i=0; while [ \"$i\" -lt %d ]; do "
                "DISPLAY=%s %s windowunmap %s >/dev/null 2>&1 || exit 1; "
                "DISPLAY=%s %s windowmap %s >/dev/null 2>&1 || exit 1; "
                "i=$((i+1)); done'",
                SHELL_BIN, cycles, DISPLAY_VALUE, XDOTOOL_BIN, window_id,
                DISPLAY_VALUE, XDOTOOL_BIN, window_id) != 0) {
    fail("window churn failed for %s", window_id);
  }
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c 'DISPLAY=%s %s -id %s | grep -q \"Map State: IsViewable\"'",
      SHELL_BIN, DISPLAY_VALUE, XWININFO_BIN, window_id);
}
static void assert_root_child(const char *window_id) {
  unsigned long numeric_id;
  char window_hex[32];
  char output[8192];
  numeric_id = strtoul(window_id, NULL, 10);
  snprintf(window_hex, sizeof(window_hex), "0x%lx", numeric_id);
  if (read_command_output(output, sizeof(output),
                          "DISPLAY=%s %s -root -children", DISPLAY_VALUE,
                          XWININFO_BIN) != 0) {
    fail("xwininfo failed for root children");
  }
  if (!strstr(output, window_hex)) {
    fail("window %s missing from root children", window_id);
  }
}
static int get_stacking_order(const char *window_ids[], size_t window_count,
                              char order[][32], size_t order_capacity) {
  char output[16384];
  const char *line;
  size_t count = 0U;
  size_t i;
  if (read_command_output(output, sizeof(output),
                          "DISPLAY=%s %s -root -children", DISPLAY_VALUE,
                          XWININFO_BIN) != 0) {
    fail("xwininfo failed for stacking order");
  }
  line = strtok(output, "\n");
  while (line) {
    const char *trimmed = line;
    while (*trimmed == ' ') {
      trimmed++;
    }
    if (strncmp(trimmed, "0x", (size_t)2) == 0) {
      unsigned long token_hex;
      token_hex = strtoul(trimmed, NULL, 16);
      for (i = 0U; i < window_count; i++) {
        unsigned long candidate;
        candidate = strtoul(window_ids[i], NULL, 10);
        if (candidate == token_hex) {
          if (count >= order_capacity) {
            fail("stacking order buffer too small");
          }
          if (strlen(window_ids[i]) >= sizeof(order[count])) {
            fail("window id too long for stacking buffer");
          }
          memcpy(order[count], window_ids[i], strlen(window_ids[i]) + 1U);
          count++;
          break;
        }
      }
    }
    line = strtok(NULL, "\n");
  }
  return (int)count;
}
static void assert_in_stacking(const char *window_id, const char *window_ids[],
                               size_t window_count) {
  char order[16][32];
  int count;
  int i;
  count = get_stacking_order(window_ids, window_count, order, (size_t)16);
  for (i = 0; i < count; i++) {
    if (strcmp(order[i], window_id) == 0) {
      return;
    }
  }
  fail("window missing from stacking order: %s", window_id);
}
static void get_first_window_by_name(const char *name, char *buffer,
                                     size_t buffer_size) {
  if (read_command_output(buffer, buffer_size,
                          "%s -c 'DISPLAY=%s %s search --name \"^%s$\" | "
                          "head -n1'",
                          SHELL_BIN, DISPLAY_VALUE, XDOTOOL_BIN, name) != 0 ||
      buffer[0] == '\0') {
    fail("failed to locate window named %s", name);
  }
}
static void get_window_name(const char *window_id, char *buffer,
                            size_t buffer_size) {
  if (read_command_output(buffer, buffer_size, "DISPLAY=%s %s getwindowname %s",
                          DISPLAY_VALUE, XDOTOOL_BIN, window_id) != 0) {
    fail("failed to get window name for %s", window_id);
  }
}
static void get_window_geometry(const char *window_id,
                                WindowGeometry *geometry) {
  char output[4096];
  const char *line;
  int width_found = 0;
  int height_found = 0;
  int x_found = 0;
  int y_found = 0;
  if (!geometry) {
    fail("geometry pointer was null");
  }
  geometry->width = 0L;
  geometry->height = 0L;
  geometry->x = -1L;
  geometry->y = -1L;
  if (read_command_output(output, sizeof(output), "DISPLAY=%s %s -id %s",
                          DISPLAY_VALUE, XWININFO_BIN, window_id) != 0) {
    fail("failed to inspect window %s", window_id);
  }
  line = strtok(output, "\n");
  while (line) {
    if (sscanf(line, "  Width: %ld", &geometry->width) == 1) {
      width_found = 1;
    } else if (sscanf(line, "  Height: %ld", &geometry->height) == 1) {
      height_found = 1;
    } else if (sscanf(line, "  Absolute upper-left X: %ld", &geometry->x) ==
               1) {
      x_found = 1;
    } else if (sscanf(line, "  Absolute upper-left Y: %ld", &geometry->y) ==
               1) {
      y_found = 1;
    }
    line = strtok(NULL, "\n");
  }
  if (!width_found || !height_found || !x_found || !y_found) {
    fail("failed to parse geometry for %s", window_id);
  }
}
static void get_focused_window(char *buffer, size_t buffer_size) {
  if (read_command_output(buffer, buffer_size, "DISPLAY=%s %s getwindowfocus",
                          DISPLAY_VALUE, XDOTOOL_BIN) != 0) {
    fail("failed to get focused window");
  }
}
static int count_windows_by_name(const char *name_pattern) {
  char output[128];
  if (read_command_output(output, sizeof(output),
                          "%s -c 'DISPLAY=%s %s search --name \"%s\" "
                          "2>/dev/null | wc -l'",
                          SHELL_BIN, DISPLAY_VALUE, XDOTOOL_BIN,
                          name_pattern) != 0) {
    return 0;
  }
  return atoi(output);
}
static int get_windows_by_class(const char *class_name, char windows[][32],
                                size_t capacity) {
  char output[4096];
  const char *line;
  size_t count = 0U;
  if (read_command_output(output, sizeof(output),
                          "DISPLAY=%s %s search --class %s", DISPLAY_VALUE,
                          XDOTOOL_BIN, class_name) != 0) {
    return 0;
  }
  line = strtok(output, "\n");
  while (line) {
    if (count >= capacity) {
      fail("window class buffer too small");
    }
    if (strlen(line) >= sizeof(windows[count])) {
      fail("window id too long for class buffer");
    }
    memcpy(windows[count], line, strlen(line) + 1U);
    count++;
    line = strtok(NULL, "\n");
  }
  return (int)count;
}
static int find_new_window(const char *existing[], size_t existing_count,
                           const char *current[], size_t current_count,
                           char *buffer, size_t buffer_size) {
  size_t i;
  size_t j;
  for (i = 0U; i < current_count; i++) {
    int found;
    found = 0;
    for (j = 0U; j < existing_count; j++) {
      if (strcmp(current[i], existing[j]) == 0) {
        found = 1;
        break;
      }
    }
    if (!found) {
      if (strlen(current[i]) >= buffer_size) {
        fail("new window id too long for destination buffer");
      }
      memcpy(buffer, current[i], strlen(current[i]) + 1U);
      return 1;
    }
  }
  return 0;
}
static void send_root_key(const char *key_spec) {
  if (run_shell("DISPLAY=%s %s key --window root %s >/dev/null 2>&1",
                DISPLAY_VALUE, XDOTOOL_BIN, key_spec) != 0) {
    fail("failed to send key %s", key_spec);
  }
}
static void close_window(const char *window_id) {
  if (run_shell("DISPLAY=%s %s windowclose %s >/dev/null 2>&1", DISPLAY_VALUE,
                XDOTOOL_BIN, window_id) != 0) {
    fail("failed to close window %s", window_id);
  }
}
static void kill_window(const char *window_id) {
  if (run_shell("DISPLAY=%s %s windowkill %s >/dev/null 2>&1", DISPLAY_VALUE,
                XDOTOOL_BIN, window_id) != 0) {
    fail("failed to kill window %s", window_id);
  }
}
static void map_window(const char *window_id) {
  if (run_shell("DISPLAY=%s %s windowmap %s >/dev/null 2>&1", DISPLAY_VALUE,
                XDOTOOL_BIN, window_id) != 0) {
    fail("failed to map window %s", window_id);
  }
}
static void unmap_window(const char *window_id) {
  if (run_shell("DISPLAY=%s %s windowunmap %s >/dev/null 2>&1", DISPLAY_VALUE,
                XDOTOOL_BIN, window_id) != 0) {
    fail("failed to unmap window %s", window_id);
  }
}
static void trim_trailing_newlines(char *buffer) {
  size_t length;
  if (!buffer) {
    return;
  }
  length = strlen(buffer);
  while (length > 0U &&
         (buffer[length - 1U] == '\n' || buffer[length - 1U] == '\r')) {
    buffer[length - 1U] = '\0';
    length--;
  }
}
static void wait_for_window_count_by_name(const char *name_pattern,
                                          int expected_count) {
  int count;
  int elapsed_tenths;
  count = 0;
  elapsed_tenths = 0;
  while (elapsed_tenths < TEST_TIMEOUT_SECONDS * 10) {
    count = count_windows_by_name(name_pattern);
    if (count == expected_count) {
      return;
    }
    usleep(100000U);
    elapsed_tenths++;
  }
  fail("unexpected window count for %s: %d != %d", name_pattern, count,
       expected_count);
}
static void assert_file_contains(const char *path, const char *needle) {
  char line[1024];
  FILE *file;
  file = fopen(path, "r");
  if (!file) {
    fail("failed to open %s", path);
  }
  while (fgets(line, (int)sizeof(line), file)) {
    if (strstr(line, needle)) {
      fclose(file);
      return;
    }
  }
  fclose(file);
  fail("did not find \"%s\" in %s", needle, path);
}
static void assert_focus_unchanged(const char *key_spec,
                                   const char *expected_window_id) {
  send_root_key(key_spec);
  usleep(300000U);
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" = \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, expected_window_id);
}
static void assert_fswm_survives_key(const char *key_spec) {
  send_root_key(key_spec);
  usleep(300000U);
  if (!process_alive(context.fswm_pid)) {
    fail("fswm exited unexpectedly after key %s", key_spec);
  }
}
static void assert_second_wm_rejected(void) {
  char fswm_bin[] = FSWM_BIN;
  char xterm_bin[] = XTERM_BIN;
  char xterm_title_flag[] = "-T";
  char spawn_title[] = "spawn";
  char *fswm_argv[5];
  pid_t conflict_pid;
  int i;
  fswm_argv[0] = fswm_bin;
  fswm_argv[1] = xterm_bin;
  fswm_argv[2] = xterm_title_flag;
  fswm_argv[3] = spawn_title;
  fswm_argv[4] = NULL;
  conflict_pid = spawn_logged_process(context.fswm_conflict_log, fswm_argv);
  for (i = 0; i < TEST_TIMEOUT_SECONDS * 10; i++) {
    if (!process_alive(conflict_pid)) {
      break;
    }
    usleep(100000U);
  }
  if (process_alive(conflict_pid)) {
    fail("second fswm instance did not exit");
  }
  if (!process_alive(context.fswm_pid)) {
    fail("primary fswm exited during conflict test");
  }
  assert_file_contains(context.fswm_conflict_log,
                       "another window manager is already running");
}
static void run_test(void) {
  char w1[32];
  char w2[32];
  char w3[32];
  char w4[32];
  char w5[32];
  char w6[32];
  char w7[32];
  char w8[32];
  char focused[32];
  char focused_after[32];
  char name[128];
  char order_before[16][32];
  char order_after[16][32];
  char xterm_before[16][32];
  char xterm_after[16][32];
  const char *pair_ids[2];
  const char *quad_ids[4];
  WindowGeometry geometry;
  int min_width;
  int min_height;
  int i;
  int count_before;
  int count_after;
  int j;
  long rss_after_churn;
  long hwm_after_churn;
  long swap_after_churn;
  long threads_after_churn;
  char order[16][32];
  const char *xterm_before_ptrs[16];
  const char *xterm_after_ptrs[16];
  const char *pair_after_close[2];
  char xterm_bin[] = XTERM_BIN;
  char xterm_title_flag[] = "-T";
  char xterm_title_one[] = "one";
  char xterm_title_two[] = "two";
  char xterm_title_anchor[] = "anchor";
  char xterm_title_middle[] = "middle";
  char xterm_title_detached[] = "detached";
  char *xterm_one_argv[4];
  char *xterm_two_argv[4];
  char *xterm_anchor_argv[4];
  char *xterm_middle_argv[4];
  char *xterm_detached_argv[4];
  xterm_one_argv[0] = xterm_bin;
  xterm_one_argv[1] = xterm_title_flag;
  xterm_one_argv[2] = xterm_title_one;
  xterm_one_argv[3] = NULL;
  xterm_two_argv[0] = xterm_bin;
  xterm_two_argv[1] = xterm_title_flag;
  xterm_two_argv[2] = xterm_title_two;
  xterm_two_argv[3] = NULL;
  xterm_anchor_argv[0] = xterm_bin;
  xterm_anchor_argv[1] = xterm_title_flag;
  xterm_anchor_argv[2] = xterm_title_anchor;
  xterm_anchor_argv[3] = NULL;
  xterm_middle_argv[0] = xterm_bin;
  xterm_middle_argv[1] = xterm_title_flag;
  xterm_middle_argv[2] = xterm_title_middle;
  xterm_middle_argv[3] = NULL;
  xterm_detached_argv[0] = xterm_bin;
  xterm_detached_argv[1] = xterm_title_flag;
  xterm_detached_argv[2] = xterm_title_detached;
  xterm_detached_argv[3] = NULL;
  info("start xvfb and fswm");
  start_environment();
  info("reject second window manager on same display");
  assert_second_wm_rejected();
  info("map initial windows fullscreen");
  spawn_logged_process(context.xterm_one_log, xterm_one_argv);
  spawn_logged_process(context.xterm_two_log, xterm_two_argv);
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c 'DISPLAY=%s %s search --name \"^one$\" >/dev/null'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN);
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c 'DISPLAY=%s %s search --name \"^two$\" >/dev/null'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN);
  wait_for_window_count_by_name("^(one|two)$", 2);
  get_first_window_by_name("one", w1, sizeof(w1));
  get_first_window_by_name("two", w2, sizeof(w2));
  get_window_name(w1, name, sizeof(name));
  if (strcmp(name, "one") != 0) {
    fail("window name mismatch for w1: %s", name);
  }
  get_window_name(w2, name, sizeof(name));
  if (strcmp(name, "two") != 0) {
    fail("window name mismatch for w2: %s", name);
  }
  min_width = SCREEN_WIDTH - 32;
  min_height = SCREEN_HEIGHT - 32;
  map_window(w1);
  map_window(w2);
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c 'DISPLAY=%s %s -id %s | grep -q \"Map State: IsViewable\"'",
      SHELL_BIN, DISPLAY_VALUE, XWININFO_BIN, w1);
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c 'DISPLAY=%s %s -id %s | grep -q \"Map State: IsViewable\"'",
      SHELL_BIN, DISPLAY_VALUE, XWININFO_BIN, w2);
  get_window_geometry(w1, &geometry);
  if (geometry.width < min_width || geometry.height < min_height ||
      geometry.x != 0L || geometry.y != 0L) {
    fail("unexpected geometry for w1: %ldx%ld at %ld,%ld", geometry.width,
         geometry.height, geometry.x, geometry.y);
  }
  get_window_geometry(w2, &geometry);
  if (geometry.width < min_width || geometry.height < min_height ||
      geometry.x != 0L || geometry.y != 0L) {
    fail("unexpected geometry for w2: %ldx%ld at %ld,%ld", geometry.width,
         geometry.height, geometry.x, geometry.y);
  }
  assert_no_sanitizer_errors();
  info("cycle focus between the first two windows");
  pair_ids[0] = w1;
  pair_ids[1] = w2;
  get_focused_window(focused, sizeof(focused));
  if (strcmp(focused, w1) != 0 && strcmp(focused, w2) != 0) {
    fail("initial focus not on expected window: %s", focused);
  }
  assert_root_child(w1);
  assert_root_child(w2);
  assert_in_stacking(focused, pair_ids, (size_t)2);
  send_root_key("Alt+Tab");
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" != \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, focused);
  get_focused_window(focused_after, sizeof(focused_after));
  if (strcmp(focused_after, w1) != 0 && strcmp(focused_after, w2) != 0) {
    fail("focus not on expected window after first Alt+Tab: %s", focused_after);
  }
  assert_in_stacking(focused_after, pair_ids, (size_t)2);
  count_before =
      get_stacking_order(pair_ids, (size_t)2, order_before, (size_t)16);
  send_root_key("Alt+Tab");
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" = \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, focused);
  count_after =
      get_stacking_order(pair_ids, (size_t)2, order_after, (size_t)16);
  if (count_before == count_after) {
    int identical;
    identical = 1;
    for (i = 0; i < count_before; i++) {
      if (strcmp(order_before[i], order_after[i]) != 0) {
        identical = 0;
        break;
      }
    }
    if (identical) {
      fail("stacking order did not change after focus switch");
    }
  }
  send_root_key("Alt+Shift+Tab");
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" = \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, focused_after);
  info("ignore near-miss shortcuts");
  assert_focus_unchanged("Tab", focused_after);
  assert_fswm_survives_key("Delete");
  info("spawn new terminals and keep them managed");
  count_before = get_windows_by_class("xterm", xterm_before, (size_t)16);
  send_root_key("ctrl+t");
  usleep(300000U);
  count_after = get_windows_by_class("xterm", xterm_after, (size_t)16);
  if (count_after != count_before) {
    fail("non-matching spawn shortcut created a window");
  }
  send_root_key("ctrl+alt+t");
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c 'DISPLAY=%s %s search --name \"^spawn$\" >/dev/null'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN);
  get_first_window_by_name("spawn", w3, sizeof(w3));
  if (strcmp(w3, w1) == 0 || strcmp(w3, w2) == 0) {
    fail("spawn window id overlaps existing window: %s", w3);
  }
  get_window_name(w3, name, sizeof(name));
  if (strcmp(name, "spawn") != 0) {
    fail("window name mismatch for w3: %s", name);
  }
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" = \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, w3);
  quad_ids[0] = w1;
  quad_ids[1] = w2;
  quad_ids[2] = w3;
  quad_ids[3] = NULL;
  assert_root_child(w3);
  assert_in_stacking(w3, quad_ids, (size_t)3);
  {
    int present;
    for (i = 0; i < 20; i++) {
      int order_count;
      get_focused_window(focused_after, sizeof(focused_after));
      order_count = get_stacking_order(quad_ids, (size_t)3, order, (size_t)16);
      if (strcmp(focused_after, w3) == 0 && order_count > 0) {
        present = 0;
        for (j = 0; j < order_count; j++) {
          if (strcmp(order[j], w3) == 0) {
            present = 1;
            break;
          }
        }
        if (present) {
          break;
        }
      }
      usleep(200000U);
    }
    if (i == 20) {
      fail("spawn not focused and raised on map");
    }
  }
  count_before = get_windows_by_class("xterm", xterm_before, (size_t)16);
  for (i = 0; i < count_before; i++) {
    xterm_before_ptrs[i] = xterm_before[i];
  }
  send_root_key("ctrl+alt+t");
  for (i = 0; i < 40; i++) {
    count_after = get_windows_by_class("xterm", xterm_after, (size_t)16);
    if (count_after >= count_before + 1) {
      break;
    }
    usleep(500000U);
  }
  if (i == 40) {
    fail("second spawn did not create a new xterm window");
  }
  for (i = 0; i < count_after; i++) {
    xterm_after_ptrs[i] = xterm_after[i];
  }
  if (!find_new_window(xterm_before_ptrs, (size_t)count_before,
                       xterm_after_ptrs, (size_t)count_after, w4, sizeof(w4))) {
    fail("failed to identify second spawn window");
  }
  get_focused_window(focused_after, sizeof(focused_after));
  if (strcmp(focused_after, w3) != 0 && strcmp(focused_after, w4) != 0) {
    fail("focus not on a spawn window after second spawn: %s", focused_after);
  }
  quad_ids[3] = w4;
  assert_root_child(w4);
  assert_in_stacking(w4, quad_ids, (size_t)4);
  get_window_geometry(w3, &geometry);
  if (geometry.width < min_width || geometry.height < min_height ||
      geometry.x != 0L || geometry.y != 0L) {
    fail("unexpected geometry for w3: %ldx%ld at %ld,%ld", geometry.width,
         geometry.height, geometry.x, geometry.y);
  }
  info("window churn remains stable under sanitizers");
  churn_window(w4, 512);
  churn_window(w4, 512);
  rss_after_churn = parse_status_field(context.fswm_pid, "VmRSS");
  hwm_after_churn = parse_status_field(context.fswm_pid, "VmHWM");
  swap_after_churn = parse_status_field(context.fswm_pid, "VmSwap");
  threads_after_churn = parse_status_field(context.fswm_pid, "Threads");
  if (rss_after_churn > RSS_PIN_KIB) {
    fail("fswm rss crossed pinned ceiling: %ld KiB > %ld KiB", rss_after_churn,
         RSS_PIN_KIB);
  }
  if (hwm_after_churn > HWM_PIN_KIB) {
    fail("fswm vmhwm crossed pinned ceiling: %ld KiB > %ld KiB",
         hwm_after_churn, HWM_PIN_KIB);
  }
  if (hwm_after_churn < rss_after_churn) {
    fail("fswm vmhwm dropped below vmrss: VmHWM=%ld VmRSS=%ld", hwm_after_churn,
         rss_after_churn);
  }
  if (swap_after_churn != 0L) {
    fail("fswm started swapping unexpectedly: VmSwap=%ld KiB",
         swap_after_churn);
  }
  if (threads_after_churn != 1L) {
    fail("fswm thread count changed unexpectedly: Threads=%ld",
         threads_after_churn);
  }
  assert_no_sanitizer_errors();
  info("cycle focus across managed windows");
  get_focused_window(focused, sizeof(focused));
  send_root_key("Alt+Tab");
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" != \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, focused);
  get_focused_window(focused_after, sizeof(focused_after));
  if (strcmp(focused_after, w1) != 0 && strcmp(focused_after, w2) != 0 &&
      strcmp(focused_after, w3) != 0 && strcmp(focused_after, w4) != 0) {
    fail("focus moved outside managed windows after Alt+Tab: %s",
         focused_after);
  }
  send_root_key("Alt+Shift+Tab");
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" = \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, focused);
  {
    char seen[4][32];
    int seen_count;
    seen_count = 0;
    if (strlen(focused) >= sizeof(seen[seen_count])) {
      fail("focused window id too long for seen buffer");
    }
    memcpy(seen[seen_count], focused, strlen(focused) + 1U);
    seen_count++;
    for (i = 0; i < 4; i++) {
      int found;
      send_root_key("Alt+Tab");
      get_focused_window(focused_after, sizeof(focused_after));
      found = 0;
      for (j = 0; j < seen_count; j++) {
        if (strcmp(seen[j], focused_after) == 0) {
          found = 1;
          break;
        }
      }
      if (!found && seen_count < 4) {
        if (strlen(focused_after) >= sizeof(seen[seen_count])) {
          fail("focused window id too long for seen buffer");
        }
        memcpy(seen[seen_count], focused_after, strlen(focused_after) + 1U);
        seen_count++;
      }
    }
    if (seen_count < 3) {
      fail("unexpected focus walk across managed windows");
    }
    for (i = 0; i < 4; i++) {
      get_focused_window(focused_after, sizeof(focused_after));
      if (strcmp(focused_after, focused) == 0) {
        break;
      }
      send_root_key("Alt+Shift+Tab");
    }
    if (i == 4) {
      fail("failed to navigate focus back to the starting window");
    }
  }
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" = \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, focused);
  assert_in_stacking(focused, quad_ids, (size_t)4);
  for (i = 0; i < 4; i++) {
    get_focused_window(focused_after, sizeof(focused_after));
    if (strcmp(focused_after, w1) == 0) {
      break;
    }
    send_root_key("Alt+Tab");
  }
  if (i == 4) {
    fail("failed to navigate focus back to w1 before close checks");
  }
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" = \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, w1);
  info("closing windows updates focus sanely");
  close_window(w2);
  wait_for_window_count_by_name("^two$", 0);
  get_focused_window(focused_after, sizeof(focused_after));
  if (strcmp(focused_after, w1) != 0 && strcmp(focused_after, w3) != 0 &&
      strcmp(focused_after, w4) != 0) {
    fail("focus moved outside surviving windows after closing w2: %s",
         focused_after);
  }
  close_window(w1);
  wait_for_window_count_by_name("^one$", 0);
  get_focused_window(focused_after, sizeof(focused_after));
  if (strcmp(focused_after, w3) != 0 && strcmp(focused_after, w4) != 0) {
    fail("focus moved outside surviving windows after closing w1: %s",
         focused_after);
  }
  assert_no_sanitizer_errors();
  info("unmap remap and single-window behavior stay stable");
  for (i = 0; i < 10; i++) {
    send_root_key("Alt+Tab");
  }
  get_focused_window(focused_after, sizeof(focused_after));
  if (strcmp(focused_after, w3) != 0 && strcmp(focused_after, w4) != 0) {
    fail("focus not on expected window after Alt+Tab spam: %s", focused_after);
  }
  pair_after_close[0] = w3;
  pair_after_close[1] = w4;
  assert_in_stacking(w3, pair_after_close, (size_t)2);
  assert_in_stacking(w4, pair_after_close, (size_t)2);
  unmap_window(w4);
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c 'DISPLAY=%s %s -id %s | grep -q \"Map State: IsUnMapped\"'",
      SHELL_BIN, DISPLAY_VALUE, XWININFO_BIN, w4);
  map_window(w4);
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c 'DISPLAY=%s %s -id %s | grep -q \"Map State: IsViewable\"'",
      SHELL_BIN, DISPLAY_VALUE, XWININFO_BIN, w4);
  assert_root_child(w4);
  info("destroyed windows update focus sanely");
  kill_window(w4);
  wait_until_succeeds(TEST_TIMEOUT_SECONDS,
                      "%s -c '! DISPLAY=%s %s -id %s >/dev/null 2>&1'",
                      SHELL_BIN, DISPLAY_VALUE, XWININFO_BIN, w4);
  wait_until_succeeds(TEST_TIMEOUT_SECONDS,
                      "%s -c 'DISPLAY=%s %s -id %s >/dev/null 2>&1'", SHELL_BIN,
                      DISPLAY_VALUE, XWININFO_BIN, w3);
  if (!process_alive(context.fswm_pid)) {
    fail("fswm exited after destroyed window");
  }
  get_focused_window(focused_after, sizeof(focused_after));
  if (strcmp(focused_after, w3) != 0) {
    fail("focus did not move to surviving window after destroy: %s",
         focused_after);
  }
  send_root_key("Alt+Tab");
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" = \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, w3);
  send_root_key("Alt+Shift+Tab");
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" = \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, w3);
  close_window(w3);
  wait_until_succeeds(TEST_TIMEOUT_SECONDS,
                      "%s -c '[ \"$(DISPLAY=%s %s search --class xterm "
                      "2>/dev/null | wc -l)\" -eq 0 ]'",
                      SHELL_BIN, DISPLAY_VALUE, XDOTOOL_BIN);
  assert_no_sanitizer_errors();
  info("closing non-focused windows preserves focus and Alt-Tab anchor");
  spawn_logged_process(context.xterm_one_log, xterm_anchor_argv);
  spawn_logged_process(context.fswm_conflict_log, xterm_middle_argv);
  spawn_logged_process(context.xterm_two_log, xterm_detached_argv);
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c 'DISPLAY=%s %s search --name \"^anchor$\" >/dev/null'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN);
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c 'DISPLAY=%s %s search --name \"^middle$\" >/dev/null'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN);
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c 'DISPLAY=%s %s search --name \"^detached$\" >/dev/null'",
      SHELL_BIN, DISPLAY_VALUE, XDOTOOL_BIN);
  get_first_window_by_name("anchor", w5, sizeof(w5));
  get_first_window_by_name("middle", w6, sizeof(w6));
  get_first_window_by_name("detached", w7, sizeof(w7));
  for (i = 0; i < TEST_TIMEOUT_SECONDS * 10; i++) {
    if (read_command_output(focused_after, sizeof(focused_after),
                            "DISPLAY=%s %s getwindowfocus 2>/dev/null",
                            DISPLAY_VALUE, XDOTOOL_BIN) == 0 &&
        (strcmp(focused_after, w5) == 0 || strcmp(focused_after, w6) == 0 ||
         strcmp(focused_after, w7) == 0)) {
      break;
    }
    usleep(100000U);
  }
  if (i == TEST_TIMEOUT_SECONDS * 10) {
    fail("focus did not settle on anchor regression windows");
  }
  for (i = 0; i < 3; i++) {
    get_focused_window(focused_after, sizeof(focused_after));
    if (strcmp(focused_after, w7) == 0) {
      break;
    }
    send_root_key("Alt+Tab");
  }
  if (i == 3) {
    fail("failed to focus detached window before anchor close");
  }
  close_window(w5);
  wait_for_window_count_by_name("^anchor$", 0);
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" = \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, w7);
  send_root_key("ctrl+alt+t");
  wait_for_window_count_by_name("^spawn$", 1);
  get_first_window_by_name("spawn", w8, sizeof(w8));
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" = \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, w8);
  close_window(w8);
  wait_for_window_count_by_name("^spawn$", 0);
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" = \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, w7);
  send_root_key("Alt+Tab");
  wait_until_succeeds(
      TEST_TIMEOUT_SECONDS,
      "%s -c '[ \"$(DISPLAY=%s %s getwindowfocus)\" = \"%s\" ]'", SHELL_BIN,
      DISPLAY_VALUE, XDOTOOL_BIN, w6);
  close_window(w6);
  wait_for_window_count_by_name("^middle$", 0);
  close_window(w7);
  wait_for_window_count_by_name("^detached$", 0);
  assert_no_sanitizer_errors();
  info("wm exits on Ctrl+Alt+Delete");
  send_root_key("Alt+Tab");
  send_root_key("Alt+Shift+Tab");
  if (!process_alive(context.fswm_pid)) {
    fail("fswm exited too early");
  }
  assert_fswm_survives_key("Alt+Delete");
  send_root_key("ctrl+alt+Delete");
  for (i = 0; i < TEST_TIMEOUT_SECONDS * 10; i++) {
    if (!process_alive(context.fswm_pid)) {
      break;
    }
    usleep(100000U);
  }
  if (process_alive(context.fswm_pid)) {
    fail("fswm did not exit on Ctrl+Alt+Delete");
  }
  assert_no_sanitizer_errors();
}
int main(void) {
  memset(&context, 0, sizeof(context));
  atexit(cleanup);
  run_test();
  return 0;
}
