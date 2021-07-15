#!/bin/bash

# 1. LATEST_ISO="$(curl -fs "https://mirror.pkgbuild.com/iso/latest/" | grep -Eo 'archlinux-[0-9]{4}\.[0-9]{2}\.[0-9]{2}-x86_64.iso' | head -n 1)" && curl -f -o ./archlinux.iso "https://mirror.pkgbuild.com/iso/latest/${LATEST_ISO}"
# 2. plug USB (/dev/sdx) to host
# 3. dd bs=4M if=./archlinux.iso of=/dev/sdx status=progress oflag=sync
# 4. unplug USB (/dev/sdx)
# 5. plug USB (/dev/sdx) to the target
# 6. boot target from USB
# 7. curl -LO pbizopoulos.github.io/install-os.sh
# 8. vim script.sh to change root_password, ssh_password, user_password
# 9. bash script.sh
# 10. reboot
# 11. execute commands in install-os-post.txt

set -e
root_password="root"
ssh_password="root"
user_password="root"
timedatectl set-ntp true
pacman --noconfirm -Sy
sgdisk --zap-all /dev/sda
printf "n\n1\n4096\n+512M\nef00\nw\ny\n" | gdisk /dev/sda
printf "n\n2\n\n\n8e00\nw\ny\n" | gdisk /dev/sda
yes | mkfs.ext4 /dev/sda2
mount /dev/sda2 /mnt
yes | mkfs.fat -F32 /dev/sda1
mkdir /mnt/boot/
mount /dev/sda1 /mnt/boot
pacstrap /mnt base base-devel broadcom-wl docker git intel-ucode iwd linux linux-firmware man-db man-pages mpv mutt newsboat pulseaudio qutebrowser slock vim xorg-server xorg-xinit xorg-xinput youtube-dl zathura-pdf-poppler
genfstab -U /mnt >> /mnt/etc/fstab

arch-chroot /mnt /bin/bash << EOF
ln -sf /usr/share/zoneinfo/Europe/Athens /etc/localtime
hwclock --systohc
echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
echo "el_GR.UTF-8 UTF-8" >> /etc/locale.gen
echo "LANG=en_US.UTF-8" >> /etc/locale.conf
locale-gen
echo "archlinux" > /etc/hostname
echo "root:$root_password" | chpasswd
useradd -m -G docker,wheel -s /bin/bash pbizopoulos
echo "pbizopoulos:$user_password" | chpasswd
bootctl --path=/boot install
mkdir -p /boot/loader/

tee -a /boot/loader/loader.conf << END
default arch.conf
timeout 0
END

mkdir -p /boot/loader/entries/

tee -a /boot/loader/entries/arch.conf << END
title Arch Linux
linux /vmlinuz-linux
initrd /intel-ucode.img
initrd /initramfs-linux.img
options root=PARTUUID=$(blkid -s PARTUUID -o value /dev/sda2) rw
END

tee -a /etc/systemd/network/25-wireless.network << END
[Match]
Name=wlan0

[Network]
DHCP=ipv4
END

echo '%wheel ALL=(ALL) NOPASSWD: ALL' | EDITOR='tee -a' visudo

systemctl enable iwd
systemctl enable systemd-networkd
systemctl enable systemd-resolved

echo "set font 'monospace 55'" > /etc/zathurarc
git clone https://github.com/pbizopoulos/fswm && cd fswm && make install && cd .. && rm -rf fswm/
EOF

arch-chroot -u pbizopoulos /mnt /bin/bash << EOF
cd /home/pbizopoulos/ && git clone https://aur.archlinux.org/st.git && cd st && curl -LO https://st.suckless.org/patches/solarized/st-solarized-light-20190306-ed68fe7.diff && makepkg && git apply st-solarized-light-20190306-ed68fe7.diff && cp config.def.h config.h && makepkg --noconfirm -sif && cd .. && rm -rf st/

tee -a /home/pbizopoulos/.xinitrc << END
setxkbmap -layout us,gr -option grp:win_space_toggle
fswm st -f "Source Code Pro:pixelsize=60:style=bold"
END

mkdir -p /home/pbizopoulos/.mail/

tee -a /home/pbizopoulos/.mail/signature << END
Paschalis Bizopoulos
Information Technologies Institute
Centre for Research and Technology Hellas
6th Km Charilaou-Thermi Road,
Thermi-Thessaloniki, Greece,  GR57001 (PO Box 60361)
Tel. : +30-2310-464160
Fax : +30-2310-464164
END

touch /home/pbizopoulos/.mail/spoolfile

tee -a /home/pbizopoulos/.muttrc << END
set realname="Paschalis Bizopoulos"
set editor=/usr/bin/vim
set record="~/.mail/sent"
set from="pbizopoulos@iti.gr"
set pop_host="pops://pbizopoulos@mail.iti.gr:995"
set smtp_url="smtps://pbizopoulos@mail.iti.gr:465"
set folder="~/.mail"
set spoolfile="~/.mail/spoolfile"
set signature="~/.mail/signature"
END

mkdir -p /home/pbizopoulos/.config/qutebrowser/

tee -a /home/pbizopoulos/.config/qutebrowser/config.py << END
config.load_autoconfig(False)
c.downloads.location.directory = '/home/pbizopoulos/'
c.fonts.default_size = '60pt'
c.zoom.default = '300%'
END

mkdir -p /home/pbizopoulos/.newsboat/
touch /home/pbizopoulos/.newsboat/urls

tee -a /home/pbizopoulos/.newsboat/config << END
delete-read-articles-on-quit yes
browser "qutebrowser %u"
macro m set browser "mpv %u"; open-in-browser ; set browser "qutebrowser %u"
END

tee -a /home/pbizopoulos/.gitconfig << END
[user]
	email = pbizopoulos@protonmail.com
	name = Paschalis Bizopoulos
[pull]
	rebase = false
END

echo "filetype plugin indent on" > .vimrc

ssh-keygen -t ed25519 -C "pbizopoulos@protonmail.com" -f "/home/pbizopoulos/.ssh/id_ed25519" -P "$ssh_password"

tee -a /home/pbizopoulos/install-os-post.txt << END
1. pulseaudio --start
2. pactl set-sink-volume 0 100%
3. pactl set-sink-mute 0 0
4. eval "\$(ssh-agent -s)"
5. ssh-add /home/pbizopoulos/.ssh/id_ed25519
6. Sign in to GitHub.
7. Add contents of /home/pbizopoulos/.ssh/id_ed25519.pub to GitHub SSH settings.
END

EOF

umount -R /mnt
