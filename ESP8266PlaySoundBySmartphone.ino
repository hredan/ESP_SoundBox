

#include <ESP8266WiFi.h>    //https://github.com/esp8266/Arduino
#include "handleAudio.h"
#include "handleWebpage.h"
#include "LittleFS.h"

//declaration of needed instances
HandleAudio *handleAudio;
HandleWebpage *handleWebpage;
   
void setup()
{
    Serial.begin(115200);
    Serial.print("\n");
    
    //init little filesystem
    if (LittleFS.begin())
    {
        Serial.print("LittleFS started successfully\n");
        FSInfo fs_info;
        LittleFS.info(fs_info);
        Serial.printf("FS total Bytes %d\n", fs_info.totalBytes);
        Serial.printf("FS used Bytes %d\n", fs_info.usedBytes);
    }
    else
    {
        Serial.print("Error: Could not start LittleFS!\n");
    }

    handleWebpage = new HandleWebpage();
    handleAudio = new HandleAudio();

    handleAudio->setCallBackSoundIsDone(handleWebpage->sendSuccess);
    handleWebpage->setCallBackSetGain(handleAudio->setGain);
    handleWebpage->setCallBackGetGain(handleAudio->getGain);
    handleWebpage->setCallBackPlaySound(handleAudio->playSound);
    
    handleWebpage->setupHandleWebpage();

    WiFi.mode(WIFI_AP);
    WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
    WiFi.softAP("TestI2S");

    
    

    // if DNSServer is started with "*" for domain name, it will reply with
    // provided IP to all DNS request
    dnsServer.start(DNS_PORT, "*", apIP);
}

void loop()
{   
    if (!handleAudio->isSoundPlaying())
    {
        dnsServer.processNextRequest();
        handleWebpage->handleClient();
    }
}
