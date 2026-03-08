{
  pkgs ? import <nixpkgs> { },
}:
pkgs.rustPlatform.buildRustPackage rec {
  buildInputs = [
    pkgs.libxkbcommon
    pkgs.wayland
    pkgs.wayland-protocols
  ];
  cargoHash = "sha256-0000000000000000000000000000000000000000000=";
  cargoLock.lockFile = ./Cargo.lock;
  meta.mainProgram = pname;
  nativeBuildInputs = [ pkgs.pkg-config ];
  pname = builtins.baseNameOf ./.;
  src = ./.;
  version = "0.0.0";
}
