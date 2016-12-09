var x;
var _purple = "rgb(139, 29, 249)";
var _white = "rgb(255, 255, 255)";
window.onload = function(){

}
window.onscroll = function(){
    if ($(document).scrollTop() >= 255){
        $("#scroll-strip-header").css("background-color", _purple);
        $("#profile-photo").css("opacity", "1");
    } else {
        $("#scroll-strip-header").css("background-color", _white);
        $("#profile-photo").css("opacity", "0");
    };
};
