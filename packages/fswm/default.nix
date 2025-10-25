{
  pkgs ? import <nixpkgs> { },
}:
pkgs.stdenv.mkDerivation rec {
  buildPhase = ''
    cc -o fswm main.c -O3 -std=c89 -Werror -lxcb -lxcb-keysyms \
    -Waggressive-loop-optimizations \
    -Wall \
    -Walloc-zero \
    -Walloca \
    -Wattribute-alias \
    -Wattributes \
    -Wbad-function-cast \
    -Wbuiltin-declaration-mismatch \
    -Wbuiltin-macro-redefined \
    -Wc90-c99-compat \
    -Wc99-c11-compat \
    -Wcast-align=strict \
    -Wcast-align \
    -Wcast-qual \
    -Wconversion \
    -Wcoverage-mismatch \
    -Wcpp \
    -Wdate-time \
    -Wdeclaration-after-statement \
    -Wdeprecated-declarations \
    -Wdeprecated \
    -Wdesignated-init \
    -Wdisabled-optimization \
    -Wdiscarded-array-qualifiers \
    -Wdiscarded-qualifiers \
    -Wdiv-by-zero \
    -Wdouble-promotion \
    -Wduplicated-branches \
    -Wduplicated-cond \
    -Wextra \
    -Wfloat-equal \
    -Wformat-signedness \
    -Wfree-nonheap-object \
    -Whsa \
    -Wif-not-aligned \
    -Wignored-attributes \
    -Wimport \
    -Wincompatible-pointer-types \
    -Winline \
    -Wint-conversion \
    -Wint-to-pointer-cast \
    -Winvalid-memory-model \
    -Winvalid-pch \
    -Wjump-misses-init \
    -Wlogical-op \
    -Wlto-type-mismatch \
    -Wmissing-declarations \
    -Wmissing-include-dirs \
    -Wmissing-prototypes \
    -Wmultichar \
    -Wnested-externs \
    -Wnull-dereference \
    -Wodr \
    -Wold-style-definition \
    -Woverflow \
    -Woverride-init-side-effects \
    -Wpacked-bitfield-compat \
    -Wpacked \
    -Wpedantic \
    -Wpointer-compare \
    -Wpointer-to-int-cast \
    -Wpragmas \
    -Wreturn-local-addr \
    -Wscalar-storage-order \
    -Wshadow \
    -Wshift-count-negative \
    -Wshift-count-overflow \
    -Wshift-negative-value \
    -Wsizeof-array-argument \
    -Wstack-protector \
    -Wstrict-aliasing \
    -Wstrict-overflow \
    -Wstrict-prototypes \
    -Wsuggest-final-methods \
    -Wsuggest-final-types \
    -Wswitch-bool \
    -Wswitch-default \
    -Wswitch-enum \
    -Wswitch-unreachable \
    -Wsync-nand \
    -Wtrampolines \
    -Wundef \
    -Wunreachable-code \
    -Wunsafe-loop-optimizations \
    -Wunsuffixed-float-constants \
    -Wunused-macros \
    -Wunused-result \
    -Wvarargs \
    -Wvector-operation-performance \
    -Wvla \
    -Wwrite-strings
    # -fanalyzer \
    # -Waggregate-return
    # -Wtraditional-conversion
  '';
  installPhase = ''
    mkdir -p $out/bin
    cp -f fswm $out/bin/
    chmod 755 $out/bin/fswm
  '';
  meta.mainProgram = pname;
  nativeBuildInputs = [
    pkgs.xorg.libxcb
    pkgs.xorg.xcbutilkeysyms
    pkgs.xorg.libX11
  ];
  pname = builtins.baseNameOf ./.;
  src = ./.;
  version = "0.0.0";
}
