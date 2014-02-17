This is an application for the Raspberry Pi that captures a DirecTV remote's IR signals 
and controls a DirecTV receiver over the internet. A Raspberry Pi with an IR receiver is needed.
The application uses netcat, LIRC and Node.js and requires some networking changes.

Configure networking:  
1. Set static IP of 192.168.1.200 on DirecTV receiver  
2. On router forward port 12000 to 192.168.1.200:8080  
3. /etc/network/interfaces:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;auto lo  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iface lo inet loopback  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iface eth0 inet static  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;address 192.168.1.110  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;netmask 255.255.255.0  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gateway 192.168.1.1  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow-hotplug wlan0  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iface wlan0 inet manual  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iface default inet dhcp  
4. sudo /etc/init.d/networking restart  
5. Power cycle  

Install netcat:  
1. sudo apt-get install netcat  

Configure lirc:  
1. sudo apt-get install lirc  
2. /etc/modules:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;snd-bcm2835  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lirc_dev  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lirc_rpi gpio_in_pin=18  
3. /etc/lirc/hardware.conf:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Arguments which will be used when launching lircd  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LIRCD_ARGS="--uinput"  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#Don't start lircmd even if there seems to be a good config file  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#START_LIRCMD=false  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#Don't start irexec, even if a good config file seems to exist.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#START_IREXEC=false  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#Try to load appropriate kernel modules  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LOAD_MODULES=true  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Run "lircd --driver=help" for a list of supported drivers.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DRIVER="default"  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# usually /dev/lirc0 is the correct setting for systems using udev  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DEVICE="/dev/lirc0"  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MODULES="lirc_rpi"  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Default configuration files for your hardware if any  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LIRCD_CONF=""  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LIRCMD_CONF=""  
4. sudo /etc/init.d/lirc stop  
5. sudo /etc/init.d/lirc start  
6. wget http://lirc.sourceforge.net/remotes/directv/RC64  
7. sudo mv RC64 /etc/lirc/lircd.conf  
8. Run lircrc_creation.py with port argument to create lircrc file: sudo ./lircrc_creation.py 8124  

Install node js:  
1. wget http://nodejs.org/dist/v0.10.17/node-v0.10.17-linux-arm-pi.tar.gz  
2. tar xvzf node-v0.10.17-linux-arm-pi.tar.gz  
3. sudo mkdir /opt/node  
4. sudo chown pi:pi /opt/node  
5. cp -r node-v0.10.17-linux-arm-pi/* /opt/node  
6. In /opt/node/bin directory run ./npm install forever -g  

Configure directv.js:  
1. Create /home/pi/directv and copy directv.js to this directory  
2. Copy directv.init to /etc/init.d/  
3. sudo chmod +x /etc/init.d/directv  
4. sudo update-rc.d directv defaults  
5. Add to /home/pi/.profile:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if [ -d "/opt/node/bin" ] ; then  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  PATH="$PATH:/opt/node/bin"  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fi  
6. Reboot  