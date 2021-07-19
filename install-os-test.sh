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

ISO="$(curl -fs "https://mirror.pkgbuild.com/iso/latest/" | grep -Eo 'archlinux-[0-9]{4}\.[0-9]{2}\.[0-9]{2}-x86_64.iso' | head -n 1)"
if [ ! -f "/var/tmp/${ISO}" ]; then
	curl -o "/var/tmp/${ISO}" "https://mirror.pkgbuild.com/iso/latest/${ISO}"
fi

rm -f /var/tmp/guest.in /var/tmp/guest.out
xorriso -osirrox on -indev "/var/tmp/${ISO}" -extract arch/boot/x86_64 /var/tmp/
ISO_VOLUME_ID="$(xorriso -indev "/var/tmp/${ISO}" |& awk -F : '$1 ~ "Volume id" {print $2}' | tr -d "' ")"
mkfifo /var/tmp/guest.out /var/tmp/guest.in
qemu-img create -f qcow2 /var/tmp/os.img 8G

{ qemu-system-x86_64 \
	-m 4G \
	-enable-kvm \
	-net nic \
	-net user \
	-kernel /var/tmp/vmlinuz-linux \
	-initrd /var/tmp/initramfs-linux.img \
	-append "archisolabel=${ISO_VOLUME_ID} console=ttyS0" \
	-drive file=/var/tmp/os.img,if=virtio \
	-drive file="/var/tmp/${ISO}",if=virtio,media=cdrom,readonly=on \
	-monitor none \
	-serial pipe:/var/tmp/guest \
	-nographic || kill "${$}"; } &

exec 3>&1 {fd}< <(tee /dev/fd/3 </var/tmp/guest.out)
expect "archiso login:"
echo -en "root\n" > /var/tmp/guest.in
expect "# "
echo -en "curl -L pbizopoulos.github.io/install-os.sh | sed 's/sda/vda/' | bash\n" > /var/tmp/guest.in
expect "7. Add contents of /home/pbizopoulos/.ssh/id_ed25519.pub to GitHub SSH settings."
echo -en "shutdown now\n" > /var/tmp/guest.in
wait
qemu-system-x86_64 -m 4G -enable-kvm -drive file=/var/tmp/os.img -drive if=pflash,readonly=on,file=/usr/share/ovmf/x64/OVMF_CODE.fd
