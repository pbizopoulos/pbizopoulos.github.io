{ modulesPath, pkgs, ... }:
let
  installNixos = pkgs.writeShellApplication {
    name = "install-nixos";
    runtimeInputs = [
      pkgs.disko
      pkgs.git
      pkgs.nixos-install
    ];
    text = ''
      if [ "$1" = "--help" ]; then
        echo "1. sudo mount /dev/sdXN /mnt"
        echo "2. git -C /mnt/<username> archive -o ~/repo.tar.gz"
        echo "3. sudo umount /mnt"
        echo "4. install-nixos <hostname>"
        echo "5. tar xzf ~/repo.tar.gz -C /mnt/home/<username>"
        echo "6. git -C /mnt/home/<username> add -f ."
        exit 1
      fi
      disko --flake "github:pbizopoulos/pbizopoulos.github.io#$1" --mode disko
      nixos-install --flake "github:pbizopoulos/pbizopoulos.github.io#$1" --no-root-passwd
      mkdir -p /mnt/persistent/passwords
      mkpasswd -m sha-512 >/mnt/persistent/passwords/pbizopoulos
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
    permittedInsecurePackages = [ "broadcom-sta-6.30.223.271-57-6.12.57" ];
  };
  users.motd = "Run 'install-nixos'";
  virtualisation.vmVariant.virtualisation.graphics = false;
}
