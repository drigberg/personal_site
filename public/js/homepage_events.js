var x;
var _purple = "rgb(139, 29, 249)";
var _pink = "rgb(255, 11, 159)";
var _lightBlue = "rgb(31, 133, 255)";
var _white = "rgb(255, 255, 255)";
var _gold = "rgb(255, 181, 11)";
var music_scroll = false;
var music_visible = false;
var music_scroll_original_height = $("#scroll-down").height();
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
        scrolling : false
    },
    nestio : {
        visible : false
    }
};

window.onload = function(){

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
            if (!states.music.scrolling){
                if ($("#scroll-down").offset().left > 0) {
                    states.music.scrolling = true;
                    states.music.visible = true;
                    $(".music-strip-hide").css("opacity", 1);
                    $("#scroll-strip-music").css("background-color", _pink);
                    $("#scroll-down").animate({
                        left: '-150%',
                        height: "-=50"
                    }, 800, function(){
                        states.music.scrolling = false;
                    });
                };
            };
        },
        reverse : function(){
            if (!states.music.scrolling){
                states.music.scrolling = true;
                states.music.visible = false;
                $(".music-strip-hide").css("opacity", 0);
                $("#scroll-down").css("left", "150%");
                $("#scroll-strip-music").css("background-color", _lightBlue);
                $("#scroll-down").animate({
                    left: '10%',
                    height: music_scroll_original_height
                }, 800, function(){
                    states.music.scrolling = false;
                });
            };
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
