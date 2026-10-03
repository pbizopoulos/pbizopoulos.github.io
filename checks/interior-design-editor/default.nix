{ pkgs, ... }:
pkgs.runCommand "interior-design-editor-language-tests"
  {
    nativeBuildInputs = [ pkgs.nodejs ];
    src = ../../packages/interior-design-editor;
  }
  ''
    node --test "$src/prm/layout.test.mjs" "$src/prm/language.test.mjs"
    touch "$out"
  ''
