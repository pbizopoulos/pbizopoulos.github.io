{
  pkgs ? import <nixpkgs> { },
}:
pkgs.writeShellApplication {
  name = builtins.baseNameOf ./.;
  runtimeInputs = [ pkgs.python312Packages.coverage ];
  text = builtins.readFile ./main.sh;
}
