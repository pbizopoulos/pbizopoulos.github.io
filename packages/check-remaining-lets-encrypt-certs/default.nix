{
  pkgs ? import <nixpkgs> { },
}:
pkgs.writeShellApplication {
  name = builtins.baseNameOf ./.;
  runtimeInputs = [
    pkgs.curl
    pkgs.jq
  ];
  text = builtins.readFile ./main.sh;
}
