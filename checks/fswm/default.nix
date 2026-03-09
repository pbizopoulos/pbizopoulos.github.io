{ inputs, pkgs, ... }:
pkgs.testers.runNixOSTest {
  name = baseNameOf ./.;
  nodes.machine =
    { pkgs, ... }:
    {
      environment.systemPackages = [
        inputs.self.packages.${pkgs.stdenv.system}.fswm
        pkgs.procps
        pkgs.xdotool
        pkgs.xdpyinfo
        pkgs.xterm
        pkgs.xvfb
        pkgs.xwininfo
      ];
    };
  testScript = ''
    import time
    timeout = 20
    def wait(cmd):
      machine.wait_until_succeeds(cmd, timeout=timeout)
    def assert_root_child(wid):
      wid_hex = hex(int(wid))
      wait(
        f"sh -c 'DISPLAY=:1 xwininfo -root -children | grep -q \"^ *{wid_hex} \"'"
      )
    def stacking_order(ids):
      ids_hex = {hex(int(wid)): wid for wid in ids}
      out = machine.succeed("DISPLAY=:1 xwininfo -root -children")
      order = []
      for line in out.splitlines():
        line = line.lstrip()
        if not line.startswith("0x"):
          continue
        token = line.split()[0]
        if token in ids_hex:
          order.append(ids_hex[token])
      return order
    def assert_in_stacking(wid, ids):
      order = stacking_order(ids)
      if wid not in order:
        raise Exception(f"window missing from stacking list: {wid} in {order}")
    machine.succeed("Xvfb :1 -screen 0 1024x768x24 >/tmp/Xvfb.log 2>&1 &")
    wait("DISPLAY=:1 xdpyinfo >/dev/null")
    machine.succeed("DISPLAY=:1 fswm xterm -T spawn >/tmp/fswm.log 2>&1 &")
    machine.succeed("DISPLAY=:1 xterm -T one >/tmp/xterm-one.log 2>&1 &")
    machine.succeed("DISPLAY=:1 xterm -T two >/tmp/xterm-two.log 2>&1 &")
    wait("DISPLAY=:1 xdotool search --name '^one$' >/dev/null")
    wait("DISPLAY=:1 xdotool search --name '^two$' >/dev/null")
    wait("test \"$(DISPLAY=:1 xdotool search --name '^(one|two)$' | wc -l)\" -eq 2")
    w1 = machine.succeed("DISPLAY=:1 xdotool search --name '^one$' | head -n1").strip()
    w2 = machine.succeed("DISPLAY=:1 xdotool search --name '^two$' | head -n1").strip()
    n1 = machine.succeed(f"DISPLAY=:1 xdotool getwindowname {w1}").strip()
    n2 = machine.succeed(f"DISPLAY=:1 xdotool getwindowname {w2}").strip()
    if n1 != "one":
      raise Exception(f"window name mismatch for w1: {n1}")
    if n2 != "two":
      raise Exception(f"window name mismatch for w2: {n2}")
    dims = machine.succeed("DISPLAY=:1 xdpyinfo | awk '/dimensions:/ {print $2}'").strip()
    screen_w_str, screen_h_str = dims.split("x")
    screen_w = int(screen_w_str)
    screen_h = int(screen_h_str)
    min_w = max(1, screen_w - 32)
    min_h = max(1, screen_h - 32)
    machine.succeed(f"DISPLAY=:1 xdotool windowmap {w1}")
    machine.succeed(f"DISPLAY=:1 xdotool windowmap {w2}")
    wait(f"DISPLAY=:1 xwininfo -id {w1} | grep -q 'Map State: IsViewable'")
    wait(f"DISPLAY=:1 xwininfo -id {w2} | grep -q 'Map State: IsViewable'")
    wait(
      f"test \"$(DISPLAY=:1 xwininfo -id {w1} | awk '/Width:/ {{print $2}}')\" -ge {min_w}"
    )
    wait(
      f"test \"$(DISPLAY=:1 xwininfo -id {w1} | awk '/Height:/ {{print $2}}')\" -ge {min_h}"
    )
    wait(
      f"test \"$(DISPLAY=:1 xwininfo -id {w1} | awk '/Absolute upper-left X:/ {{print $4}}')\" -eq 0"
    )
    wait(
      f"test \"$(DISPLAY=:1 xwininfo -id {w1} | awk '/Absolute upper-left Y:/ {{print $4}}')\" -eq 0"
    )
    wait(
      f"test \"$(DISPLAY=:1 xwininfo -id {w2} | awk '/Width:/ {{print $2}}')\" -ge {min_w}"
    )
    wait(
      f"test \"$(DISPLAY=:1 xwininfo -id {w2} | awk '/Height:/ {{print $2}}')\" -ge {min_h}"
    )
    wait(
      f"test \"$(DISPLAY=:1 xwininfo -id {w2} | awk '/Absolute upper-left X:/ {{print $4}}')\" -eq 0"
    )
    wait(
      f"test \"$(DISPLAY=:1 xwininfo -id {w2} | awk '/Absolute upper-left Y:/ {{print $4}}')\" -eq 0"
    )
    f0 = machine.succeed("DISPLAY=:1 xdotool getwindowfocus").strip()
    if f0 not in (w1, w2):
      raise Exception(f"initial focus not on expected window: {f0}")
    assert_root_child(w1)
    assert_root_child(w2)
    assert_in_stacking(f0, [w1, w2])
    machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Tab")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" != \"{f0}\"")
    f1 = machine.succeed("DISPLAY=:1 xdotool getwindowfocus").strip()
    if f1 not in (w1, w2):
      raise Exception(f"focus not on expected window after first Alt+Tab: {f1}")
    assert_in_stacking(f1, [w1, w2])
    order_before = stacking_order([w1, w2])
    machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Tab")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{f0}\"")
    order_after = stacking_order([w1, w2])
    if order_before == order_after:
      raise Exception(f"stacking order did not change after focus switch: {order_after}")
    machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Shift+Tab")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{f1}\"")
    assert_in_stacking(f1, [w1, w2])
    machine.succeed("DISPLAY=:1 xdotool key --window root Ctrl+Alt+t")
    wait("DISPLAY=:1 xdotool search --name '^spawn$' >/dev/null")
    w3 = machine.succeed("DISPLAY=:1 xdotool search --name '^spawn$' | head -n1").strip()
    if w3 in (w1, w2):
      raise Exception(f"spawn window id overlaps existing window: {w3}")
    n3 = machine.succeed(f"DISPLAY=:1 xdotool getwindowname {w3}").strip()
    if n3 != "spawn":
      raise Exception(f"window name mismatch for w3: {n3}")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{w3}\"")
    assert_root_child(w3)
    assert_in_stacking(w3, [w1, w2, w3])
    for _ in range(20):
      f_spawn = machine.succeed("DISPLAY=:1 xdotool getwindowfocus").strip()
      order_spawn = stacking_order([w1, w2, w3])
      if f_spawn == w3 and w3 in order_spawn:
        break
      time.sleep(0.2)
    else:
      raise Exception(f"spawn not focused+raised on map: focus={f_spawn} order={order_spawn}")
    xterm_before = machine.succeed("DISPLAY=:1 xdotool search --class xterm").split()
    machine.succeed("DISPLAY=:1 xdotool key --window root Ctrl+Alt+t")
    for _ in range(40):
      xterm_ids = machine.succeed("DISPLAY=:1 xdotool search --class xterm").split()
      if len(set(xterm_ids)) >= len(set(xterm_before)) + 1:
        break
      time.sleep(0.5)
    else:
      raise Exception(f"second spawn did not create a new xterm window: {xterm_before} -> {xterm_ids}")
    if w3 not in xterm_ids:
      raise Exception(f"original spawn window missing after second spawn: {xterm_ids}")
    new_spawns = [wid for wid in xterm_ids if wid not in xterm_before]
    if len(new_spawns) != 1:
      raise Exception(f"unexpected new xterm windows: {xterm_before} -> {xterm_ids}")
    w4 = new_spawns[0]
    f_spawn2 = machine.succeed("DISPLAY=:1 xdotool getwindowfocus").strip()
    if f_spawn2 not in (w3, w4):
      raise Exception(f"focus not on a spawn window after second spawn: {f_spawn2}")
    assert_root_child(w4)
    assert_in_stacking(w4, [w1, w2, w3, w4])
    wait(
      f"test \"$(DISPLAY=:1 xwininfo -id {w3} | awk '/Width:/ {{print $2}}')\" -ge {min_w}"
    )
    wait(
      f"test \"$(DISPLAY=:1 xwininfo -id {w3} | awk '/Height:/ {{print $2}}')\" -ge {min_h}"
    )
    wait(
      f"test \"$(DISPLAY=:1 xwininfo -id {w3} | awk '/Absolute upper-left X:/ {{print $4}}')\" -eq 0"
    )
    wait(
      f"test \"$(DISPLAY=:1 xwininfo -id {w3} | awk '/Absolute upper-left Y:/ {{print $4}}')\" -eq 0"
    )
    machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Tab")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{w1}\"")
    machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Shift+Tab")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{w3}\"")
    assert_in_stacking(w3, [w1, w2, w3])
    f_a = machine.succeed("DISPLAY=:1 xdotool getwindowfocus").strip()
    machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Tab")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" != \"{f_a}\"")
    f_b = machine.succeed("DISPLAY=:1 xdotool getwindowfocus").strip()
    machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Tab")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" != \"{f_b}\"")
    f_c = machine.succeed("DISPLAY=:1 xdotool getwindowfocus").strip()
    if {f_a, f_b, f_c} != {w1, w2, w3}:
      raise Exception(f"focus cycle mismatch: {f_a}, {f_b}, {f_c}")
    machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Tab")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{f_a}\"")
    assert_in_stacking(f_c, [w1, w2, w3])
    machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Tab")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{w1}\"")
    machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Tab")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{w2}\"")
    f_before_close = w2
    machine.succeed(f"DISPLAY=:1 xdotool windowclose {w2}")
    wait("test \"$(DISPLAY=:1 xdotool search --name '^two$' 2>/dev/null | wc -l)\" -eq 0")
    wait(f"sh -c '! xwininfo -id {w2} >/dev/null 2>&1'")
    wait(f"DISPLAY=:1 xwininfo -id {w1} >/dev/null")
    wait(f"DISPLAY=:1 xwininfo -id {w3} >/dev/null")
    if f_before_close == w2:
      wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{w1}\"")
    machine.succeed(f"DISPLAY=:1 xdotool windowclose {w1}")
    wait("test \"$(DISPLAY=:1 xdotool search --name '^one$' 2>/dev/null | wc -l)\" -eq 0")
    wait(f"sh -c '! xwininfo -id {w1} >/dev/null 2>&1'")
    wait(f"DISPLAY=:1 xwininfo -id {w3} >/dev/null")
    wait(f"DISPLAY=:1 xwininfo -id {w4} >/dev/null")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{w3}\"")
    for _ in range(10):
      machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Tab")
    f_spam = machine.succeed("DISPLAY=:1 xdotool getwindowfocus").strip()
    if f_spam not in (w3, w4):
      raise Exception(f"focus not on expected window after Alt+Tab spam: {f_spam}")
    assert_in_stacking(w3, [w3, w4])
    assert_in_stacking(w4, [w3, w4])
    machine.succeed(f"DISPLAY=:1 xdotool windowunmap {w4}")
    wait(f"sh -c \"! xwininfo -id {w4} | grep -q 'Map State: IsViewable'\"")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{w3}\"")
    machine.succeed(f"DISPLAY=:1 xdotool windowmap {w4}")
    wait(f"DISPLAY=:1 xwininfo -id {w4} | grep -q 'Map State: IsViewable'")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{w4}\"")
    machine.succeed(f"DISPLAY=:1 xdotool windowclose {w4}")
    wait(f"sh -c '! xwininfo -id {w4} >/dev/null 2>&1'")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{w3}\"")
    machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Tab")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{w3}\"")
    machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Shift+Tab")
    wait(f"test \"$(DISPLAY=:1 xdotool getwindowfocus)\" = \"{w3}\"")
    machine.succeed(f"DISPLAY=:1 xdotool windowclose {w3}")
    wait(f"sh -c '! xwininfo -id {w3} >/dev/null 2>&1'")
    wait("test \"$(DISPLAY=:1 xdotool search --class xterm 2>/dev/null | wc -l)\" -eq 0")
    machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Tab")
    machine.succeed("DISPLAY=:1 xdotool key --window root Alt+Shift+Tab")
    wait("pgrep -x fswm >/dev/null")
    wait("pgrep -x fswm >/dev/null")
    machine.succeed("DISPLAY=:1 xdotool key --window root Ctrl+Alt+Delete")
    wait("! pgrep -x fswm >/dev/null")
  '';
}
