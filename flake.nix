{
  inputs = {
    afairesi.url = "github:afairesi/afairesi";
    disko = {
      inputs.nixpkgs.follows = "afairesi/nixpkgs";
      url = "github:nix-community/disko";
    };
    preservation.url = "github:nix-community/preservation";
  };
  outputs =
    inputs:
    let
      blueprint = inputs.afairesi.blueprint {
        inherit inputs;
        nixpkgs.config = {
          allowUnfree = true;
          permittedInsecurePackages = [ "broadcom-sta-6.30.223.271-63-6.18.55" ];
        };
      };
    in
    blueprint
    // {
      formatter = inputs.afairesi.lib.mkFormatter { inherit (inputs) self; };
    };
}
