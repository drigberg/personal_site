//----------global defaults
var backgroundColor, speed, numConstellations;
var swarms;
var numSwarms;
var bugSize;

//=========================
//Setup & draw functions
//=========================
function setup() {
    makeCanvas();
    resetSwarms();
    setInitialValues();
}

function makeCanvas(){
    var canvas = createCanvas(($(window).width()), $(window).height() + 50);
    canvas.parent('canvas-background');
    backgroundColor = "rgba(0, 0, 0, 0)";
    bugSize = 6;
};

function setInitialValues(){
    emptyVector = [0,0];
};

function resetSwarms(){
    numSwarms = 20;
    swarms = new Array(numSwarms);
    for (var i = 0; i < swarms.length; i++) {
        swarms[i] = new Swarm(random(0, width), random(0, height), random(0, width), random(0, height));
    };
};

function draw() {
    //move all bugs
    clear();
    background(backgroundColor);
    noStroke();
    for (var i = 0; i < swarms.length; i++) {
        var newDest = random(0,1);
        if (newDest > 0.999) {
            console.log("HEYO!");
            swarms[i].destination = {
                x : random(0, width),
                y : random(0, height)
            };
        };
        fill(swarms[i].r, swarms[i].g, swarms[i].b);
        for (var j = 0; j < swarms[i].bugs.length; j++) {
            swarms[i].bugs[j].update();
        };
    };
};


//=========================
//Classes
//=========================
var Swarm = function(spawnX, spawnY, destX, destY){
  //collection of stars and lines which connect them, or single star
  this.destination = {
      x : destX,
      y : destY
  };
  this.bugs = [];
  this.r = 0;
  this.g = 0;
  this.b = 0;
  this.spawnX = spawnX;
  this.spawnY = spawnY;
  this.numBugs = random(10, 60);
  this.init = function(){
      for (var i = 0; i < this.numBugs; i++) {
          this.bugs.push(new Bug(this, this.spawnX, this.spawnY, bugSize));
      };
  };
  this.init();
};

var Bug = function(parentSwarm, x, y, r){
    //set of coordinates, radius, and color
    var that = this;
    this.spread = random(30, 150)
    this.parentSwarm = parentSwarm;
    this.x = x + random(-1 * this.spread, this.spread);
    this.y = y + random(-1 * this.spread, this.spread);
    this.radius = r;
    this.turningSpeed = 0;
    this.vector = {
        unitVector : {
            x : 0,
            y : -1
        },
        magnitude : 4
    };

    this.acceleration = {
        magnitude   : 0,
        angular     : 0
    };


    this.accelerate = function(){
        var unitVectorToDest = findUnitVector(this.x, this.y, this.parentSwarm.destination.x, this.parentSwarm.destination.y);
        var currentUnitVector = findUnitVector(0, 0, this.vector.unitVector.x, this.vector.unitVector.y)
        var destAngleFromOrigin = findAngleFromOrigin(unitVectorToDest);
        var currentAngleFromOrigin = findAngleFromOrigin(currentUnitVector);
        var angle = findAngle(unitVectorToDest, currentUnitVector);

        if (unitVectorToDest.y * currentUnitVector.y > 0 ) {
            if (destAngleFromOrigin > currentAngleFromOrigin) {
                angle = angle;
            } else {
                angle *= -1;
            };
        }  else {
            if (unitVectorToDest.x * currentUnitVector.x > 0) {
                if (abs(destAngleFromOrigin) + abs(currentAngleFromOrigin) == angle) {
                    if (unitVectorToDest.y > 0) {
                        angle = angle;
                    } else {
                        angle *= -1;
                    };
                } else {
                    if (unitVectorToDest.y > 0) {
                        angle *= -1;
                    } else {
                        angle = angle;
                    };
                };
            };
        };


        // if (abs(angle) > PI/6) {
        //     that.acceleration.angular -= angle * 0.001;
        // } else if (abs(angle) > PI/10){
        //     that.acceleration.angular += angle * 0.001;
        // } else {
        //     that.acceleration.angular += angle * 0.001;
        // }

        that.acceleration.angular += angle * 0.001;



        if (that.acceleration.angular > 0.005) {
            that.acceleration.angular = 0.005;
        } else if (that.acceleration.angular < -0.005) {
            that.acceleration.angular = -0.005;
        };

        that.turningSpeed += that.acceleration.angular;

        if (that.turningSpeed > 0.05) {
            that.turningSpeed = 0.05;
        } else if (that.turningSpeed < -0.05) {
            that.turningSpeed = -0.05;
        };

        if (currentAngleFromOrigin < 0){
            currentAngleFromOrigin += TWO_PI;
        };

        newAngle = currentAngleFromOrigin + that.turningSpeed

        newVector = findUnitVector(0, 0, cos(newAngle), sin(newAngle))

        that.vector.unitVector.x = newVector.x;
        that.vector.unitVector.y = newVector.y;
    };

    this.accelerate();

    this.update = function(){
        this.accelerate();
        this.x += this.vector.unitVector.x * this.vector.magnitude;
        this.y += this.vector.unitVector.y * this.vector.magnitude;
        ellipse(this.x, this.y, this.radius, this.radius);
    };
};

var Vector = function(x, y, magnitude) {
    this.x = x;
    this.y = y;
    this.magnitude = magnitude;
};


//=========================
//Generation functions
//=========================

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

function dotProduct(vector1, vector2){
    var dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    return dotProduct;
};
