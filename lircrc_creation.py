#!/usr/bin/env python

import sys

port = None
if len(sys.argv) != 2:
  print "Usage: ./lirc_creation.py port_to_connect_to"
  sys.exit()
else:
  port = sys.argv[1]
   
fi = open("/etc/lirc/lircd.conf", "r")
fo = open("/etc/lirc/lircrc", "w")

keys_dict = {
  'KEY_POWER': 'power',
  'KEY_POWERON': 'poweron',
  'KEY_POWEROFF': 'poweroff',
  'KEY_FORMAT': 'format',
  'KEY_PAUSE': 'pause',
  'KEY_REWIND': 'rew',
  'KEY_RESTART': 'replay',
  'KEY_STOP': 'stop',
  'KEY_FASTFORWARD': 'advance',
  'KEY_FORWARD': 'ffwd',
  'KEY_RECORD': 'record',
  'KEY_PLAY': 'play',
  'KEY_GUIDE': 'guide',
  'KEY_ACTIVE': 'active',
  'KEY_LIST': 'list',
  'KEY_EXIT': 'exit',
  'KEY_BACK': 'back',
  'KEY_MENU': 'menu',
  'KEY_INFO': 'info',
  'KEY_UP': 'up',
  'KEY_DOWN': 'down',
  'KEY_LEFT': 'left',
  'KEY_RIGHT': 'right',
  'KEY_SELECT': 'select',
  'KEY_RED': 'red',
  'KEY_GREEN': 'green',
  'KEY_YELLOW': 'yellow',
  'KEY_BLUE': 'blue',
  'KEY_CHANNELUP': 'chanup',
  'KEY_CHANNELDOWN': 'chandown',
  'KEY_PREVIOUS': 'prev',
  'KEY_0': '0',
  'KEY_1': '1',
  'KEY_2': '2',
  'KEY_3': '3',
  'KEY_4': '4',
  'KEY_5': '5',
  'KEY_6': '6',
  'KEY_7': '7',
  'KEY_8': '8',
  'KEY_9': '9',
  'KEY_DASH': 'dash',
  'KEY_ENTER': 'enter'
};

begin = False
first_line = True

for line in fi:
  if begin == True:
    if "end raw_codes" in line:
      break
  if begin == False:
    if "begin raw_codes" in line:
      begin = True
    continue
  start = line.find("name")     
  if start > 0:
    start += 5
    end = len(line) - 1  
    button_lirc = line[start:end]
    button_directv = keys_dict[button_lirc]
    if first_line == False:
      fo.write("\n\n")
    else:      
      first_line = False  
    fo.write("begin\n     prog = irexec\n     button = "+button_lirc+"\n     config = echo -n "+button_directv+" | nc localhost "+port+"\nend")

fi.close()
fo.close()    

