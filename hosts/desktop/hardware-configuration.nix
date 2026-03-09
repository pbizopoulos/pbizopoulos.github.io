{
  config,
  lib,
  modulesPath,
  ...
}:
{
  boot = {
    extraModulePackages = [ ];
    initrd.availableKernelModules = [
      "ahci"
      "nvme"
      "sd_mod"
      "usb_storage"
      "usbhid"
      "xhci_pci"
    ];
    kernelModules = [ "kvm-intel" ];
  };
  hardware.cpu.intel.updateMicrocode = lib.mkDefault config.hardware.enableRedistributableFirmware;
  imports = [ (modulesPath + "/installer/scan/not-detected.nix") ];
  nixpkgs.hostPlatform = lib.mkDefault "x86_64-linux";
}
