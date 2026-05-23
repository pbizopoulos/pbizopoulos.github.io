{
  config,
  lib,
  modulesPath,
  ...
}:
{
  boot = {
    extraModulePackages = [
      config.boot.kernelPackages.broadcom_sta
    ];
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
      "snd_hda_intel"
      "wl"
    ];
    kernelParams = [
      "acpi_rev_override=1"
      "snd_hda_intel.dmic_detect=0"
    ];
  };
  hardware.cpu.intel.updateMicrocode = lib.mkDefault config.hardware.enableRedistributableFirmware;
  imports = [
    (modulesPath + "/installer/scan/not-detected.nix")
  ];
  nixpkgs.hostPlatform = lib.mkDefault "x86_64-linux";
}
