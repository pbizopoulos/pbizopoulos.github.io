{
  inputs = {
    canonical.url = "github:pbizopoulos/canonical";
    disko = {
      inputs.nixpkgs.follows = "nixpkgs";
      url = "github:nix-community/disko";
    };
    nixpkgs.follows = "canonical/nixpkgs";
    preservation.url = "github:nix-community/preservation";
  };
  outputs =
    inputs:
    inputs.canonical.blueprint {
      inherit inputs;
      nixpkgs.config = {
        allowUnfree = true;
        permittedInsecurePackages = [ "broadcom-sta-6.30.223.271-63-6.18.52" ];
      };
    }
    // {
      inherit (inputs.canonical) formatter;
    };
}
