#!/bin/bash

# 1. sudo pacman -Syu edk2-ovmf qemu libisoburn
# 2. curl -L pbizopoulos.github.io/install-os-test.sh | bash

set -e

function expect() {
	local length="${#1}"
	local i=0
	local timeout="${2:-30}"
	while true; do
		IFS= read -r -u ${fd} -n 1 -t "${timeout}" c
		if [ "${1:${i}:1}" = "${c}" ]; then
			i="$((i + 1))"
			if [ "${length}" -eq "${i}" ]; then
				break
			fi
		else
			i=0
		fi
	done
}

function send() {
	echo -en "${1}" >guest.in
}

LATEST_ISO="$(curl -fs "https://mirror.pkgbuild.com/iso/latest/" | grep -Eo 'archlinux-[0-9]{4}\.[0-9]{2}\.[0-9]{2}-x86_64.iso' | head -n 1)"
curl -fO "https://mirror.pkgbuild.com/iso/latest/${LATEST_ISO}"
ISO="${LATEST_ISO}"

rm -rf ./tmp/ && mkdir -p ./tmp/ && cd ./tmp/
xorriso -osirrox on -indev "../${ISO}" -extract arch/boot/x86_64 .
ISO_VOLUME_ID="$(xorriso -indev "../${ISO}" |& awk -F : '$1 ~ "Volume id" {print $2}' | tr -d "' ")"
mkfifo guest.out guest.in
qemu-img create -f qcow2 scratch-disk.img 16G

{ qemu-system-x86_64 \
	-m 4G \
	-enable-kvm \
	-net nic \
	-net user \
	-kernel vmlinuz-linux \
	-initrd initramfs-linux.img \
	-append "archisolabel=${ISO_VOLUME_ID} console=ttyS0" \
	-drive file=scratch-disk.img,if=virtio \
	-drive file="../${ISO}",if=virtio,media=cdrom,readonly=on \
	-monitor none \
	-serial pipe:guest \
	-nographic || kill "${$}"; } &

exec 3>&1 {fd}< <(tee /dev/fd/3 <guest.out)
expect "archiso login:"
send "root\n"
expect "# "
send "curl -L pbizopoulos.github.io/install-os.sh | sed 's/sda/vda/' | bash\n"
expect "7. Add contents of /home/pbizopoulos/.ssh/id_ed25519.pub to GitHub SSH settings."
send "shutdown now\n"
wait
qemu-system-x86_64 -m 4G -enable-kvm -drive file=scratch-disk.img -drive if=pflash,readonly=on,file=/usr/share/ovmf/x64/OVMF_CODE.fd
