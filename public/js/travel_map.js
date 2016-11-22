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
                g.selectAll(".country")
                  .data(topojson.object(data, data.objects.countries).geometries)
                .enter().append("path")
                    .attr("class", "country")
                    .attr("d", path)
                    .attr("fill",function(d,i){return color[i%color.length];});
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
    .scale(300)
    .precision(1);

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
      name: "Atlantic",
      location: {
        latitude: 30.92669,
        longitude: -50.77892
      }
  },
  {
      name: "Atlantic2",
      location: {
        latitude: 10.92669,
        longitude: -50.77892
      }
  },
  {
      name: "Atlantic3",
      location: {
        latitude: -10.92669,
        longitude: -50.77892
      }
  }
]

g.selectAll(".point")
   .data(places)
   .enter()
       .append('path')
           .attr('class', 'point')
           .attr('fill', 'red')
           .datum(function(d) {
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
    svg.selectAll(".point").attr("d", path);
    svg.selectAll(".country").attr("d", path);
}

function dragended() {
  console.log("Done!")
}
