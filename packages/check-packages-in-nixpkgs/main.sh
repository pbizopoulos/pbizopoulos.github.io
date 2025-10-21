#!/bin/sh

packages="efficientnet-pytorch jsf label-studio-sdk mediapipe pretrainedmodels scikit-spatial segmentation_models_pytorch sqladmin wfdb"

for pkg in $packages; do
  exists=$(nix-instantiate -I nixpkgs=channel:nixos-unstable --eval -E "
    with import <nixpkgs> {};
    builtins.hasAttr \"$pkg\" python312Packages
  " 2>/dev/null)
  if [ "$exists" = "true" ]; then
    echo "Package exists: $pkg"
    exit 1
  fi
done
