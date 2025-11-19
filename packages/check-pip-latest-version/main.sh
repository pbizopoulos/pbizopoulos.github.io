#!/bin/sh

packages="segmentation_models_pytorch"

for package in $packages; do
  nix run nixpkgs#python312Packages.pip index versions "$package" | sed -n '1p'
done
