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
      biome = {
        enable = true;
        formatUnsafe = true;
      };
      clang-format.enable = true;
      deadnix.enable = true;
      nixfmt = {
        enable = true;
        strict = true;
      };
      prettier.enable = true;
      rustfmt.enable = true;
      shellcheck.enable = true;
      shfmt = {
        enable = true;
        simplify = true;
      };
      statix.enable = true;
      toml-sort.enable = true;
      yamlfmt.enable = true;
    };
    projectRootFile = "flake.nix";
    settings = {
      formatter = {
        biome.options = [ "--max-diagnostics=none" ];
        check_repository_directory_structure = {
          command =
            inputs.canonicalization.packages.${pkgs.stdenv.system}.check_repository_directory_structure;
          includes = [ "flake.nix" ];
          priority = 0;
        };
        nix-alphabetize = {
          command = inputs.canonicalization.packages.${pkgs.stdenv.system}.nix-alphabetize;
          includes = [ "*.nix" ];
          priority = 0;
        };
        remove_empty_lines = {
          command = inputs.canonicalization.packages.${pkgs.stdenv.system}.remove_empty_lines;
          includes = [ "*" ];
          priority = 0;
        };
        rustfmt.priority = 1;
        shfmt.options = [ "--posix" ];
        uncomment = {
          command = inputs.canonicalization.packages.${pkgs.stdenv.system}.uncomment;
          includes = [ "*" ];
        };
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
