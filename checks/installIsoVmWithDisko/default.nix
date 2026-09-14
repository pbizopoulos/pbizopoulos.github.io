{ inputs, pkgs, ... }:
let
  configuration = inputs.self.nixosConfigurations.${host};
  diskoDevices = configuration.config.disko.devices or { };
  host = pkgs.lib.removeSuffix "VmWithDisko" (baseNameOf ./.);
  vm =
    if builtins.attrNames diskoDevices == [ ] then
      configuration.config.system.build.vm
    else
      configuration.config.system.build.vmWithDisko;
in
pkgs.runCommand (baseNameOf ./.)
  {
    buildInputs = [ vm ];
  }
  ''
    touch "$out"
  ''
