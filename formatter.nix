{ inputs, pkgs, ... }:
inputs.treefmt-nix.lib.mkWrapper pkgs {
  programs = {
    actionlint.enable = true;
    beautysh.enable = true;
    biome.enable = true;
    clang-format.enable = true;
    deadnix.enable = true;
    hlint.enable = true;
    nixfmt = {
      enable = true;
      strict = true;
    };
    ormolu.enable = true;
    prettier.enable = true;
    ruff-check = {
      enable = true;
      extendSelect = [ "ALL" ];
    };
    ruff-format.enable = true;
    shellcheck.enable = true;
    shfmt = {
      enable = true;
      simplify = true;
    };
    statix.enable = true;
    yamlfmt.enable = true;
  };
  projectRootFile = "flake.nix";
  settings = {
    formatter = {
      mypy = {
        command = pkgs.mypy;
        includes = [ "*.py" ];
        options = [
          "--explicit-package-bases"
          "--ignore-missing-imports"
          "--strict"
        ];
      };
      ruff-check.options = [ "--unsafe-fixes" ];
      shfmt.options = [ "--posix" ];
    };
    global.excludes = [
      "*/prm/**"
      "*/tmp/**"
    ];
  };
}
