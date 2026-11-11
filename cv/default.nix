{ inputs, pkgs, ... }:
inputs.afairesi.lib.mkHtmlPackage {
  inherit pkgs;
  meta.description = "An HTML package.";
  src = ./.;
}
