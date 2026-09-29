{ pkgs, ... }:
let
  browsers = pkgs.playwright-driver.selectBrowsers {
    withFirefox = false;
    withWebkit = false;
  };
  pname = builtins.replaceStrings [ "-" ] [ "_" ] (baseNameOf ./.);
  python = pkgs.python3;
in
python.pkgs.buildPythonPackage {
  inherit pname;
  installPhase = ''
    install -Dm644 main.py "$out/${python.sitePackages}/$pname/__init__.py"
    mkdir -p "$out/bin"
    printf '%s\n' '#!${python.interpreter}' "from $pname import main" 'main()' > "$out/bin/${baseNameOf ./.}"
    chmod 755 "$out/bin/${baseNameOf ./.}"
    if [ -d prm ]; then
      cp -R prm/ "$out/${python.sitePackages}/$pname/"
    fi
  '';
  meta = {
    description = "Record a concise Interior Design Editor investor demo with Playwright screencasting.";
    mainProgram = baseNameOf ./.;
  };
  nativeBuildInputs = [ pkgs.makeWrapper ];
  passthru.python = python;
  postFixup = ''
    wrapProgram "$out/bin/${baseNameOf ./.}" \
      --prefix PATH : ${pkgs.lib.makeBinPath [ pkgs.ffmpeg ]} \
      --set PLAYWRIGHT_BROWSERS_PATH ${browsers} \
      --set PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS true \
      --set INTERIOR_DESIGN_EDITOR_SITE ${../interior-design-editor}
  '';
  propagatedBuildInputs = [ python.pkgs.playwright ];
  pyproject = false;
  src = ./.;
  strictDeps = true;
  version = "0.0.0";
}
