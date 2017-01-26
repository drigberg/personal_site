const constants = {
    bodySize : 60,
    speed : 250,
    maxSpeed : 10,
    thingProb : 0.01,
    ratios : {
        bicep : 0.8,
        forearm : 0.8,
        thigh : 1,
        calf : 1,
        torso : 1,
        hipHeight : 2,
        shoulderHeight : 3,
        neck : 0.5,
        head : 0.5,
    }
};

var things = [];


//=========================
//Setup & draw functions
//=========================
//
function setup() {
    makeCanvas();
    strokeWeight(constants.bodySize / 5);
    stroke(255);
    person = new Person(windowWidth / 2);
}

function makeCanvas(){
    var canvas = createCanvas(windowWidth, windowHeight + 50);
    canvas.parent('canvas-background');
};

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}


function draw() {
    background(0);
    flyingThings();
    person.update();
}

function flyingThings() {
    if (random(0, 1) < constants.thingProb) {
        things.push(new Thing());
    };

    for (var i = 0; i < things.length; i++) {
        if (things[i] != null) {
            things[i].update();
            if (!things[i].alive) {
                things[i] = null;
            };
        };
    };
};


//=========================
//Classes
//=========================

var Thing = function() {
    this.x = null;
    this.y = null;
    this.width = 0;
    this.height = 0;
    this.alive = true;
    this.direction = 0;
    this.speed = random(1.5, 10);
    this.image = null;

    this.update = function() {
        this.x += this.speed * this.direction;
        if (this.direction == 1) {
            if (this.x > windowWidth + 100) {
                this.alive = false;
            };
        } else {
            if (this.x < -100) {
                this.alive = false;
            };
        };
        if (this.image) {
            image(this.image, this.x, this.y);
        } else {
            ellipse(this.x, this.y, this.width, this.height);
        };
    };

    this.loadImage = function() {
        this.image = loadImage("../assets/photos/things/escape.png");
        this.width = this.image.width;
        this.height = this.image.height;
    };

    this.init = function() {
        this.loadImage();
        if (random(0, 1) < 0.5) {
            this.x = -100;
            this.direction = 1;
        } else {
            this.x = windowWidth + 100;
            this.direction = -1;
        };
        this.y = random(0, windowHeight - constants.bodySize * 3);
    };

    this.init();
};

var Person = function(x) {
    this.target = {x : null, y : null};
    this.legs = [];
    this.torso = null;
    this.arms = [];
    this.speed = 0;

    this.hip = {
        x : x,
        y : windowHeight - constants.bodySize * constants.ratios.hipHeight,
        angle : null
    };

    this.shoulder = {
        x : this.hip.x,
        y : this.hip.y - constants.bodySize * constants.ratios.torso,
        angle : null
    };

    this.footMovement = 0;


    this.init = function() {
        this.legs.push(new Leg(this, this.hip.x, this.hip.y));
        this.legs.push(new Leg(this, this.hip.x / 2, this.hip.y));
        this.arms.push(new Arm(this, this.shoulder.x / 2, this.shoulderHeight));
        this.arms.push(new Arm(this, this.shoulder.x / 2, this.shoulderHeight));
        this.torso = new Torso(this);
    };

    this.update = function() {
        this.chooseTarget();
        this.walk();
        this.drawTorso();
        this.reach();
    };

    this.drawTorso = function () {
        this.torso.draw();
    };

    this.chooseTarget = function() {
        let distanceToTarget = Infinity;
        let proposedTarget = null;
        for (var i = 0; i < things.length; i++) {
            if (things[i] != null) {
                let newDistance = findDistance(this.shoulder.x, this.shoulder.y, things[i].x + things[i].width / 2, things[i].y + things[i].height / 2);
                if (newDistance < distanceToTarget) {
                    distanceToTarget = newDistance;
                    proposedTarget = things[i];
                };
            };
        };

        if (proposedTarget) {
            this.target = proposedTarget;
        } else {
            this.target = {x : null, y: null};
        };
    };

    this.walk = function() {
        if (this.target.x != null) {
            if (abs(this.target.x - this.hip.x) > 1) {
                this.speed = (this.target.x - this.hip.x) / abs(this.target.x - this.hip.x) * (abs(this.target.x - this.hip.x) / constants.speed)
                if (abs(this.speed) > constants.maxSpeed) {
                    this.speed *= (abs(this.speed) / constants.maxSpeed);
                };
                this.hip.x += this.speed;
                this.shoulder.x = this.hip.x + 40 * this.speed;
            } else {
                this.speed = 0;
            }
        } else {
            this.speed *= 0.8;
        };


        if (this.speed) {
            this.footMovement += (PI / 20) * this.speed;
        } else {
            if (sin(this.footMovement) > 0.05){
                this.footMovement -= 0.1;
            } else {
                this.footMovement = 0;
            };
        }
        for (var i = 0; i < this.legs.length; i++) {
            this.legs[i].walk(i);
        };
    };

    this.reach = function() {
        for (var i = 0; i < this.arms.length; i++) {
            this.arms[i].reach(i);
        };
    };

    this.init();
};


