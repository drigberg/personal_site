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
                    .attr("d", this.path)
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

var TravelMap = function(){
    //projection setup
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.projection = d3.geoOrthographic()
        .center([-55, 30])
        .scale(300)
        .precision(1);

    this.svg = d3.select("body").append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

    this.path = d3.geoPath()
        .projection(this.projection);


    // group the svg layers
    this.g = this.svg.append("g");
    this.colors = ["#F5A71D", "#2FB1C0", "#B1D236", "#30AA6A", "#7a33ee", "#00d0ff"];

    // Plotting points
    this.places = [
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

    this.g.selectAll(".point")
       .data(this.places)
       .enter()
           .append('path')
               .attr('class', 'point')
               .attr('fill', 'red')
               .datum(function(d) {
                  return {type: 'Point', coordinates: [d.location.longitude, d.location.latitude], radius: 30};
               })
               .attr('d', this.path);


    //dragging

    this.svg.call(d3.drag()
              .on("start", this.dragstarted)
              .on("drag", this.dragged)
              .on("end", this.dragended));

    this.scaleDown = function(a){
        return a/50;
    }

    this.startPoint = [];
    this.endPoint = [];
    this.dragstarted = function() {
        this.current = projection.rotate()
        this.startPoint = [this.current[0], this.current[1]]
        this.endPoint = [d3.event.x, d3.event.y]
        console.log(this.startPoint)
    }

    this.dragged = function() {
        this.current = projection.rotate()
        this.startPoint = this.endPoint;
        this.endPoint = [d3.event.x, d3.event.y]
        projection.rotate([this.current[0] + (this.endPoint[0] - this.startPoint[0]), this.current[1] - (this.endPoint[1] - this.startPoint[1])]);
        svg.selectAll(".point").attr("d", this.path);
        svg.selectAll(".country").attr("d", this.path);
    }

    this.dragended = function() {
      console.log("Done!")
    }
}
