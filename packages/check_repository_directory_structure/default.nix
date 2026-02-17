{
  pkgs ? import <nixpkgs> { },
}:
pkgs.python313Packages.buildPythonPackage rec {
  installPhase = "mkdir -p $out/bin && cp ./main.py $out/bin/${pname}";
  meta.mainProgram = pname;
  pname = builtins.baseNameOf src;
  propagatedBuildInputs = [
    pkgs.python313Packages.fire
    pkgs.python313Packages.fqdn
    pkgs.python313Packages.gitpython
  ];
  pyproject = false;
  src = ./.;
  version = "0.0.0";
}
