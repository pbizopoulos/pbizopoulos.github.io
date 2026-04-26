{
  inputs = {
    canonicalization.url = "github:pbizopoulos/canonicalization";
    disko = {
      inputs.nixpkgs.follows = "nixpkgs";
      url = "github:nix-community/disko";
    };
    nixos-hardware.url = "github:NixOS/nixos-hardware";
    nixpkgs.follows = "canonicalization/nixpkgs";
    preservation.url = "github:nix-community/preservation";
  };
  outputs =
    inputs:
    inputs.canonicalization.blueprint {
      inherit inputs;
      nixpkgs.config = {
        allowUnfree = true;
        permittedInsecurePackages = [
          "broadcom-sta-6.30.223.271-59-6.18.24"
        ];
      };
    }
    // {
      inherit (inputs.canonicalization) formatter;
    };
}
