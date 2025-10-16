{ inputs, pkgs, ... }:
{
  boot = {
    loader.generic-extlinux-compatible.enable = true;
    supportedFilesystems.zfs = pkgs.lib.mkForce false;
  };
  fileSystems."/" = {
    device = "/dev/disk/by-label/NIXOS_SD";
    fsType = "ext4";
  };
  hardware = {
    enableAllHardware = pkgs.lib.mkForce false;
    enableRedistributableFirmware = true;
  };
  imports = [ inputs.nixos-hardware.nixosModules.raspberry-pi-4 ];
  networking = {
    hostName = baseNameOf ./.;
    wireless = {
      enable = true;
      interfaces = [ "wlan0" ];
      networks."REPLACE_WITH_SSID".psk = "REPLACE_WITH_PASSWORD";
    };
  };
  nix.settings.experimental-features = [
    "flakes"
    "nix-command"
  ];
  nixpkgs.system = "aarch64-linux";
  programs = {
    bash.promptInit = "";
    git = {
      config = {
        init.defaultBranch = "main";
        user = {
          email = "pbizop@gmail.com";
          name = "Paschalis Bizopoulos";
        };
      };
      enable = true;
    };
  };
  services.openssh.enable = true;
  system.stateVersion = "25.11";
  time.timeZone = "Europe/Athens";
  users = {
    mutableUsers = false;
    users.guest = {
      extraGroups = [ "wheel" ];
      isNormalUser = true;
      packages = [
        (pkgs.vim.customize {
          vimrcConfig.customRC = ''
            filetype plugin indent on
            set viminfofile=$XDG_STATE_HOME/viminfo
          '';
        })
      ];
      password = "guest";
    };
  };
}
