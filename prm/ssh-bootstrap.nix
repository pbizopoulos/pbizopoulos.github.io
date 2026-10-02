{
  hostName,
  inputs,
  pkgs,
}:
let
  inherit (pkgs) lib;
  host = inputs.self.nixosConfigurations.${hostName}.config;
  hasAge = builtins.attrNames (host.age.secrets or { }) != [ ];
  fixture =
    pkgs.runCommand "bootstrap-test-only-identity"
      {
        nativeBuildInputs = [
          pkgs.openssh
          pkgs.age
        ];
      }
      ''
        mkdir -p "$out"
        ssh-keygen -q -t ed25519 -N "" -C disposable-bootstrap-test -f "$out/host"
        printf 'bootstrap-ok\n' | age -R "$out/host.pub" -o "$out/probe.age"
      '';
  sshFiles = builtins.filter (
    file: lib.hasPrefix "/etc/ssh/" file.file
  ) host.preservation.preserveAt."/persistent".files;
  node =
    seeded:
    { ... }:
    {
      imports = [
        inputs.preservation.nixosModules.default
      ]
      ++ lib.optional hasAge inputs.agenix.nixosModules.default;
      boot.initrd.systemd = {
        inherit (host.boot.initrd.systemd) enable;
        # These are disposable test keys, never a real machine identity.
        storePaths = [ fixture ];
      };
      preservation = {
        inherit (host.preservation) enable;
        preserveAt."/persistent".files = map (file: {
          inherit (file)
            configureParent
            createLinkTarget
            file
            group
            how
            inInitrd
            mode
            mountOptions
            parent
            user
            ;
        }) sshFiles;
      };
      services.openssh = {
        inherit (host.services.openssh) enable hostKeys;
      };
      systemd.services.sshd.preStart = lib.optionalString (hasAge && seeded) ''
        ${pkgs.gnugrep}/bin/grep -qx bootstrap-ok /run/agenix/probe
      '';
      system.stateVersion = host.system.stateVersion;
      testing.initrdBackdoor = true;
      virtualisation = {
        diskImage = null;
        emptyDiskImages = [
          {
            size = 64;
            driveConfig.deviceExtraOpts.serial = "preserved";
          }
        ];
        fileSystems."/persistent" = {
          inherit (host.fileSystems."/persistent") neededForBoot;
          autoFormat = true;
          device = "/dev/disk/by-id/virtio-preserved";
          fsType = "ext4";
        };
        memorySize = 1024;
      };
    }
    // lib.optionalAttrs hasAge {
      age = {
        inherit (host.age) identityPaths;
        secrets = lib.optionalAttrs seeded {
          probe.file = "${fixture}/probe.age";
        };
      };
    };
in
pkgs.testers.runNixOSTest {
  name = "${hostName}-ssh-bootstrap";
  nodes = {
    fresh = node false;
    seeded = node true;
  };
  testScript = ''
    def check_host_keys(machine):
        machine.wait_for_unit("sshd.service")
        for kind in ["rsa", "ed25519"]:
            key = f"/etc/ssh/ssh_host_{kind}_key"
            machine.succeed(f"test -L {key}")
            assert machine.succeed(f"readlink {key}").strip() == f"/persistent{key}"
            machine.succeed(f"test -s /persistent{key}")
            assert machine.succeed(f"stat -Lc '%a %U %G' {key}").strip() == "600 root root"
            public_key = machine.succeed(f"ssh-keygen -y -f {key}").split()
            saved_public_key = machine.succeed(f"cat {key}.pub").split()
            assert public_key[:2] == saved_public_key[:2]
        return machine.succeed("sha256sum /persistent/etc/ssh/ssh_host_*_key")

    for machine in [seeded, fresh]:
        machine.start(allow_reboot=True)
        machine.wait_for_unit("default.target")

    with subtest("Provision a matching identity before the first activation"):
        seeded.succeed("install -D -m 0600 ${fixture}/host /sysroot/persistent/etc/ssh/ssh_host_ed25519_key")
        seeded.succeed("install -D -m 0644 ${fixture}/host.pub /sysroot/persistent/etc/ssh/ssh_host_ed25519_key.pub")
        seeded.switch_root()
        seeded.wait_for_unit("sshd.service")
        ${lib.optionalString hasAge ''seeded.succeed("grep -qx bootstrap-ok /run/agenix/probe")''}
        seeded.succeed("cmp ${fixture}/host /persistent/etc/ssh/ssh_host_ed25519_key")

    with subtest("Generate host keys on an empty persistent disk"):
        fresh.fail("test -e /sysroot/persistent/etc/ssh/ssh_host_ed25519_key")
        fresh.switch_root()
        fresh.wait_for_unit("sshd.service")

    for machine in [seeded, fresh]:
        with subtest(f"{machine.name}: preserve host keys across a clean-root reboot"):
            original_keys = check_host_keys(machine)
            machine.succeed("touch /unpreserved-boot-marker")
            machine.reboot()
            machine.wait_for_unit("default.target")
            machine.fail("test -e /sysroot/unpreserved-boot-marker")
            machine.switch_root()
            assert check_host_keys(machine) == original_keys

    ${lib.optionalString hasAge ''
      with subtest("Decrypt secrets again after reboot without reprovisioning keys"):
          seeded.succeed("grep -qx bootstrap-ok /run/agenix/probe")
    ''}
  '';
}
