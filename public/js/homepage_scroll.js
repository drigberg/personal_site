//=========================
//Setup & draw functions
//=========================
var x, y;
function setup() {
 	makeCanvas();
}

function makeCanvas(){
    var canvas = createCanvas(($(window).width()), $(window).height());
    canvas.parent('canvas-background');
    backgroundColor = "rgba(0, 0, 0, 0)";
};


function draw() {
 	background(backgroundColor);

	// fill(100, 255, x);
	stroke(0, 0, 0);
	ellipse(800, 800, 100, 100);
};
