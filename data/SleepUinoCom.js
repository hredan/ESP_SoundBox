'use strict';
var SleepUinoCom = {
    //needed for Mockup Communication (in case enableServerCom = false)
    enableServerCom : true,
    isFirstGetTimeRequest : true,
    moonValue : 50,
    sunValue : 60,
    gainValue : 20,
    saveValue : 0,
    isNotPlayingSound : true,

    getTime : function (){
        if (this.enableServerCom)
        {
            $.ajax({url: "/getTime", type: "GET", dataType: "json"})
            .done(function(jsonSleepUinoTime){
                UiFunc.checkTimeDiff(jsonSleepUinoTime);
            });
        }
        else
        {
            var now = new Date();
            if (this.isFirstGetTimeRequest)
            {
                now.setHours(now.getHours() + 1);
                this.isFirstGetTimeRequest = false;
            }

            var jsonSleepUinoTimeFake = {"year": now.getFullYear(), "month": now.getMonth(), "day": now.getDate(), 
                "hours": now.getHours(), "minutes": now.getMinutes(), "seconds": now.getSeconds()};
                UiFunc.checkTimeDiff(jsonSleepUinoTimeFake);
        }
    },

    getValues : function(){
        if (this.enableServerCom)
        {
            $.ajax({url: "/getValues", type: "GET", dataType: "json"})
                .done(function(jsonResult){
                    UiFunc.setSliders(jsonResult);;
                });
        }
        else
        {
            UiFunc.setSliders({"gain": this.gainValue,});
        }
    },

    syncTime : function () {
        var now = new Date();
        var jsonTimeObj = {"year": now.getFullYear(), "month": now.getMonth(), "day": now.getDate(), 
            "hours": now.getHours(), "minutes": now.getMinutes(), "seconds": now.getSeconds()};
        
        if (this.enableServerCom)
        {
            $.ajax({url: "/syncTime", type: "POST", dataType: "json", data: jsonTimeObj})
            .done(function(jsonAnswer){
                //update Time and check diff again
                if(jsonAnswer.success)
                {
                    $("#syncButton").blur();
                    SleepUinoCom.getTime();
                }                
            });
        }
        else
        {
            $("#syncButton").blur();
            this.getTime();
        }
       
    },

    Sleep: function (milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    },

    playFakeSound : async function(){
        if (this.isNotPlayingSound)
        {
            this.isNotPlayingSound = false;
            var audio = new Audio('Kikeriki.wav');
            audio.volume = this.gainValue/100.0;
            audio.play();
            await this.Sleep(3000); 
            $("#playButton").blur();
            console.log("Play Sound");
            this.isNotPlayingSound = true; 
        }
    },

    playSound : function (){
        if (this.enableServerCom)
        {
            $.ajax({url: "/playSound", type: "GET", dataType: "json", timeout: 10000})
            .done(function(jsonResult){
                if(jsonResult.success)
                {
                    $("#playButton").blur();
                }
                else
                {
                    console.log("Error: playSound");
                }
            });
        }
        else
        {
           this.playFakeSound();
        }
    },

    setAlarmVolume : function (volumeValue)
    {
        if (this.enableServerCom)
        {
            var jsonTimeObj = {"gain": volumeValue};
            $.ajax({url: "/setGain", type: "POST", dataType: "json", data: jsonTimeObj})
            .success(function(result){
                console.log(result);
            });
        }
        else
        {
            this.gainValue = volumeValue;
        }
    },

    sendDataSun : function (brightness)
    {
       if (this.enableServerCom)
       {
            $.ajax({url: "/setLEDSun", type: "POST", dataType: "text", data: brightness})
            .success(function(result){
                console.log(result);
            });
       }
       else
       {
            this.sunValue = brightness;
       }
    },
    
    sendDataMoon : function (brightness){
        
        if (this.enableServerCom)
        {
            $.ajax({url: "/setLEDMoon", type: "POST", dataType: "text", data: brightness})
            .success(function(result){
                console.log(result);
            });
        }
        else
        {
            this.moonValue = brightness;
        }
        
    },

    getWakeUpArray : function ()
    {
        var jsonWakeTimesAnswer
        if (this.enableServerCom)
        {
            //ToDo: implement function on SleepUINO Site
            jsonWakeTimesAnswer = {"wakeTimes":[{"getUp":"06:00", "goToBed": "09:00", "alarm": true}, {"getUp":"12:00", "goToBed": "15:00", "alarm": false}]};
        }
        else
        {
            jsonWakeTimesAnswer = {"wakeTimes":[{"getUp":"06:00", "goToBed": "09:00", "alarm": true}, {"getUp":"12:00", "goToBed": "15:00", "alarm": false}]};
        }
        
        return jsonWakeTimesAnswer;
    }
};