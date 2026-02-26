{
  flake,
  inputs,
  pkgs,
  ...
}:
let
  formatter = treefmtEval.config.build.wrapper;
  treefmtEval = inputs.treefmt-nix.lib.evalModule pkgs {
    programs = {
      actionlint.enable = true;
      beautysh.enable = true;
      biome.enable = true;
      biome.formatUnsafe = true;
      deadnix.enable = true;
      nixfmt = {
        enable = true;
        strict = true;
      };
      shellcheck.enable = true;
      shfmt = {
        enable = true;
        simplify = true;
      };
      statix.enable = true;
      terraform.enable = true;
      yamlfmt.enable = true;
    };
    projectRootFile = "flake.nix";
    settings = {
      formatter = {
        shfmt.options = [ "--posix" ];
        biome.options = [ "--max-diagnostics=none" ];
      };
      global.excludes = [
        "*/prm/**"
        "*/tmp/**"
      ];
    };
  };
in
formatter
// {
  passthru = formatter.passthru // {
    tests.check = treefmtEval.config.build.check flake;
  };
}
