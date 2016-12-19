var x;
var arrowOpacity = 0;
var animationsEnabled = false;
var _purple = "rgb(139, 29, 249)";
var _pink = "rgb(255, 11, 159)";
var _lightBlue = "rgb(31, 133, 255)";
var _white = "rgb(248, 248, 248)";
var _transparent = "rgba(0, 0, 0, 0)"
var _gold = "rgb(255, 181, 11)";
var _gray = "rgb(49, 49, 49)";
var _icon_active = _gray;
var _icon_faded = "rgba(49, 49, 49, 0.5)";
var music_visible = false;

var breaks = {
    music : {
        forward : 650,
        reverse : 650
    },
    nestio : {
        forward : 1400,
        reverse : 1400
    },
    coding: {
        forward : 2250,
        reverse : 2250
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
            $("#header-icon").css("opacity", 0.5);
            $("#music-icon").css("opacity", 1);
            $("#career-icon").css("opacity", 0.5);
            $("#coding-icon").css("opacity", 0.5);
        },
        reverse : function(){
            states.music.visible = false;
            $(".music-strip-hide").css("opacity", 0);
            $(".header-strip-hide").css("opacity", 1);
            $("body").css("background-color", _white);
            $("#header-icon").css("opacity", 1);
            $("#music-icon").css("opacity", 0.5);
            $("#career-icon").css("opacity", 0.5);
            $("#coding-icon").css("opacity", 0.5);
        },
    },
    nestio : {
        forward : function(){
            states.nestio.visible = true;
            $(".nestio-strip-hide").css("opacity", 1);
            $("body").css("background-color", _pink);
            $("#header-icon").css("opacity", 0.5);
            $("#music-icon").css("opacity", 0.5);
            $("#career-icon").css("opacity", 1);
            $("#coding-icon").css("opacity", 0.5);
        },
        reverse : function(){
            states.nestio.visible = false;
            $(".nestio-strip-hide").css("opacity", 0);
            $("body").css("background-color", _gold);
            $("#header-icon").css("opacity", 0.5);
            $("#music-icon").css("opacity", 1);
            $("#career-icon").css("opacity", 0.5);
            $("#coding-icon").css("opacity", 0.5);
        },
    },
    coding : {
        forward : function(){
            states.coding.visible = true;
            $(".coding-strip-hide").css("opacity", 1);
            $("body").css("background-color", _purple);
            $("#header-icon").css("opacity", 0.5);
            $("#music-icon").css("opacity", 0.5);
            $("#career-icon").css("opacity", 0.5);
            $("#coding-icon").css("opacity", 1);
        },
        reverse : function(){
            states.coding.visible = false;
            $(".coding-strip-hide").css("opacity", 0);
            $("body").css("background-color", _pink);
            $("#header-icon").css("opacity", 0.5);
            $("#music-icon").css("opacity", 0.5);
            $("#career-icon").css("opacity", 1);
            $("#coding-icon").css("opacity", 0.5);
        }
    }
};

$("#header-icon").click(function(){
    $(document).scrollTop(0);
    checkScroll();
});

$("#music-icon").click(function(){
    $(document).scrollTop(900);
    checkScroll();
});

$("#career-icon").click(function(){
    $(document).scrollTop(1700);
    checkScroll();
});

$("#coding-icon").click(function(){
    $(document).scrollTop(2500);
    checkScroll();
});
