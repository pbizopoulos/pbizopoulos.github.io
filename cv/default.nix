{ inputs, pkgs, ... }:
inputs.afairesi.lib.mkHtmlPackage {
  inherit pkgs;
  meta.description = "Paschalis Bizopoulos's research experience, publications, and curriculum vitae";
  passthru.tests.page =
    pkgs.runCommand "cv-page"
      {
        PAGE = ./index.html;
        nativeBuildInputs = [
          (pkgs.python3.withPackages (ps: [
            ps.beautifulsoup4
            ps.pytest
          ]))
        ];
      }
      ''
        python -m pytest -q -p no:cacheprovider --import-mode=importlib ${./test_main.py}
        touch "$out"
      '';
  src = ./.;
}
