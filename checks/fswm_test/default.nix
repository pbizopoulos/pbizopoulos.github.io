{
  inputs,
  pkgs,
  ...
}:
let
  name = baseNameOf ./.;
  packageDrv = inputs.self.packages.${pkgs.stdenv.system}.${name};
in
pkgs.testers.runNixOSTest {
  inherit name;
  nodes.machine = _: {
    environment.systemPackages = [
      packageDrv
    ]
    ++ (packageDrv.runtimeInputs or [ ]);
  };
  testScript = ''
    machine.succeed("${name}")
  '';
}
