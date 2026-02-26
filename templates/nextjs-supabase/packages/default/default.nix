{
  pkgs ? import <nixpkgs> { },
}:
pkgs.buildNpmPackage rec {
  nativeBuildInputs = [
    pkgs.openssl
    pkgs.supabase-cli
  ];
  npmDepsHash = "sha256-7uobM0/kdITHf/PRWFy+UoaWxCXyhN4/QilzFfLL03o=";
  pname = "nextjs-supabase";
  env = {
    NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    NEXT_PUBLIC_SUPABASE_ANON_KEY = "build-placeholder";
  };
  preBuild = ''
    cp "${
      pkgs.google-fonts.override { fonts = [ "Inter" ]; }
    }/share/fonts/truetype/Inter[opsz,wght].ttf" app/Inter.ttf
    cp "${
      pkgs.google-fonts.override { fonts = [ "RobotoMono" ]; }
    }/share/fonts/truetype/RobotoMono[wght].ttf" app/RobotoMono.ttf
  '';
  shellHook = ''
    export PKG_CONFIG_PATH="${pkgs.openssl.dev}/lib/pkgconfig"
    export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
  '';
  src = ./.;
  version = "0.0.0";
}
