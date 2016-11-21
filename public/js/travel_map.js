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

var color = ["#cc22cc", "#88ee11", "#22ee99", "#eeee22", "#1111ee", "#ee7799", "#11ee11"];

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
        .attr("fill",function(d,i){return color[i%color.length];});
    }
});

// zoom and pan functionality
var zoom = d3.zoom()
    .on("zoom", zoomed);

var transform = d3.zoomIdentity;

svg.call(d3.zoom()
    .scaleExtent([1 / 2, 8])
    .on("zoom", zoomed));

function zoomed() {
  g.attr("transform", d3.event.transform);
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
