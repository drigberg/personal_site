var travelMapAPI = function(){
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
}

// canvas resolution
var width = 1000,
    height = 600;

// projection-settings for mercator
var projection = d3.geoMercator()
    // where to center the map in degrees
    .center([0, 50 ])
    // zoomlevel
    .scale(100)
    // map-rotation
    .rotate([0,0]);

// defines "svg" as data type and "make canvas" command
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// defines "path" as return of geographic features
var path = d3.geoPath()
    .projection(projection);

var color = ["#F5A71D", "#2FB1C0", "#B1D236", "#30AA6A", "#7a33ee", "#00d0ff"];

// group the svg layers
var g = svg.append("g");

// load data and display the map on the canvas with country geometries
d3.json("https://d3js.org/world-110m.v1.json", function(error, topology) {
    if (error) {
        console.log(error);
    } else {
        g.selectAll("path")
          .data(topojson.object(topology, topology.objects.countries)
              .geometries)
        .enter()
          .append("path")
          .attr("d", path)
          .attr("fill",function(d,i){return color[i%color.length];})
          .on("click", clicked);
    }
});

var centered;
function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.selectAll(".active").transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}


// zoom and pan functionality
var zoom = d3.zoom()
    .on("zoom", zoomed);

var transform = d3.zoomIdentity;

svg.call(d3.zoom()
    .scaleExtent([1 / 2, 8])
    .on("zoom", zoomed));

function zoomed() {
  g.attr("transform", d3.event.transform)
}

svg.call(zoom.transform, d3.zoomIdentity);

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
var zoom = d3.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
//
// svg.call(zoom)
