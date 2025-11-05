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
      hostname="$1"
      username="$2"
      disk="$3"
      sudo mount "${disk}" /mnt
      git -C "/mnt/${username}" archive -o ~/repo.tar.gz HEAD
      sudo umount /mnt
      disko --flake "github:pbizopoulos/pbizopoulos.github.io#${hostname}" --mode disko
      nixos-install --flake "github:pbizopoulos/pbizopoulos.github.io#${hostname}" --no-root-passwd
      mkdir -p /mnt/persistent/passwords
      mkpasswd -m sha-512 >"/mnt/persistent/passwords/${username}"
      tar xzf ~/repo.tar.gz -C "/mnt/home/${username}"
      git -C "/mnt/home/${username}" add -f .
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
  users.motd = "Run 'install-nixos <hostname> <username> <disk>'";
  virtualisation.vmVariant.virtualisation.graphics = false;
}
