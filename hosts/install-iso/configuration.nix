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
        echo "Usage: sudo install-nixos <hostname> <username> <disk>" >&2
        exit 1
      fi
      mount "$3" /mnt
      if git -C "/mnt/$2" rev-parse >/dev/null 2>&1; then
        git -C "/mnt/$2" archive -o ~/repo.tar.gz
      fi
      umount /mnt
      disko --flake "github:pbizopoulos/pbizopoulos.github.io#$1" --mode disko
      nixos-install --flake "github:pbizopoulos/pbizopoulos.github.io#$1" --no-root-passwd
      mkdir -p /mnt/persistent/passwords
      mkpasswd -m sha-512 >"/mnt/persistent/passwords/$2"
      if git -C "/mnt/$2" rev-parse >/dev/null 2>&1; then
        tar xzf ~/repo.tar.gz -C "/mnt/home/$2"
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
    permittedInsecurePackages = [ "broadcom-sta-6.30.223.271-57-6.12.53" ];
  };
  users.motd = "Run 'sudo install-nixos <hostname> <username> <disk>'";
  virtualisation.vmVariant.virtualisation.graphics = false;
}
