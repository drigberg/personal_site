// ----------------------------------------
// Particle
// ----------------------------------------

function Particle( x, y, radius ) {
    this.init( x, y, radius );
}
var attraction = 100;
var mouseover = false;

Particle.prototype = {

    init: function( x, y, radius ) {

        this.alive = true;
        this.feedlineOpacity = 0;
        this.x = x || 0;
        this.y = y || 0;
        this.origin = [600, 350];
        this.r_x = (this.x - 600);
        this.r_y = (this.y - 250);
        this.r = sqrt((this.r_x * this.r_x) + (this.r_y * this.r_y));

        this.radius = radius || 2;
        this.wander = 0.15;
        this.xtheta = 0;
        this.ytheta = 0;

        this.drag = 3;
        this.red = 0;
        this.green = 0;
        this.blue = 100;
        this.opacity = 0.4;

        this.vx = 3 / this.r * (this.r_y);
        this.vy = 3 / this.r * (this.r_x);
    },

    move: function() {

        if (mouseover) {
            for ( i = 0, n = demo.touches.length; i < n; i++ ) {
                var touch = demo.touches[i];
                this.r_x = (this.x - touch.x);
                this.r_y = (this.y - touch.y);
            }
        } else {
            this.r_x = (this.x - this.origin[0]);
            this.r_y = (this.y - this.origin[1]);
        }
        // this.r_x = (this.x - this.origin[0]);
        // this.r_y = (this.y - this.origin[1]);
        this.r = sqrt((this.r_x * this.r_x) + (this.r_y * this.r_y));

        if (this.r < 30 ) this.r = 30;

        this.xtheta = (-(this.r_x / (this.r * this.r)) * attraction) * (1 / (abs(this.vx) + 1));
        this.ytheta = (-(this.r_y / (this.r * this.r)) * attraction) * (1 / (abs(this.vy) + 1));
        this.vx += this.xtheta;
        this.vy += this.ytheta;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x > demo.width - 1) {
            this.vx = this.vx * -0.7;
            this.xtheta = 0;
        } else if (this.x < 1){
            this.vx = this.vx * -0.7;
            this.xtheta = 0;
        };

        if (this.y > demo.height) {
            this.vy = this.vy * -0.7;
            this.ytheta = 0;
        } else if (this.y < 1){
            this.vy = this.vy * -0.7;
            this.ytheta = 0;
        };
    },

    draw: function( ctx ) {
        ctx.beginPath();
        ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
        ctx.fillStyle = 'rgba(' + this.red.toString() + ', ' + this.green.toString() + ', ' + this.blue.toString() + ', ' + this.opacity.toString() + ')';
        ctx.fill();
    }
};

// ----------------------------------------
// Example
// ----------------------------------------

var MAX_PARTICLES = 1000;
var COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];

var particles = [];
var pool = [];

var demo = Sketch.create({
    container: document.getElementById( 'container' )
});

demo.setup = function() {

    // Set off some initial particles.
    var i, x, y;

    for ( i = 0; i < 40; i++ ) {
        // x = ( random(demo.width));
        // y = ( random(demo.height));
        x = random(500,700);
        y = random(250,450);
        demo.spawn( x, y );
    }
};

demo.spawn = function( x, y ) {

    var particle, xtheta, ytheta, force;

    if ( particles.length >= MAX_PARTICLES )
        pool.push( particles.shift() );

    particle = pool.length ? pool.pop() : new Particle();
    particle.init( x, y, 2 );

    // particle.wander = random( 0.5, 2.0 );
    particle.wander = random( 0.5, 1.0 );
    xtheta = random( TWO_PI );
    ytheta = random( TWO_PI );
    particles.push( particle );
};

demo.update = function() {

    var i, particle;

    for ( i = particles.length - 1; i >= 0; i-- ) {

        particle = particles[i];

        if ( particle.alive ) particle.move();
        else pool.push( particles.splice( i, 1 )[0] );
    }

    var j, k, touch;

    for ( j = 0, n = demo.touches.length; j < n; j++ ) {
        touch = demo.touches[j];
        // demo.spawn( touch.x, touch.y );
        for ( k = particles.length - 1; k >= 0; k-- ) {
            if (sqrt((particles[k].x - touch.x) ** 2 + (particles[k].y - touch.y) ** 2) < 175) {
                if (particles[k].radius < 20) {
                    if (mouseover) {
                        particles[k].feedlineOpacity = 1 - (sqrt((particles[k].x - touch.x) ** 2 + (particles[k].y - touch.y) ** 2)) / 200;
                        particles[k].radius += 0.2;
                        if (particles[k].red < 250) {
                            particles[k].red += 10;
                        }
                        if (particles[k].blue > 100) {
                            particles[k].blue -= 10;
                        }
                        if (particles[k].opacity < 1) {
                            particles[k].opacity += 0.1
                        }
                    };
                };
            } else {
                particles[k].feedlineOpacity = 0;
                if (particles[k].radius > 2) {
                    particles[k].radius -= 0.2
                };
                if (particles[k].red > 10) {
                    particles[k].red -= 10;
                }
                if (particles[k].blue < 250) {
                    particles[k].blue += 10;
                }
                if (particles[k].opacity > 0.4) {
                    particles[k].opacity -= 0.1
                }
            };
        }
    }
};

demo.draw = function() {
    for ( var i = particles.length - 1; i >= 0; i-- ) {
        particles[i].draw( demo );
        if (particles[i].feedlineOpacity > 0) {
            var touch;
            if (mouseover) {
                for ( j = 0, n = demo.touches.length; j < n; j++ ) {
                        touch = demo.touches[j];
                        demo.beginPath();
                        demo.moveTo( particles[i].x, particles[i].y );
                        demo.lineTo( touch.x, touch.y );
                        demo.strokeStyle = 'rgba(' + particles[i].red.toString() + ', ' + particles[i].green.toString() + ', ' + particles[i].blue.toString() + ', ' + (particles[i].feedlineOpacity).toString() + ')';
                        demo.stroke();
                }
            }
        }
    }
};


demo.mousedown = function() {
    attraction = 400;
}

demo.mouseup = function() {
    attraction = 100;
}

demo.mouseover = function() {
    mouseover = true;
}

demo.mouseout = function() {
    mouseover = false;
}

// demo.keydown = function() {
//     if (this.keys.SPACE) {
//         attraction = 0;
//     };
// }
