'use strict';
//Subscribtion for Events
$('#list').on('click', '.deleteMe', function(){
    var currentList = $(".soundItem");
    if (currentList.length > 1)
    {
        $(this).parent().remove();
        $('#list').listview('refresh');
    }
    else
    {
        console.log("Last Entry can not be delete!")
    }
});

$('#list').on('click', '.playSound', function(){
    var entry = $(this).parent();
    var jsonInput = UiFunc.getPLayData(entry);
    SleepUinoDevCom.playSound(jsonInput);
});


var UiFunc = {
    titleList : [],

    
    setPlayData : function(parentElement, titleIndex, volume){
        //set volume data from slider
        var sliderVolume = parentElement.find(".sliderItem").eq(0);
        var volume = sliderVolume.val(volume).slider("refresh");

        //set title name of song
        var selectionTitle = parentElement.find(".titleSelectItem").eq(1);
        var titleValue = selectionTitle.val(titleIndex).selectmenu("refresh");
    },

    getPLayData : function(parentElement){
        //get volume data from slider
        var sliderVolume = parentElement.find(".sliderItem").eq(0);
        var volume = sliderVolume.val();
        
        //get selected title name of song
        var selectionTitle = parentElement.find(".titleSelectItem").eq(1);
        var titleValue = selectionTitle.val();
        var titleName = UiFunc.titleList[titleValue];

        //return dictionary 
        return {"volume" : volume, "soundFile" : titleName};
    },

    save : function(){
        var songArr = [];
        var currentList = $(".soundItem");
        console.log(`save: ${currentList.length} entries`);
        for (let i=0; i < currentList.length; i++)
        {
            var playData = UiFunc.getPLayData(currentList.eq(i));
            songArr.push(playData)
        }

        var gainFactor = $("#gainFactor").val();

        SleepUinoDevCom.saveData({"gainFactor": gainFactor, "playList": songArr});
    },

    setSliders : function  (jsonAnswer){
        $("#sliderGain").val(jsonAnswer.gain).slider('refresh');
    },

    //In case the filelist is empty create an error list entry 
    setFirstEntry: function (fileListNotEmpty){
        if (fileListNotEmpty)
        {
            UiFunc.addItem();
        }
        else
        {
            UiFunc.addError();
        }
    },
    
    addError : function (){
        var listEntry = `
            <li class='listItem'>
                <a>Error: Could not find mp3 files on SD card, check ESP serial output</a>
            </li>
        ` 
        $("#list").append(listEntry);
        $('#list').listview('refresh');

        $('#playButton').addClass("ui-disabled");
        $('#addButton').addClass("ui-disabled");
    },

    addItem : function (){
        var listEntryStart = `
            <li class='listItem'>
                <a class='soundItem'>
                    <label for="titel">Titel:</label>
                    <select name="titel" class="titleSelectItem">`;
         var listEntryEnd = `</select>
                    <label class="labelSliderGain" for="sliderGain">Volume:</label>
                    <input type="range" name="sliderGain" class="sliderItem" data-highlight="true"  min="0" max="100" value="25">
                    <button class="ui-btn ui-corner-all playButton playSound">Play</button>  
                </a>
                <a class='deleteMe'></a>
            </li>`;
        
        var titleList = UiFunc.titleList;
        
        var titleEntries = "";
        for (let i=0; i < titleList.length; i++)
        {
            titleEntries = titleEntries + `<option value="${i}">${titleList[i]}</option>`;
        }

        var listEntry = listEntryStart + titleEntries + listEntryEnd

        $("#list").append(listEntry);
        $('#list').listview('refresh');
        //$('[type="range"]').slider();
        //$('.sliderItem').slider();
        //$('.sliderItem').textinput();
        $('#list').trigger("create")        
    },

    setData : function(jsonData)
    {
        UiFunc.titleList = jsonData.files;
        var config = jsonData.config;
        
        if (jsonData.files.length == 0)
        {
            UiFunc.setFirstEntry(false);
        }
        else
        {
            var playList = config.playList;
            if (playList.length > 0)
            {
                for (let i=0; i < playList.length; i++)
                {
                    var soundEntry = playList[i];
                    var volume = soundEntry.volume;
                    var index = UiFunc.titleList.indexOf(soundEntry.soundFile)
                    if (index != -1)
                    {
                        UiFunc.addItem();
                        //set values
                        var parent = $(".soundItem").last();
                        UiFunc.setPlayData(parent, index, volume);
                    }

                }
            }
            else
            {
                UiFunc.setFirstEntry(true);
            }
        }

        //set GainFactor
        var gainFactor = config.gainFactor;
        $("#gainFactor").val(gainFactor).selectmenu("refresh");



    }
};