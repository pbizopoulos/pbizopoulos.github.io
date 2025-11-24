{ inputs, pkgs, ... }:
{
  boot = {
    binfmt.emulatedSystems = [ "aarch64-linux" ];
    initrd.systemd.enable = true;
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
    GDK_SCALE = "2";
    XINITRC = "/etc/X11/xinit/xinitrc";
  };
  fileSystems = {
    "/home".neededForBoot = true;
    "/persistent".neededForBoot = true;
  };
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
    trusted-users = [ "pbizopoulos" ];
  };
  nixpkgs.config.allowUnfree = true;
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
        "device.routes.default-source-volume" = 0.314;
      };
    };
    xserver = {
      displayManager.startx = {
        enable = true;
        extraCommands = "fswm st -f 'Liberation Mono:pixelsize=35:weight=bold'";
        generateScript = true;
      };
      enable = true;
      videoDrivers = [ "nvidia" ];
      xkb = {
        layout = "us,gr";
        options = "grp:win_space_toggle";
      };
    };
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
        inputs.self.packages.${pkgs.stdenv.system}.fswm
        pkgs.distrobox
        pkgs.google-chrome
        (pkgs.st.overrideAttrs {
          patches = [
            (pkgs.fetchpatch {
              sha256 = "Q+uWYYPF8nKgCS1P+v13GneXE07L0MaDQCGR8/F267A=";
              url = "https://st.suckless.org/patches/solarized/st-solarized-light-0.8.5.diff";
            })
          ];
        })
        (pkgs.vim.customize { vimrcConfig.customRC = "filetype plugin indent on"; })
      ];
    };
  };
  virtualisation = {
    containers.enable = true;
    podman = {
      dockerCompat = true;
      enable = true;
    };
    vmVariantWithDisko = {
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
  };
}
