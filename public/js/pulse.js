//----------global defaults
const backgroundColor = "rgba(0, 0, 0, 0)";
const nodeSize = 8;
const emptyVector = [0,0];
const rows = 7;
const columns = 10;
const forceConstant = 10;

//=========================
//Setup & draw functions
//=========================
function setup() {
    makeCanvas();
    makeGrid();
    respaceNodes();
}

function makeCanvas(){
    var canvas = createCanvas(($(window).width()), $(window).height());
    canvas.parent('canvas-background');
};

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
    respaceNodes();
}

function respaceNodes(){
    for (var col = 0; col < columns; col++){
        for (var row = 0; row < rows; row++){
            grid[col][row].x = $(window).width() / columns * col + $(window).width() / columns * 0.5;
            grid[col][row].y = $(window).height() / rows * row + $(window).height() / columns * 0.5;
        };
    };
};

function makeGrid(){
    grid = new Array(columns);
    for (var col = 0; col < columns; col++){
        grid[col] = new Array(columns);
        for (var row = 0; row < rows; row++){
            grid[col][row] = new Node(col, row)
        };
    };
};

function draw() {
    clear();
    background(backgroundColor);
    noStroke();
    fill('rgba(0, 0, 255, 0.5)');
    for (var col = 0; col < columns; col++){
        for (var row = 0; row < rows; row++){
            grid[col][row].update();
        };
    };
};


//=========================
//Classes
//=========================
var Node = function(row, column){
  this.row = row;
  this.column = column;
  this.radius = nodeSize;
  this.x = null;
  this.y = null;
  this.r = 0;
  this.g = 0;
  this.b = 0;
  this.a = 0.5;

  this.update = function() {
      ellipse(this.x, this.y, this.radius, this.radius);
  };

  this.accelerate = function() {

  };
};

function pulse(x, y) {
    for (var col = 0; col < columns; col++){
        for (var row = 0; row < rows; row++){
            node = grid[col][row];
            unitVector = findUnitVector(x, y, node.x, node.y);
            distance = findDistance(x, y, node.x, node.y);
            force = forceConstant / Math.pow(distance, 2);
            node.accelerationVector.x += unitVector.x * force;
            node.accelerationVector.y += unitVector.y * force;
        };
    };
};

function mouseClicked() {
    pulse(mouseX, mouseY);
};


//=========================
//Generation functions
//=========================

var Vector = function(x, y, magnitude) {
    this.x = x;
    this.y = y;
    this.magnitude = magnitude;
};

function findAngle(vector1, vector2) {
    //finds smaller angle between two vectors
    var angle = acos(dotProduct(vector1, vector2));
    return angle;
};

function findAngleFromOrigin(vector) {
    var originVector = new Vector(1, 0, 1);
    var angle = acos(dotProduct(vector, originVector));
    if (vector.y < 0) {
        angle *= -1
    };
    return angle;
};

function findUnitVector(x1, y1, x2, y2) {
    //calculates normal vector between two points (in order), converts to unit vector
    var normalVector = new Vector(x2 - x1, y2 - y1, null);
    var magnitude = sqrt((Math.pow(normalVector.x, 2)) + (Math.pow(normalVector.y, 2)));
    var unitVector = new Vector(normalVector.x / magnitude, normalVector.y / magnitude, 1);
    return unitVector;
};

function findDistance(x1, y1, x2, y2) {
    distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
};

function dotProduct(vector1, vector2){
    var dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    return dotProduct;
};
