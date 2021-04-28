'use strict';
var SleepUinoDevCom = {
    //needed for Mockup Communication (in case enableServerCom = false)
    enableServerCom : true,
    
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

    saveData: function(jsonData){
        if (this.enableServerCom)
        {
            $.ajax({url: "/saveData", type: "POST", dataType: "text", data: JSON.stringify(jsonData)})
            .success(function(result){
                console.log(result);
            });
        }
        else
        {
            console.log("FakeCom: saveData-> " + JSON.stringify(jsonData))
        }
    },

    getData : function(){
        if (this.enableServerCom)
        {
            $.ajax({url: "/getData", type: "GET", dataType: "text"})
                .done(function(data){
                    console.log("Receive data->" + data);
                    var jsonResult = JSON.parse(data);
                    UiFunc.setData(jsonResult);
                });
        }
        else
        {
            var jsonStr = '{"config":{"gainFactor":"1.0","playList":[{"volume":"25","soundFile":"02.mp3"},{"volume":"10","soundFile":"03.mp3"}]}'+
                        ',"files":["01.mp3","02.mp3","03.mp3"]}';
            var jsonResult = JSON.parse(jsonStr);
            console.log("FakeCom: Receive data->" + JSON.stringify(jsonResult));
            UiFunc.setData(jsonResult);
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