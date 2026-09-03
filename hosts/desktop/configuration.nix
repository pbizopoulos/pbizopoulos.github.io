{ inputs, pkgs, ... }:
{
  boot.loader.systemd-boot.enable = true;
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
            size = "512G";
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
            size = "32G";
          };
        };
        type = "gpt";
      };
      device = "/dev/disk/by-id/nvme-GIGABYTE_GP-ASM2NE6200TTTD_SN212408986155";
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
  fonts.packages = [
    pkgs.noto-fonts
    pkgs.noto-fonts-color-emoji
  ];
  hardware = {
    nvidia.open = true;
    nvidia-container-toolkit.enable = true;
  };
  imports = [
    ./hardware-configuration.nix
    inputs.disko.nixosModules.disko
    inputs.preservation.nixosModules.default
  ];
  networking.hostName = baseNameOf ./.;
  nix.settings = {
    experimental-features = [
      "flakes"
      "nix-command"
    ];
    extra-substituters = [
      "https://cache.nixos-cuda.org"
      "https://nix-community.cachix.org"
    ];
    extra-trusted-public-keys = [
      "cache.nixos-cuda.org:74DUi4Ye579gUqzH4ziL9IyiJBlDpMRn9MBN8oNan9M="
      "nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
    ];
    trusted-users = [ "pbizopoulos" ];
  };
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
      settings.main.font = "Liberation Mono:pixelsize=40:style=Bold";
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
        "device.routes.default-source-volume" = 0.314;
      };
    };
    xserver.videoDrivers = [ "nvidia" ];
  };
  system.stateVersion = "25.11";
  systemd.suppressedSystemUnits = [ "systemd-machine-id-commit.service" ];
  time.timeZone = "Europe/Athens";
  users = {
    mutableUsers = false;
    users.pbizopoulos = {
      extraGroups = [
        "podman"
        "wheel"
      ];
      hashedPasswordFile = "/persistent/passwords/pbizopoulos";
      isNormalUser = true;
      packages = [
        (pkgs.google-chrome.override {
          commandLineArgs = "--force-device-scale-factor=2";
        })
        (pkgs.vim.customize {
          vimrcConfig.customRC = "filetype plugin indent on";
        })
        inputs.canonicalization.packages.${pkgs.stdenv.system}.git_canonicalization
        pkgs.distrobox
        pkgs.waylock
      ];
    };
  };
  virtualisation = {
    podman = {
      dockerCompat = true;
      enable = true;
    };
    vmVariantWithDisko = {
      disko.devices.disk.main.content.partitions = {
        home.size = pkgs.lib.mkForce "500M";
        swap.size = pkgs.lib.mkForce "1M";
      };
      hardware.nvidia-container-toolkit.enable = pkgs.lib.mkForce false;
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
  };
}
