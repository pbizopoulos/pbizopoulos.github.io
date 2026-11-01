{
  inputs,
  modulesPath,
  pkgs,
  ...
}:
{
  boot.zfs.forceImportRoot = false;
  environment = {
    sessionVariables.EDITOR = "vim";
    systemPackages = [
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
}
