{ pkgs ? import <nixpkgs> { }
,
}:
pkgs.writeShellApplication {
  name = baseNameOf ./.;
  runtimeInputs = [ pkgs.nodePackages.http-server ];
  text = ''
    set +u && [ -z "$DEBUG" ] && http-server ${./.}
  '';
}
