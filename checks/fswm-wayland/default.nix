{ inputs, pkgs, ... }:
let
  fswmPkg = inputs.self.packages.${pkgs.stdenv.system}.fswm-wayland;
in
pkgs.testers.runNixOSTest rec {
  name = builtins.baseNameOf ./.;
  nodes.machine = { pkgs, ... }: {
    environment.systemPackages = with pkgs; [
      fswmPkg
      foot
      procps
      wlrctl
      wtype
    ];
  };
  testScript = ''
    timeout = 30
    def wait(cmd):
      machine.wait_until_succeeds(cmd, timeout=timeout)
    machine.succeed("mkdir -p /tmp/xdg && chmod 700 /tmp/xdg")
    machine.succeed("rm -f /tmp/xdg/wayland-* /tmp/fswm-wayland-focus")
    machine.succeed(
      "XDG_RUNTIME_DIR=/tmp/xdg WLR_BACKENDS=headless WLR_HEADLESS_OUTPUTS=1 "
      "FSWM_WAYLAND_FOCUS_LOG=/tmp/fswm-wayland-focus "
      "fswm-wayland foot -a spawn -T spawn >/tmp/fswm-wayland.log 2>&1 &"
    )
    wait("test -S /tmp/xdg/wayland-0")
    display = machine.succeed(
      "find /tmp/xdg -maxdepth 1 -type s -name 'wayland-*' -printf '%f\n' | head -n1"
    ).strip()
    env = f"XDG_RUNTIME_DIR=/tmp/xdg WAYLAND_DISPLAY={display}"
    machine.succeed(f"{env} foot -a one -T one >/tmp/foot-one.log 2>&1 &")
    machine.succeed(f"{env} foot -a two -T two >/tmp/foot-two.log 2>&1 &")
    wait("pgrep -x foot >/dev/null")
    machine.succeed("pkill -x fswm-wayland")
    wait("! pgrep -x fswm-wayland >/dev/null")
  '';
}
