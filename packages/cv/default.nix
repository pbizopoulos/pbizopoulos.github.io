{
  pkgs ? import <nixpkgs> { },
}:
pkgs.writeShellApplication rec {
  meta.description = "";
  name = baseNameOf ./.;
  runtimeInputs = [
    pkgs.http-server
  ];
  text = ''
    exec ${pkgs.http-server}/bin/http-server ${./.} "$@"
  '';
}
