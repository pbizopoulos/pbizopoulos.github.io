{
  pkgs ? import <nixpkgs> { },
}:
pkgs.rustPlatform.buildRustPackage rec {
  pname = builtins.baseNameOf ./.;
  version = "0.0.0";
  src = ./.;

  cargoLock = {
    lockFile = ./Cargo.lock;
  };

  cargoHash = "sha256-0000000000000000000000000000000000000000000=";

  nativeBuildInputs = [
    pkgs.pkg-config
  ];

  buildInputs = [
    pkgs.wayland
    pkgs.wayland-protocols
    pkgs.libxkbcommon
  ];

  meta.mainProgram = pname;
}
