{
  pkgs ? import <nixpkgs> { },
}:
pkgs.writeShellApplication {
  name = builtins.baseNameOf ./.;
  runtimeInputs = [ pkgs.git ];
  text = builtins.readFile ./main.sh;
}
