{
  inputs = {
    agenix = {
      inputs.nixpkgs.follows = "nixpkgs";
      url = "github:ryantm/agenix";
    };
    blueprint = {
      inputs.nixpkgs.follows = "nixpkgs";
      url = "github:numtide/blueprint";
    };
    disko = {
      inputs.nixpkgs.follows = "nixpkgs";
      url = "github:nix-community/disko";
    };
    preservation.url = "github:nix-community/preservation";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    treefmt-nix = {
      inputs.nixpkgs.follows = "nixpkgs";
      url = "github:numtide/treefmt-nix";
    };
  };
  outputs = inputs:
    let
      blueprintOutputs = inputs.blueprint {
        inherit inputs;
        nixpkgs.config.allowUnfree = true;
      };
    in
      blueprintOutputs
      // {
        templates = {
          default = {
            path = ./.;
            description = "Project template based on this repository";
          };
        };
      };
}
