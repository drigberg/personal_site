//Travel log loading
var TravelMapAPI = function(){
    var that = this;
    this.loadTravelLog = function(){
        $.ajax({
            url: "/json/travel_log.json",
            dataType: "json",
            success: function(data) {
                that.travelLog = data;
            },
            failure: function() {
                console.log("Failed to load travel log");
            }
        });
    };
    this.loadWorldTopo = function(){
        $.ajax({
            url: "/json/world_topo.json",
            dataType: "json",
            success: function(data) {
                topology = data;
                g.selectAll("path")
                  .data(topojson.object(topology, topology.objects.countries)
                      .geometries)
                .enter()
                  .append("path")
                  .attr("d", path)
                  .attr("fill",function(d,i){return color[i%color.length];})
            },
            failure: function() {
                console.log("Failed to load world topology");
            }
        });
    };
}

travelMapAPI = new TravelMapAPI()
travelMapAPI.loadWorldTopo()

//projection setup
var width = window.innerWidth,
    height = window.innerHeight;

var projection = d3.geoOrthographic()
    .center([-55, 30])
    .scale(300);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geoPath()
    .projection(projection);


// group the svg layers
var g = svg.append("g");
var color = ["#F5A71D", "#2FB1C0", "#B1D236", "#30AA6A", "#7a33ee", "#00d0ff"];

// Plotting points
var places = [
  {
    name: "Mediterranean",
    location: {
      latitude: 40.42507,
      longitude: 4.89315
    }
  },
  {
    name: "Newcastle, Australia",
    location: {
      latitude: -32.92669,
      longitude: 151.77892
    }
  }
]

g.selectAll("point")
   .data(places)
   .enter()
       .append('path')
       .attr('class', 'point')
       .attr('fill', 'red')
       .datum(function(d) {
          console.log(d)
          return {type: 'Point', coordinates: [d.location.longitude, d.location.latitude], radius: 30};
       })
       .attr('d', path);


//dragging

svg.call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

function scaleDown(a){
    return a/50;
}

var startPoint;
var change;
var endPoint
function dragstarted() {
    var current = projection.rotate()
    startPoint = [current[0], current[1]]
    endPoint = [d3.event.x, d3.event.y]
    console.log(startPoint)
}

function dragged() {
    var current = projection.rotate()
    startPoint = endPoint;
    endPoint = [d3.event.x, d3.event.y]
    projection.rotate([current[0] + (endPoint[0] - startPoint[0]), current[1] - (endPoint[1] - startPoint[1])]);
    svg.selectAll("path").attr("d", path);
    // svg.selectAll("point").attr("d", path);
}

function dragended() {
  console.log("Done!")
}











//
// var transform = d3.zoomIdentity;
//
// var zoom = d3.zoom()
//     .on("zoom",function() {
//         console.log(d3.event)
//         g.attr("transform","translate("+
//             d3.event.transform.join(",")+")scale("+d3.event.scale+")");
//         g.selectAll("circle")
//             .attr("d", path.projection(projection));
//         g.selectAll("path")
//             .attr("d", path.projection(projection));
//
//   });
//
// svg.call(zoom)



// // *****zoom and pan functionality
// var zoom = d3.zoom()
//     .on("zoom", zoomed);
//
//
// svg.call(d3.zoom()
//     .scaleExtent([1 / 2, 1])
//     .on("zoom", zoomed));
//
// function zoomed() {
//   g.attr("transform", d3.event.transform)
// }
//
// svg.call(zoom.transform, d3.zoomIdentity);
// var zoom = d3.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
//
//
// svg.call(d3.zoom().on("zoom", function() {
//           g.attr("transform","translate("+
//               d3.event.translate.join(",")+")scale("+d3.event.scale+")");
//           g.selectAll("path")
//           // g.selectAll("path")._groups[0][0]
//               .attr("d", path.projection(projection));
//     }))
//
//
// svg.call(zoom)

// // ******Plotting circles that don't rotate
// aa = [-122.490402, 37.786453];
// bb = [0.389809, 40.72728];
// g.selectAll("circle")
//     .data([aa,bb]).enter()
//     .append("circle")
//         .attr("cx", function (d) { console.log(projection(d)); return projection(d)[0]; })
//         .attr("cy", function (d) { return projection(d)[1]; })
//         .attr("r", "2px")
//         .attr("fill", "black")
//
// // ****constant rotation
// d3.timer(function() {
//   var dt = Date.now() - time;
//   projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);
//   // console.log([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);
//   svg.selectAll("path").attr("d", path);
// });
//
// var rotate = [10, -10],
    // velocity = [.003, -.001],
    // time = Date.now();
//



//
// //****Click and mouseover zooming---add to original chain
//           .on("click", clicked)
//   .on("mouseover", function(d) {
//       var x, y, k, tx, ty;
//       x = width / 2,
//       y = height / 2,
//       k = 1.1;
//       tx = -x * (k - 1);
//       ty = -y * (k - 1);
//       d3.select(this).transition().duration(500)
//         .attr("transform", "translate(" + tx + "," + ty + ") scale(" + k + ")");
//     })
//   .on("mouseleave", function(d) {
//     var x, y, k;
//     var x = width / 2,
//     y = height / 2,
//     k = 1;
//     var tx = -x * (k - 1),
//         ty = -y * (k - 1);
//     d3.select(this).transition().duration(500)
//       .attr("transform", "translate(" + tx + "," + ty + ") scale(" + k + ")");
// });
//
//
// //****click functionality
// // var centered;
// function clicked(d) {
//
//
//     if (d && centered !== d) {
//
//         centered = d;
//         console.log(x)
//         console.log(y)
//         console.log(tx)
//         console.log(ty)
//
//     } else {
//         x = width / 2;
//         y = height / 2;
//         k = 1;
//         centered = null;
//     }
//
//     g.selectAll("path")
//         .classed("active", centered && function(d) { return d === centered; });
//
//     g.selectAll(".active").transition()
//         .duration(1000)
//         .attr("transform", "translate(" + tx + "," + ty + ") scale(" + k + ")")
//         .style("stroke-width", 1.5 / k + "px");
// }
