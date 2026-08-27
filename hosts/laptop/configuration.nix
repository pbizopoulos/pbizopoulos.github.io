{
  inputs,
  pkgs,
  ...
}:
{
  boot = {
    kernelParams = [
      "i915.enable_psr=0"
    ];
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
  environment = {
    etc."sway/config.d/window-management.conf".text = ''
      for_window [app_id=".*"] fullscreen enable
      for_window [class=".*"] fullscreen enable
      bindsym Mod1+Tab focus next
      bindsym Mod1+Shift+Tab focus prev
    '';
    sessionVariables = {
      EDITOR = "vim";
      GDK_SCALE = "4";
      XINITRC = "/etc/X11/xinit/xinitrc";
    };
  };
  fileSystems = {
    "/home".neededForBoot = true;
    "/persistent".neededForBoot = true;
  };
  hardware.enableRedistributableFirmware = true;
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
    foot = {
      enable = true;
      settings = {
        colors = {
          background = "fdf6e3";
          bright0 = "002b36";
          bright1 = "cb4b16";
          bright2 = "586e75";
          bright3 = "657b83";
          bright4 = "839496";
          bright5 = "6c71c4";
          bright6 = "93a1a1";
          bright7 = "fdf6e3";
          foreground = "657b83";
          regular0 = "073642";
          regular1 = "dc322f";
          regular2 = "859900";
          regular3 = "b58900";
          regular4 = "268bd2";
          regular5 = "d33682";
          regular6 = "2aa198";
          regular7 = "eee8d5";
        };
        main.font = "Liberation Mono:size=70:style=Bold";
      };
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
    slock.enable = true;
    sway.enable = true;
  };
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
      wireplumber.extraConfig."60-defaults"."wireplumber.settings" = {
        "device.routes.default-sink-volume" = 0.422;
        "device.routes.default-source-volume" = 1.0e-3;
      };
    };
  };
  system.stateVersion = "25.11";
  systemd.suppressedSystemUnits = [
    "systemd-machine-id-commit.service"
  ];
  time.timeZone = "Europe/Athens";
  users = {
    mutableUsers = false;
    users.pbizopoulos = {
      extraGroups = [
        "wheel"
      ];
      hashedPasswordFile = "/persistent/passwords/pbizopoulos";
      isNormalUser = true;
      packages = [
        pkgs.google-chrome
        (pkgs.vim.customize {
          vimrcConfig.customRC = "filetype plugin indent on";
        })
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
