Configure networking:
1. Set static IP of 192.168.1.200 on DirecTV receiver
2. On router forward port 12000 to 192.168.1.200:8080
3. /etc/network/interfaces:
    auto lo
    iface lo inet loopback
    iface eth0 inet static
    address 192.168.1.110
    netmask 255.255.255.0
    gateway 192.168.1.1
    allow-hotplug wlan0
    iface wlan0 inet manual
    wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf
    iface default inet dhcp
4. sudo /etc/init.d/networking restart
5. Power cycle

Install netcat:
1.	sudo apt-get install netcat

Configure lirc:
1.	sudo apt-get install lirc
2.	/etc/modules:
snd-bcm2835
lirc_dev
lirc_rpi gpio_in_pin=18
3.	/etc/lirc/hardware.conf:
# Arguments which will be used when launching lircd
LIRCD_ARGS="--uinput"

#Don't start lircmd even if there seems to be a good config file
#START_LIRCMD=false

#Don't start irexec, even if a good config file seems to exist.
#START_IREXEC=false

#Try to load appropriate kernel modules
LOAD_MODULES=true

# Run "lircd --driver=help" for a list of supported drivers.
DRIVER="default"
# usually /dev/lirc0 is the correct setting for systems using udev
DEVICE="/dev/lirc0"
MODULES="lirc_rpi"

# Default configuration files for your hardware if any
LIRCD_CONF=""
LIRCMD_CONF=""
4.	sudo /etc/init.d/lirc stop
5.	sudo /etc/init.d/lirc start
6.	wget http://lirc.sourceforge.net/remotes/directv/RC64
7.	sudo mv RC64 /etc/lirc/lircd.conf
8.	Run lircrc_creation.py with port argument to create lircrc file: sudo ./lircrc_creation.py 8124

Install node js:
1.	wget http://nodejs.org/dist/v0.10.17/node-v0.10.17-linux-arm-pi.tar.gz
2.	tar xvzf node-v0.10.17-linux-arm-pi.tar.gz
3.	sudo mkdir /opt/node
4.	sudo chown pi:pi /opt/node
5.	cp -r node-v0.10.17-linux-arm-pi/* /opt/node
6.	In /opt/node/bin directory run ./npm install forever -g

Configure directv.js:
1.	Create /home/pi/directv and copy directv.js to this directory
2.	Copy init.d script to /etc/init.d/
3.	sudo chmod +x /etc/init.d/directv
4.	sudo update-rc.d directv defaults
5.	Add to /home/pi/.profile:
if [ -d "/opt/node/bin" ] ; then
  PATH="$PATH:/opt/node/bin"
fi
6.	Reboot