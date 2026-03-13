{
  pkgs ? import <nixpkgs> { },
}:
pkgs.rustPlatform.buildRustPackage rec {
  buildInputs = [
    pkgs.git
    pkgs.imagemagick
  ];
  cargoHash = "sha256-Rn7HzfOe4DH/dLlSDHQeHIcHOiqPzjLTRKnEObV6RZk=";
  meta.mainProgram = pname;
  nativeBuildInputs = [
    pkgs.makeWrapper
  ];
  pname = baseNameOf ./.;
  src = ./.;
  version = "0.0.0";
}
