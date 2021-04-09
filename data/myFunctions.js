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
    var sliderVolume = entry.find(".sliderItem").eq(0);
    var selectionTitle = entry.find(".titleSelectItem").eq(1);

    var volume = sliderVolume.val();
    var titleValue = selectionTitle.val();
    var titleName = SleepUinoDevCom.titleList[titleValue]
    
    var jsonInput = {"volume" : volume, "soundFile" : titleName}

    SleepUinoDevCom.playSound(jsonInput);
});


var UiFunc = {
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
        
        var titleList = SleepUinoDevCom.titleList;
        
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
    }
};