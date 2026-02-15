{
  pkgs ? import <nixpkgs> { },
}:
pkgs.stdenv.mkDerivation rec {
  installPhase = ''
    runHook preInstall
    mkdir -p $out/bin
    cp ${pname} $out/bin/${pname}
    runHook postInstall
  '';
  meta.mainProgram = pname;
  nativeBuildInputs = [
    pkgs.autoPatchelfHook
    pkgs.libgcc
  ];
  pname = "schemaui";
  sourceRoot = ".";
  src = pkgs.fetchurl {
    sha256 = "sha256-Q/q1bf7olOMvu/8iQTull7dgYA25Q58lPXq0RrBgHe8=";
    url = "https://github.com/YuniqueUnic/schemaui/releases/download/schemaui-cli-v0.2.7/schemaui-x86_64-unknown-linux-gnu.tar.gz";
  };
  version = "0.2.7";
}
