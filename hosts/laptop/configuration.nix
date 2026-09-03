{ inputs, pkgs, ... }:
{
  boot = {
    kernelParams = [ "i915.enable_psr=0" ];
    loader.systemd-boot.enable = true;
  };
  disko.devices = {
    disk.main = {
      content = {
        partitions = {
          esp = {
            content = {
              format = "vfat";
              mountpoint = "/boot";
              type = "filesystem";
            };
            end = "512M";
            type = "EF00";
          };
          home = {
            content = {
              format = "ext4";
              mountpoint = "/home";
              type = "filesystem";
            };
            size = "32G";
          };
          nix = {
            content = {
              format = "ext4";
              mountpoint = "/nix";
              type = "filesystem";
            };
            size = "100%";
          };
          persistent = {
            content = {
              format = "ext4";
              mountpoint = "/persistent";
              type = "filesystem";
            };
            size = "4M";
          };
          swap = {
            content.type = "swap";
            size = "16G";
          };
        };
        type = "gpt";
      };
      device = "/dev/disk/by-id/ata-LITEON_L8H-256V2G-11_M.2_2280_256GB_TW0MGNHV5508559M0521";
    };
    nodev."/" = {
      fsType = "tmpfs";
      mountOptions = [
        "defaults"
        "mode=755"
      ];
    };
  };
  environment.sessionVariables = {
    EDITOR = "vim";
    NIXOS_OZONE_WL = "1";
  };
  fileSystems = {
    "/home".neededForBoot = true;
    "/persistent".neededForBoot = true;
  };
  fonts = {
    fontconfig.defaultFonts.emoji = [ "Noto Color Emoji" ];
    packages = [
      pkgs.noto-fonts
      pkgs.noto-fonts-color-emoji
    ];
  };
  hardware = {
    enableRedistributableFirmware = true;
    graphics.enable = true;
  };
  imports = [
    ./hardware-configuration.nix
    inputs.disko.nixosModules.disko
    inputs.preservation.nixosModules.default
  ];
  networking = {
    hostName = baseNameOf ./.;
    wireless.iwd.enable = true;
  };
  nix.settings.experimental-features = [
    "flakes"
    "nix-command"
  ];
  nixpkgs.overlays = [
    (_: prev: {
      vmTools = prev.vmTools.override {
        kernelImage = "bzImage";
      };
    })
  ];
  preservation = {
    enable = true;
    preserveAt."/persistent" = {
      directories = [
        "/var/lib/iwd"
        {
          directory = "/var/lib/nixos";
          inInitrd = true;
        }
      ];
      files = [
        "/etc/ssh/ssh_host_ed25519_key.pub"
        "/etc/ssh/ssh_host_rsa_key.pub"
        {
          file = "/etc/machine-id";
          inInitrd = true;
        }
        {
          file = "/etc/ssh/ssh_host_ed25519_key";
          mode = "0600";
        }
        {
          file = "/etc/ssh/ssh_host_rsa_key";
          mode = "0600";
        }
      ];
    };
  };
  programs = {
    bash.promptInit = "";
    dwl = {
      enable = true;
      package = pkgs.dwl.override {
        configH = ../../prm/dwl-config.h;
      };
    };
    foot = {
      enable = true;
      settings.main.font = "Liberation Mono:pixelsize=60:style=Bold";
      theme = "solarized-light";
    };
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
  security.pam.services.waylock = { };
  services = {
    openssh = {
      enable = true;
      hostKeys = [
        {
          bits = 4096;
          path = "/persistent/etc/ssh/ssh_host_rsa_key";
          type = "rsa";
        }
        {
          path = "/persistent/etc/ssh/ssh_host_ed25519_key";
          type = "ed25519";
        }
      ];
    };
    pipewire = {
      enable = true;
      pulse.enable = true;
      wireplumber.extraConfig."60-defaults"."wireplumber.settings" = {
        "device.routes.default-sink-volume" = 0.422;
        "device.routes.default-source-volume" = 1.0e-3;
      };
    };
  };
  system.stateVersion = "25.11";
  systemd.suppressedSystemUnits = [ "systemd-machine-id-commit.service" ];
  time.timeZone = "Europe/Athens";
  users = {
    mutableUsers = false;
    users.pbizopoulos = {
      extraGroups = [ "wheel" ];
      hashedPasswordFile = "/persistent/passwords/pbizopoulos";
      isNormalUser = true;
      packages = [
        (pkgs.google-chrome.override {
          commandLineArgs = "--force-device-scale-factor=4";
        })
        (pkgs.vim.customize {
          vimrcConfig.customRC = "filetype plugin indent on";
        })
        pkgs.waylock
      ];
    };
  };
  virtualisation.vmVariantWithDisko = {
    disko.devices.disk.main.content.partitions = {
      home.size = pkgs.lib.mkForce "500M";
      swap.size = pkgs.lib.mkForce "1M";
    };
    users.users.pbizopoulos = {
      hashedPasswordFile = pkgs.lib.mkForce null;
      password = "password";
    };
    virtualisation = {
      fileSystems = {
        "/home".neededForBoot = true;
        "/persistent".neededForBoot = true;
      };
      graphics = false;
    };
  };
}
