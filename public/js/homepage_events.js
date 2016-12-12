var x;
var _purple = "rgb(139, 29, 249)";
var _lightBlue = "rgb(66, 226, 244)";
var _white = "rgb(255, 255, 255)";
var music_scroll = false;
var music_visible = false;
var music_scroll_original_height = $("#scroll-down").height();
var music_break_forward = 500;
var music_break_reverse = 150;

window.onload = function(){

}
window.onscroll = function(){
    if ($(document).scrollTop() >= music_break_forward){
        musicTransition();
    } else if ($(document).scrollTop() <= music_break_reverse && music_visible) {
        musicTransitionReverse();
    };
};



function musicTransition(){
    if (!music_scroll){
        if ($("#scroll-down").offset().left > 0) {
            console.log("MOVING OFF");
            music_scroll = true;
            music_visible = true;
            $(".music-strip-hide").css("opacity", 1);
            $("#scroll-strip-music").css("background-color", _lightBlue);
            $("#scroll-down").animate({
                left: '-150%',
                height: "-=50"
            }, 500, function(){
                console.log("DONE MOVING OFF")
                music_scroll = false;
            });
        };
    };
};

function musicTransitionReverse(){
    if (!music_scroll){
        if ($("#scroll-down").offset().left < 0) {
            console.log("MOVING BACK");
            music_scroll = true;
            music_visible = false;
            $(".music-strip-hide").css("opacity", 0);
            $("#scroll-down").css("left", "150%");
            $("#scroll-strip-music").css("background-color", _purple);
            $("#scroll-down").animate({
                left: '10%',
                height: music_scroll_original_height
            }, 500, function(){
                console.log("DONE MOVING BACK")
                music_scroll = false;
            });
        };
    };
};
