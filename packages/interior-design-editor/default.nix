{ pkgs, ... }:
let
  pname = builtins.replaceStrings [ "-" ] [ "_" ] (baseNameOf ./.);
  prmInstall = "";
  runtimeDeps = [ ];
  site = pkgs.runCommand "${pname}-site" { } ''
    mkdir -p "$out"
    cp ${./index.html} "$out/index.html"
    for asset in script.js style.css collisions.js celestial.js layout-language.js layout-parser.js layout-parser.terms.js layout-tokens.js; do
      if [ -f ${./.}/"$asset" ]; then
        cp ${./.}/"$asset" "$out/$asset"
      fi
    done
    if [ -d ${./.}/prm ]; then
      cp -R ${./.}/prm "$out/prm"
      chmod -R u+w "$out/prm"
    fi
    ${prmInstall}
  '';
in
pkgs.writeShellApplication {
  meta.description = "Plan interiors, arrange furniture, and share interactive 3D designs.";
  name = pname;
  runtimeInputs = runtimeDeps ++ [ pkgs.http-server ];
  text = ''
    exec http-server ${site} "$@"
  '';
}
