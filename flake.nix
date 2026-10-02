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
      checks = blueprint.checks // {
        x86_64-linux = blueprint.checks.x86_64-linux // {
          laptopBootstrap = import ./prm/ssh-bootstrap.nix {
            inherit inputs;
            inherit (inputs.self.nixosConfigurations.laptop) pkgs;
            hostName = "laptop";
          };
        };
      };
    };
}
