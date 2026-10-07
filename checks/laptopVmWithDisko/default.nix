{ inputs, pkgs, ... }:
(inputs.perigrafo or inputs.self).lib.mkHostCheck {
  inherit inputs pkgs;
  host = pkgs.lib.removeSuffix "VmWithDisko" (baseNameOf ./.);
}
