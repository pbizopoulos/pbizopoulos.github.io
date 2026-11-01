{
  inputs,
  modulesPath,
  pkgs,
  ...
}:
let
  installNixos = pkgs.writeShellApplication {
    name = "install-nixos";
    runtimeInputs = [
      inputs.disko.packages.${pkgs.stdenv.hostPlatform.system}.disko
      pkgs.coreutils
      pkgs.git
      pkgs.mkpasswd
      pkgs.nix
      pkgs.nixos-install
      pkgs.sudo
      pkgs.util-linux
    ];
    text = ''
      if [ "$#" -ne 3 ]; then
        echo "Usage: install-nixos <hostname> <username> <old-home-partition>" >&2
        exit 1
      fi
      if [ "$EUID" -ne 0 ]; then
        exec sudo "$0" "$@"
      fi
      hostname="$1"
      username="$2"
      case "$username" in
        ""|*[!a-zA-Z0-9_-]*)
          echo "Invalid username" >&2
          exit 1
          ;;
      esac
      installer_tmp="$(mktemp -d)"
      cleanup() {
        if mountpoint -q "$installer_tmp/old-home"; then
          umount "$installer_tmp/old-home" || return
        fi
        rm -rf "$installer_tmp"
      }
      trap cleanup EXIT
      mkdir "$installer_tmp/old-home"
      mount -o ro "$3" "$installer_tmp/old-home"
      if git -c safe.directory="*" -C "$installer_tmp/old-home/$username" rev-parse --git-dir >/dev/null 2>&1; then
        git -c safe.directory="*" clone --no-hardlinks "$installer_tmp/old-home/$username" "$installer_tmp/home"
      fi
      umount "$installer_tmp/old-home"
      git clone https://github.com/pbizopoulos/pbizopoulos.github.io "$installer_tmp/config"
      flake="$installer_tmp/config#$hostname"
      nix eval --raw "$installer_tmp/config#nixosConfigurations.$hostname.config.system.build.toplevel.drvPath" >/dev/null
      echo "Choose the password for $username:"
      mkpasswd -m sha-512 > "$installer_tmp/password"
      chmod 600 "$installer_tmp/password"
      echo "Partitioning the disks configured for $hostname."
      disko --flake "$flake" --mode disko
      install -D -m 600 "$installer_tmp/password" "/mnt/persistent/passwords/$username"
      nixos-install --flake "$flake" --no-root-passwd
      if [ -d "$installer_tmp/home/.git" ]; then
        git clone "$installer_tmp/home" "/mnt/home/$username"
        git -c safe.directory="/mnt/home/$username" -C "/mnt/home/$username" remote remove origin
        chown -R --reference="/mnt/home/$username" "/mnt/home/$username"
      fi
    '';
  };
in
{
  boot.zfs.forceImportRoot = false;
  environment = {
    sessionVariables.EDITOR = "vim";
    systemPackages = [
      installNixos
      inputs.disko.packages.${pkgs.stdenv.hostPlatform.system}.disko
      pkgs.vim
    ];
  };
  imports = [
    (modulesPath + "/installer/cd-dvd/installation-cd-minimal.nix")
    ../laptop/hardware-configuration.nix
  ];
  networking.hostName = baseNameOf ./.;
  nix.settings.experimental-features = [
    "flakes"
    "nix-command"
  ];
  system.stateVersion = "25.11";
  time.timeZone = "Europe/Athens";
  users.motd = "Run 'install-nixos <hostname> <username> <old-home-partition>'";
}
