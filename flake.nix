{
  inputs = {
    disko = {
      inputs.nixpkgs.follows = "perigrafo/nixpkgs";
      url = "github:nix-community/disko";
    };
    perigrafo.url = "github:afairesi/afairesi";
    preservation.url = "github:nix-community/preservation";
  };
  outputs =
    inputs:
    let
      blueprint = inputs.perigrafo.blueprint {
        inherit inputs;
        nixpkgs.config = {
          allowUnfree = true;
          permittedInsecurePackages = [ "broadcom-sta-6.30.223.271-63-6.18.55" ];
        };
      };
    in
    blueprint
    // {
      formatter = inputs.perigrafo.lib.mkFormatter { inherit (inputs) self; };
    };
}
