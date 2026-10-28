{
  config,
  lib,
  modulesPath,
  ...
}:
{
  boot = {
    extraModulePackages = [ config.boot.kernelPackages.broadcom_sta ];
    initrd.availableKernelModules = [
      "ahci"
      "ehci_pci"
      "rtsx_pci_sdmmc"
      "sd_mod"
      "usb_storage"
      "xhci_pci"
    ];
    kernelModules = [
      "kvm-intel"
      "wl"
    ];
  };
  hardware.cpu.intel.updateMicrocode = lib.mkDefault config.hardware.enableRedistributableFirmware;
  imports = [ (modulesPath + "/installer/scan/not-detected.nix") ];
  nixpkgs.hostPlatform = lib.mkDefault "x86_64-linux";
}
