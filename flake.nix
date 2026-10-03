{
  inputs = {
    canonical.url = "github:pbizopoulos/canonical";
    disko = {
      inputs.nixpkgs.follows = "canonical/nixpkgs";
      url = "github:nix-community/disko";
    };
    preservation.url = "github:nix-community/preservation";
  };
  outputs =
    inputs:
    let
      blueprint = inputs.canonical.blueprint {
        inherit inputs;
        nixpkgs.config = {
          allowUnfree = true;
          permittedInsecurePackages = [ "broadcom-sta-6.30.223.271-63-6.18.54" ];
        };
      };
    in
    blueprint
    // {
      inherit (inputs.canonical) formatter;
    };
}
