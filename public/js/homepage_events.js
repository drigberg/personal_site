var x;
var arrowOpacity = 0;
var animationsEnabled = false;
var _purple = "rgb(139, 29, 249)";
var _pink = "rgb(255, 11, 159)";
var _lightBlue = "rgb(31, 133, 255)";
var _white = "rgb(255, 255, 255)";
var _gold = "rgb(255, 181, 11)";
var music_visible = false;
var breaks = {
    music : {
        forward : 500,
        reverse : 150
    },
    nestio : {
        forward : 1200,
        reverse : 1050
    }
};

var states = {
    music : {
        visible : false,
    },
    nestio : {
        visible : false
    }
};

window.onload = function(){
    animationsEnabled = true;
    rotatePhoto($("#profile-photo"));
}

window.onscroll = function(){
    if ($(document).scrollTop() >= breaks.music.forward){
        transitions.music.forward();
    } else if ($(document).scrollTop() <= breaks.music.reverse && states.music.visible) {
        transitions.music.reverse();
    };

    if ($(document).scrollTop() >= breaks.nestio.forward) {
        transitions.nestio.forward();
    } else if ($(document).scrollTop() <= breaks.nestio.reverse && states.nestio.visible) {
        console.log("FIRING");
        transitions.nestio.reverse();
    }
};

var transitions = {
    music : {
        forward : function(){
            states.music.visible = true;
            $(".music-strip-hide").css("opacity", 1);
            $(".header-strip-hide").css("opacity", 0);
            $("#scroll-strip-music").css("background-color", _pink);
        },
        reverse : function(){
            states.music.visible = false;
            $(".music-strip-hide").css("opacity", 0);
            $(".header-strip-hide").css("opacity", 1);
            $("#scroll-strip-music").css("background-color", _lightBlue);
        },
    },
    nestio : {
        forward : function(){
            states.nestio.visible = true;
            $(".nestio-strip-hide").css("opacity", 1);
            $("#scroll-strip-nestio").css("background-color", _gold);
            // $("#scroll-strip-music").css("height", "-=300");
        },
        reverse : function(){
            states.nestio.visible = false;
            $(".nestio-strip-hide").css("opacity", 0);
            $("#scroll-strip-nestio").css("background-color", _pink);
        },
    }
};

window.setInterval(function(){
    if (!states.music.visible){
        if (animationsEnabled){
            if (arrowOpacity == 0) {
                arrowOpacity = 1;
            } else {
                arrowOpacity = 0;
            };
        };
    } else {
        arrowOpacity = 0;
    };
    $(".arrow").css("opacity", arrowOpacity)
}, 2000);
