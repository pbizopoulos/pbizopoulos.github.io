{
  pkgs ? import <nixpkgs> { },
}:
pkgs.writeShellApplication {
  name = baseNameOf ./.;
  runtimeInputs = [
    pkgs.gh
  ];
  text = builtins.readFile ./main.sh;
}
