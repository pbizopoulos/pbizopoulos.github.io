#!/bin/sh

packages="autogluon coreforecast efficientnet-pytorch flwr flwr-datasets iterators jsf label-studio-sdk mediapipe mlforecast onnx-ir onnxscript pretrainedmodels scikit-spatial segmentation_models_pytorch sqladmin utilsforecast wfdb"

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
