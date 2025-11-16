{ modulesPath, pkgs, ... }:
let
  installNixos = pkgs.writeShellApplication {
    name = "install-nixos";
    runtimeInputs = [
      pkgs.disko
      pkgs.git
      pkgs.mkpasswd
      pkgs.nixos-install
    ];
    text = ''
      set -euo pipefail
      if [ "$#" -ne 3 ]; then
        echo "Usage: install-nixos <hostname> <username> <disk>" >&2
        exit 1
      fi
      TMPDIR="$(mktemp -d)"
      trap 'rm -rf "$TMPDIR"' EXIT
      sudo mount "$3" /mnt
      if git -C "/mnt/$2" rev-parse &>/dev/null; then
        git clone "/mnt/$2" "$TMPDIR/repo"
      fi
      sudo umount /mnt
      sudo disko --flake "github:pbizopoulos/pbizopoulos.github.io#$1" --mode disko
      sudo nixos-install --flake "github:pbizopoulos/pbizopoulos.github.io#$1" --no-root-passwd
      sudo mkdir -p /mnt/persistent/passwords
      mkpasswd -m sha-512 > "$2"
      sudo mv "$2" "/mnt/persistent/passwords/"
      if [ -d "$TMPDIR/repo/.git" ]; then
        git clone "$TMPDIR/repo" "/mnt/home/$2"
        git -C "/mnt/home/$2" remote remove origin
      fi
    '';
  };
in
{
  environment.systemPackages = [ installNixos ];
  imports = [
    ../laptop/hardware-configuration.nix
    (modulesPath + "/installer/cd-dvd/installation-cd-minimal.nix")
  ];
  nix.settings.experimental-features = [
    "flakes"
    "nix-command"
  ];
  nixpkgs.config = {
    allowUnfree = true;
    permittedInsecurePackages = [ "broadcom-sta-6.30.223.271-59-6.12.57" ];
  };
  users.motd = "Run 'install-nixos <hostname> <username> <disk>'";
  virtualisation.vmVariant.virtualisation.graphics = false;
}
