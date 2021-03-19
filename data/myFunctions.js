'use strict';

var UiFunc = {
    setSliders : function  (jsonAnswer){
        $("#sliderGain").val(jsonAnswer.gain).slider('refresh');
    },
};