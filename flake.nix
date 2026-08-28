{
  inputs = {
    canonicalization.url = "github:pbizopoulos/canonicalization";
    disko = {
      inputs.nixpkgs.follows = "nixpkgs";
      url = "github:nix-community/disko";
    };
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
          "broadcom-sta-6.30.223.271-63-6.18.46"
        ];
      };
    }
    // {
      inherit (inputs.canonicalization) formatter;
    };
}
