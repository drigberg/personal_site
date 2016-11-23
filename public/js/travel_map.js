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
    this.loadWorldTopo = function(obj){
        $.ajax({
            url: "/json/world_topo.json",
            dataType: "json",
            success: function(data) {
                obj.g.selectAll(".country")
                    .data(topojson.object(data, data.objects.countries).geometries)
                .enter().append("path")
                    .attr("class", "country")
                    .attr("d", obj.path)
                    .attr("fill",function(d,i){return obj.colors[i%obj.colors.length];});
            },
            failure: function() {
                console.log("Failed to load world topology");
            }
        });
    };
}

var TravelMap = function(){
    var that = this;
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

    this.dragCall = function(){
        that.svg.call(d3.drag()
                  .on("start", this.dragstarted)
                  .on("drag", this.dragged));
    };

    this.startPoint = [];
    this.endPoint = [];
    this.dragstarted = function() {
        this.current = that.projection.rotate();
        that.startPoint = [this.current[0], this.current[1]];
        that.endPoint = [d3.event.x, d3.event.y];
    };

    this.dragged = function() {
        this.current = that.projection.rotate();
        that.startPoint = that.endPoint;
        that.endPoint = [d3.event.x, d3.event.y];
        that.projection.rotate([this.current[0] + (that.endPoint[0] - that.startPoint[0]), this.current[1] - (that.endPoint[1] - that.startPoint[1])]);
        that.svg.selectAll(".point").attr("d", that.path);
        that.svg.selectAll(".country").attr("d", that.path);
    };

};

travelMap = new TravelMap();
travelMapAPI = new TravelMapAPI();
travelMapAPI.loadWorldTopo(travelMap);
travelMap.dragCall();
