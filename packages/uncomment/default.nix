{
  pkgs ? import <nixpkgs> { },
}:
pkgs.stdenv.mkDerivation rec {
  installPhase = ''
    runHook preInstall
    mkdir -p $out/bin
    cp uncomment $out/bin/uncomment
    runHook postInstall
  '';
  meta.mainProgram = pname;
  nativeBuildInputs = [ pkgs.autoPatchelfHook ];
  pname = "uncomment";
  sourceRoot = ".";
  src = pkgs.fetchurl {
    sha256 = "N2/H+2BG9kaKO3hXT4C35JEXA75AFP9B9oisKlmIU/s=";
    url = "https://github.com/Goldziher/uncomment/releases/download/v2.10.4/uncomment-x86_64-unknown-linux-gnu.tar.gz";
  };
  version = "2.10.4";
}
