/*
  handleWebpage
  
  handleWebpage is used by SleepUino.ino. It is used to handle a webinterface for configuration of SleepUino.
  
  Information and contribution at https://www.sleepuino.sourcecode3d.de/.
  
  Copyright (C) 2020  André Herrmann
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef HANDLEWEBPAGE_H_INCLUDED
#define HANDLEWEBPAGE_H_INCLUDED

#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include "LittleFS.h"

const byte DNS_PORT = 53;
IPAddress apIP(172, 217, 28, 1);
DNSServer dnsServer;

class HandleWebpage
{
    //type aliasing
    //C++ version of: typedef void (*InputEvent)(const char*)
    using CallBackPlaySound = void (*)(String filename, int volume);
    using CallBackStopSound = void (*)();
    public:
        HandleWebpage(String filelist);
        void setupHandleWebpage();
        
        void handleClient();
        
        //CallBacks
        void setCallBackPlaySound(CallBackPlaySound callBackPlaySound);
        void setCallBackStopSound(CallBackStopSound callBackStopSound);

    private:
        CallBackPlaySound _callBackPlaySound = nullptr;
        CallBackStopSound _callBackStopSound = nullptr;
        String _filelist;
        void handleRoot();
        void handleWebRequests();
        void handlePlaySound();
        void handleStopSound();
        void handleGetFiles();

        bool loadFromLittleFS(String path);
        static ESP8266WebServer *_webServer;   
};
#endif // HANDLEWEBPAGE_H_INCLUDED