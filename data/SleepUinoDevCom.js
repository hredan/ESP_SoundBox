'use strict';
var SleepUinoDevCom = {
    //needed for Mockup Communication (in case enableServerCom = false)
    enableServerCom : true,
    titleList : [],

    setGainFactor: function(gainFactor){
        var jsonData = {"maxGain": gainFactor}
        if (this.enableServerCom)
        {
            $.ajax({url: "/setMaxGain", type: "POST", dataType: "json", data: jsonData})
            .success(function(result){
                console.log(result);
            });
        }
        else
        {
            console.log("FakeCom: setGainFactor-> " + JSON.stringify(jsonData))
        }
    },

    getTitleList : function(){
        if (this.enableServerCom)
        {
            $.ajax({url: "/getFiles", type: "GET", dataType: "json"})
                .done(function(jsonResult){
                    console.log("Receive File list->" + JSON.stringify(jsonResult));
                    SleepUinoDevCom.titleList = jsonResult;
                    if (SleepUinoDevCom.titleList.length > 0)
                    {
                        UiFunc.setFirstEntry(true);
                    }
                    else
                    {
                        UiFunc.setFirstEntry(false);
                    }
                });
        }
        else
        {
            SleepUinoDevCom.titleList = ["01.mp3", "02.mp3", "04.mp3"];
            //SleepUinoDevCom.titleList = [];

            if (SleepUinoDevCom.titleList.length > 0)
            {
                UiFunc.setFirstEntry(true);
            }
            else
            {
                UiFunc.setFirstEntry(false);
            }
        }
    },

    playSound : function(jsonData) {
        if (this.enableServerCom)
        {
            $.ajax({url: "/playSound", type: "POST", dataType: "json", data: jsonData})
            .success(function(result){
                console.log(result);
            });
        }
        else
        {
            console.log("FakeCom: playSound->" + JSON.stringify(jsonData));
        }
    },

    stopSound : function() {
        if (this.enableServerCom)
        {
            $.ajax({url: "/stopSound", type: "POST", dataType: "json"})
            .success(function(result){
                console.log(result);
            });
        }
        else
        {
            console.log("FakeCom: StopSound");
        }
    }
};