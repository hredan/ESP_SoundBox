
#include "handleAudio.h"

HandleAudio::HandleAudio()
{
    _soundIsPlaying = false;
    audioLogger = &Serial;
   
    _out = new AudioOutputI2S();
    _audioGen = new AudioGeneratorWAV();
};

//default volume value = 2
uint8_t HandleAudio:: _gainSound = 2;
bool HandleAudio::_soundIsPlaying = false;

AudioGeneratorWAV * HandleAudio::_audioGen = nullptr;
AudioFileSourceLittleFS * HandleAudio::_file = nullptr;
AudioOutputI2S * HandleAudio::_out = nullptr;

void HandleAudio::setCallBackSoundIsDone(CallBackSoundIsDone callBack)
{
    _callBackSoundIsDone = callBack;
}

uint8_t HandleAudio::getGain()
{
    return HandleAudio::_gainSound;
}
void HandleAudio::setGain(uint8_t gainValue)
{
    HandleAudio::_gainSound = gainValue;
}

bool HandleAudio::isSoundPlaying()
{
    if (_audioGen->isRunning())
    {
        if (!_audioGen->loop()) 
        {
            _audioGen->stop();
            _soundIsPlaying = false;
            Serial.printf("WAV done\n");
            
            if (_callBackSoundIsDone != nullptr)
            {
                _callBackSoundIsDone();
                //handleWebpage->sendSuccess();
            }
        }
    }
    return _soundIsPlaying;
}

void HandleAudio::playSound()
{
    if(LittleFS.exists("/Kikeriki.wav"))
    {
        Serial.println("initialize all instances, needed for sound");
        //max gain value < 4
        float gain = (_gainSound - 1) * 0.04;
        _out->SetGain(gain);
        Serial.println("use gain to play sound: " + String(gain));

        #ifdef ENABLE_DISABLE_I2S
            i2s_begin();
        #endif
        
        Serial.println("load file");
        _file = new AudioFileSourceLittleFS("/Kikeriki.wav");
        Serial.println("play sound");
        if (_audioGen->begin(_file, _out))
        {
            _soundIsPlaying = true;
        }
    }
}
