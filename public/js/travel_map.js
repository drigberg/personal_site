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

var body = d3.select(".content");
// var div = body.append("div");
// div.html("Hello, world!");
// d3.select(".content")
//     .style("color", "black")
//     .style("background-color", "white")
//     .append("div")
//       .html("Hello, world!");
var data = [4, 8, 15, 16, 23, 42];
// var content = d3.select(".content");
// content.data(data)
//   .enter().append("div")
//     .style("width", function(d) { return d * 10 + "px"; })
//     .text(function(d) { return d; });

var x = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, 800]);

d3.select(".content")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return x(d) + "px"; })
    .style("background-color", "steelblue")
    .style("text-align", "right")
    .style("padding-right", "10px")
    .text(function(d) { return d; });
