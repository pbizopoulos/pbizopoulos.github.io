{ pkgs, ... }:
let
  pname = baseNameOf ./.;
  runtimeDeps = [ ];
in
pkgs.writeShellApplication {
  meta.description = "An HTML package.";
  name = pname;
  runtimeInputs = runtimeDeps ++ [ pkgs.http-server ];
  text = ''
    exec http-server ${./.} "$@"
  '';
}
