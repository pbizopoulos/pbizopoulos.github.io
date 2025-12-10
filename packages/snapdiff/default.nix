{
  pkgs ? import <nixpkgs> { },
}:
pkgs.python312Packages.buildPythonPackage rec {
  installPhase = ''mkdir -p $out/bin && cp ./main.py $out/bin/${pname}'';
  meta.mainProgram = pname;
  pname = builtins.baseNameOf src;
  propagatedBuildInputs = [
    pkgs.diffoscope
    pkgs.imagemagick
    pkgs.python312Packages.fire
    pkgs.rsync
    pkgs.python312Packages.gitpython
  ];
  pyproject = false;
  src = ./.;
  version = "0.0.0";
}
