{
  pkgs ? import <nixpkgs> { },
}:

let
  inherit (pkgs) rustPlatform;
in

rustPlatform.buildRustPackage rec {
  pname = "check_repository_directory_structure";
  version = "0.1.0";
  src = ./.;
  nativeBuildInputs = [
    rustPlatform.bindgenHook
    pkgs.pkg-config
  ];
  buildInputs = [
    pkgs.openssl
    pkgs.zlib
  ];
  cargoHash = "sha256-SHt0+HHhpGqEebREy+eitKJJ9br4gZIaJyzA4aKq5/s=";
}
