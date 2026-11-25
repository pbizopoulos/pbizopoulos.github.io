{ inputs, pkgs, ... }:
inputs.afairesi.lib.mkHtmlPackage {
  inherit pkgs;
  meta.description = "Paschalis Bizopoulos's research experience, publications, and curriculum vitae";
  src = ./.;
}
