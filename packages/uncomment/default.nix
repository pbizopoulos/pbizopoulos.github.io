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
    sha256 = "i0x/CKFsLx1OX5gLsJChp8XerX60/zy1UwpgRE5NJj0=";
    url = "https://github.com/Goldziher/uncomment/releases/download/v2.10.3/uncomment-x86_64-unknown-linux-gnu.tar.gz";
  };
  version = "2.10.3";
}
