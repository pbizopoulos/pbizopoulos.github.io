{
  pkgs ? import <nixpkgs> { },
}:
pkgs.stdenv.mkDerivation rec {
  buildPhase = ''
    cc -o fswm main.c -O3 -std=c89 -Wall -Wconversion -Werror -Wextra -Wmissing-prototypes -Wold-style-definition -Wpedantic -Wstrict-prototypes -lxcb -lxcb-keysyms
  '';
  installPhase = ''
    mkdir -p $out/bin
    cp -f fswm $out/bin/
    chmod 755 $out/bin/fswm
  '';
  meta = {
    description = "A feature-complete and portable full-screen window manager based on XCB, written in C89";
    mainProgram = pname;
    platforms = pkgs.lib.platforms.unix;
  };
  nativeBuildInputs = [
    pkgs.xorg.libX11
    pkgs.xorg.xcbutilkeysyms
  ];
  pname = builtins.baseNameOf ./.;
  src = ./.;
  version = "0.0.0";
}
