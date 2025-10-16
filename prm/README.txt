# <URL> options
# https://nix.dev/manual/nix/latest/command-ref/new-cli/nix3-flake.html#examples
git+ssh://git@<domain>/<namespace>/<repository-name>			# <URL-private> remote private repository
<domain>:<namespace>/<repository-name>					# <URL-public> remote public repository
~/<domain>/<namespace>/<repository-name>				# <URL-local> local repository

# general commands
nix flake clone <URL> --dest <URL-local>				# clone repository
nix flake new <URL-local> --template <URL> 				# create new flake from <URL>
nix flake show <URL> | grep -Ev "omitted|unknown"			# show all <package> and <host>
nix flake check <URL>			 				# run tests and build all <package> and <host>
cd <URL-local> && nix fmt						# run formatter

# <package> commands
nix build nixpkgs#pkgsCross.<cpu>-<vendor>.<package>			# build <package> for <cpu>-<vendor>
nix build <URL>#packages.<cpu>.<package>				# build <package> for <cpu>
nix run <URL>#<package>							# run <package>, export DEBUG=1 to run tests and use the next command if build is slow
nix run <URL>#<package> --extra-substituters https://nix-community.cachix.org --extra-trusted-public-keys nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs=
nix run --impure github:nix-community/nixGL nix run <URL>#<package>	# run <package> when cuda in non-NixOS, export NIXPKGS_ALLOW_UNFREE=1 if needed

# <host> commands
nix run <URL>#nixosConfigurations.<host>.config.system.build.vm		# run <host> in virtual machine (replace with vmWithDisko if using Disko)
nix run nixpkgs#nixos-generators -- --flake <URL>#<host> --format iso	# generate iso from <host>
bash <URL-local>/hosts/<host>/deploy-requirements.sh 			# run once before first deploy
bash <URL-local>/hosts/<host>/deploy.sh					# deploy <host> remotely
nixos-rebuild switch --flake <URL>#<host>				# deploy <host> locally
