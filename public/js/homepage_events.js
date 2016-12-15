var x;
var arrowOpacity = 0;
var animationsEnabled = false;
var _purple = "rgb(139, 29, 249)";
var _pink = "rgb(255, 11, 159)";
var _lightBlue = "rgb(31, 133, 255)";
var _white = "rgb(248, 248, 248)";
var _transparent = "rgba(0, 0, 0, 0)"
var _gold = "rgb(255, 181, 11)";
var _gray = "rgb(49, 49, 49)"
var _icon_shaded = _gray;
var music_visible = false;

var breaks = {
    music : {
        forward : 350,
        reverse : 350
    },
    nestio : {
        forward : 1200,
        reverse : 1050
    },
    coding: {
        forward : 2000,
        reverse : 2000
    }
};

var states = {
    music : {
        visible : false,
    },
    nestio : {
        visible : false
    },
    coding : {
        visible : false
    }
};

window.onload = function(){
    animationsEnabled = true;
    checkScroll();
}

window.onscroll = function(){
    checkScroll();
};

function checkScroll(){
    if ($(document).scrollTop() >= breaks.music.forward){
        transitions.music.forward();
    } else if ($(document).scrollTop() <= breaks.music.reverse) {
        transitions.music.reverse();
    };

    if ($(document).scrollTop() >= breaks.nestio.forward) {
        transitions.nestio.forward();
    } else if ($(document).scrollTop() <= breaks.nestio.reverse && states.nestio.visible) {
        transitions.nestio.reverse();
    }

    if ($(document).scrollTop() >= breaks.coding.forward) {
        transitions.coding.forward();
    } else if ($(document).scrollTop() <= breaks.coding.reverse && states.coding.visible) {
        transitions.coding.reverse();
    }
}

var transitions = {
    music : {
        forward : function(){
            states.music.visible = true;
            $(".music-strip-hide").css("opacity", 1);
            $(".header-strip-hide").css("opacity", 0);
            $("body").css("background-color", _gold);
            $("#header-icon").css("color", _transparent);
            $("#music-icon").css("color", _icon_shaded)
            $("#career-icon").css("color", _transparent)
            $("#coding-icon").css("color", _transparent);
        },
        reverse : function(){
            states.music.visible = false;
            $(".music-strip-hide").css("opacity", 0);
            $(".header-strip-hide").css("opacity", 1);
            $("body").css("background-color", _white);
            $("#header-icon").css("color", _icon_shaded);
            $("#music-icon").css("color", _transparent)
            $("#career-icon").css("color", _transparent)
            $("#coding-icon").css("color", _transparent);
        },
    },
    nestio : {
        forward : function(){
            states.nestio.visible = true;
            $(".nestio-strip-hide").css("opacity", 1);
            $("body").css("background-color", _pink);
            $("#header-icon").css("color", _transparent);
            $("#music-icon").css("color", _transparent)
            $("#career-icon").css("color", _icon_shaded)
            $("#coding-icon").css("color", _transparent);
        },
        reverse : function(){
            states.nestio.visible = false;
            $(".nestio-strip-hide").css("opacity", 0);
            $("body").css("background-color", _gold);
            $("#header-icon").css("color", _transparent);
            $("#music-icon").css("color", _icon_shaded)
            $("#career-icon").css("color", _transparent)
            $("#coding-icon").css("color", _transparent);
        },
    },
    coding : {
        forward : function(){
            states.coding.visible = true;
            $(".coding-strip-hide").css("opacity", 1);
            $("body").css("background-color", _purple);
            $("#header-icon").css("color", _transparent);
            $("#music-icon").css("color", _transparent)
            $("#career-icon").css("color", _transparent)
            $("#coding-icon").css("color", _icon_shaded);
        },
        reverse : function(){
            states.coding.visible = false;
            $(".coding-strip-hide").css("opacity", 0);
            $("body").css("background-color", _pink);
            $("#header-icon").css("color", _transparent);
            $("#music-icon").css("color", _transparent)
            $("#career-icon").css("color", _icon_shaded)
            $("#coding-icon").css("color", _transparent);
        },
    }
};
