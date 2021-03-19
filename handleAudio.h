#ifndef HANDLE_AUDIO_H_INCLUDED
#define HANDLE_AUDIO_H_INCLUDED

//Audio functionality comes from:
//https://github.com/earlephilhower/ESP8266Audio

#include "AudioFileSourceLittleFS.h"
#include "AudioGeneratorwAV.h"
#include <i2s.h>
#include "AudioOutputI2S.h"


class HandleAudio{
  using CallBackSoundIsDone = void (*) ();
  
  public:
    HandleAudio();
    static void playSound();
    static uint8_t getGain();
    static void setGain(uint8_t gainValue);
    bool isSoundPlaying();
    void setCallBackSoundIsDone(CallBackSoundIsDone callBack);
  
  private:
    static bool _soundIsPlaying;
    static uint8_t _gainSound;
    CallBackSoundIsDone _callBackSoundIsDone = nullptr;
  	static AudioGeneratorWAV *_audioGen;
    static AudioFileSourceLittleFS *_file;
    static AudioOutputI2S *_out; 
};
#endif // HANDLE_AUDIO_H_INCLUDED
