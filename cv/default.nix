{ inputs, pkgs, ... }:
(inputs.afairesi or inputs.self).lib.mkHtmlPackage {
  inherit pkgs;
  meta.description = "An HTML package.";
  src = ./.;
}
