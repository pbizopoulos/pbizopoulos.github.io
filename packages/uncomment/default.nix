{
  pkgs ? import <nixpkgs> { },
}:
pkgs.stdenv.mkDerivation {
  buildInputs = [ pkgs.stdenv.cc.cc.lib ];
  installPhase = ''
    runHook preInstall
    mkdir -p $out/bin
    cp uncomment $out/bin/uncomment
    runHook postInstall
  '';
  meta = with pkgs.lib; {
    mainProgram = "uncomment";
  };
  nativeBuildInputs = [ pkgs.autoPatchelfHook ];
  pname = "uncomment";
  sourceRoot = ".";
  src = pkgs.fetchurl {
    sha256 = "JiV87+ETfCMokAai6V62LnaEbUKQ/PsyAvvqkfO5M+o=";
    url = "https://github.com/Goldziher/uncomment/releases/download/v2.9.2/uncomment-x86_64-unknown-linux-gnu.tar.gz";
  };
  version = "2.9.2";
}