var Torso = function(person) {
    this.person = person;
    this.draw = function() {
        line(this.person.hip.x, this.person.hip.y, this.person.shoulder.x, this.person.shoulder.y);
        line(this.person.shoulder.x, this.person.shoulder.y, this.person.shoulder.x, this.person.shoulder.y - constants.bodySize * constants.ratios.neck);
        ellipse(this.person.shoulder.x, this.person.shoulder.y - constants.bodySize * constants.ratios.neck, constants.bodySize * constants.ratios.head, constants.bodySize * constants.ratios.head);
    };
};

var Leg = function(person, hipX, hipY) {

    this.person = person;

    this.foot = {
        x : null,
        y : null,
        angle : null
    };

    this.segmentLengths = {
        thigh : constants.bodySize * constants.ratios.thigh,
        calf : constants.bodySize * constants.ratios.calf
    };

    this.walk = function(legNumber) {
        let destX = this.person.hip.x + (100 * sin(this.person.footMovement) * Math.pow(-1, legNumber));
        let dx = destX - this.foot.x;
        let destY = this.person.hip.y + constants.ratios.hipHeight * constants.bodySize;
        let dy = destY - this.foot.y;
        this.foot.angle = atan2(dy, dx);

        let tx = destX - cos(this.foot.angle) * this.segmentLengths.thigh;
        let ty = destY - sin(this.foot.angle) * this.segmentLengths.thigh;

        dx = tx - this.person.hip.x;
        dy = ty - this.person.hip.y;

        this.person.hip.angle = atan2(dy, dx);

        this.foot.x = this.person.hip.x + cos(this.person.hip.angle) * this.segmentLengths.calf;
        this.foot.y = this.person.hip.y + sin(this.person.hip.angle) * this.segmentLengths.calf;

        this.drawSegment(this.person.hip.x, this.person.hip.y, this.person.hip.angle, this.segmentLengths.thigh);
        this.drawSegment(this.foot.x, this.foot.y, this.foot.angle, this.segmentLengths.calf);
    };

    this.drawSegment = function(x, y, a, length) {
        push();
        translate(x, y);
        rotate(a);
        line(0, 0, length, 0);
        pop();
    };
};

var Arm = function(person, shoulderX, shoulderY) {

    this.person = person;

    this.hand = {
        x : null,
        y : null,
        angle : null
    };

    this.segmentLengths = {
        bicep : constants.bodySize * constants.ratios.bicep,
        forearm : constants.bodySize * constants.ratios.forearm
    };

    this.reach = function(armNumber) {
        let destX = this.person.target.x + armNumber * 100;
        let dx = destX - this.hand.x;
        let destY = this.person.target.y;
        let dy = destY - this.hand.y;
        this.hand.angle = atan2(dy, dx);

        let tx = destX - cos(this.hand.angle) * this.segmentLengths.bicep;
        let ty = destY - sin(this.hand.angle) * this.segmentLengths.bicep;

        dx = tx - this.person.shoulder.x;
        dy = ty - this.person.shoulder.y;

        this.person.shoulder.angle = atan2(dy, dx);
        this.hand.x = this.person.shoulder.x + cos(this.person.shoulder.angle) * this.segmentLengths.forearm;
        this.hand.y = this.person.shoulder.y + sin(this.person.shoulder.angle) * this.segmentLengths.forearm;
        this.drawSegment(this.person.shoulder.x, this.person.shoulder.y, this.person.shoulder.angle, this.segmentLengths.bicep);
        this.drawSegment(this.hand.x, this.hand.y, this.hand.angle, this.segmentLengths.forearm);
    };

    this.drawSegment = function(x, y, a, length) {
        push();
        translate(x, y);
        rotate(a);
        line(0, 0, length, 0);
        pop();
    };
};

function findDistance(x1, y1, x2, y2) {
    distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
};
