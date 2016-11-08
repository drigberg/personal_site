//
// var default_attraction = 200;
// var attraction = default_attraction;
// var mouseover = false;
// var slow_factor = 0.1;
// var max_line_distance = 175;
// var default_particle_width = 2;
// var planet_radius_range = [200, 2000];
// var particles = [];
// var planets = [];
// var particle_pool = [];
// var planet_pool = [];
// var GridNode_pool = [];
// var GridNodes = [];
// var G = 500;
// var terminal_velocity = 10;
//
// var signal_processing = Sketch.create({
//     container: document.getElementById( 'container' )
// });
//
// function Particle( x, y, radius ) {
//     this.init( x, y, radius );
// }
//
//
// Particle.prototype = {
//
//     init: function( x, y, radius ) {
//         this.x = x || 0;
//         this.y = y || 0;
//         this.radius = radius || 2;
//         this.red = 0;
//         this.green = 0;
//         this.blue = 100;
//         this.opacity = 0.4;
//     },
//
//     move: function() {
//         this.x += 1;
//         this.y += 1;
//     },
//
//     draw: function( particle ) {
//         particle.beginPath();
//         particle.arc( this.x, this.y, this.radius, 0, TWO_PI );
//         particle.fillStyle = 'rgba(' + this.red.toString() + ', ' + this.green.toString() + ', ' + this.blue.toString() + ', ' + this.opacity.toString() + ')';
//         particle.fill();
//     }
// };
//
//
// signal_processing.setup = function() {
//     // Set off some initial particles.
//     var x = signal_processing.width / 2
//     var y = signal_processing.height / 2
//     signal_processing.spawn_particle( x, y );
// };
//
// signal_processing.spawn_particle = function( x, y ) {
//     var particle;
//     particle = particle_pool.length ? particle_pool.pop() : new Particle();
//     particle.init( x, y, default_particle_width);
//     particles.push( particle );
// };
//
// signal_processing.update = function() {
//   for ( i = particles.length - 1; i >= 0; i-- ) {
//       particles[i].move();
//   }
// };
//
// signal_processing.draw = function() {
//     for ( var i = particles.length - 1; i >= 0; i-- ) {
//         particles[i].draw( signal_processing );
//     }
// };

// Create an <audio> element dynamically.
var audio = new Audio();
audio.src = 'assets/17.mp3';
audio.controls = true;
audio.autoplay = true;
document.body.appendChild(audio);

var context = new AudioContext();
var analyser = context.createAnalyser();

// Wait for window.onload to fire. See crbug.com/112368
window.addEventListener('load', function(e) {
  // Our <audio> element will be the audio source.
  var source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);

  // ...call requestAnimationFrame() and render the analyser's output to canvas.
}, false);
