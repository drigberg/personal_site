(function () {
  /**
   * Setup
   */
  const width = 680;
  const height = 680;

  const projection = d3.geo
    .orthographic()
    .scale(270)
    .translate([width / 2, height / 2])
    .clipAngle(90)
    .precision(0.5);

  const zoom = d3.behavior.zoom().scaleExtent([1, 6]).on("zoom", zoomed);

  const zoomEnhanced = d3.geo
    .zoom()
    .projection(projection)
    .on("zoom", zoomedEnhanced);

  const drag = d3.behavior
    .drag()
    .origin(function () {
      const r = projection.rotate();
      return { x: r[0], y: -r[1] };
    })
    .on("drag", dragged)
    .on("dragstart", dragstarted)
    .on("dragend", dragended);

  const path = d3.geo.path().projection(projection);

  const graticule = d3.geo.graticule();

  const svg = d3
    .select("#globe")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const pathG = svg.append("g");

  /**
   * Interactivity
   */

  // apply transformations to map and all elements on it
  function zoomed() {
    pathG.attr(
      "transform",
      "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"
    );
    //grids.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    //geofeatures.select("path.graticule").style("stroke-width", 0.5 / d3.event.scale);
    pathG
      .selectAll("path.boundary")
      .style("stroke-width", 0.5 / d3.event.scale);
  }

  function zoomedEnhanced() {
    pathG.selectAll("path").attr("d", path);
  }

  function dragstarted(d) {
    //stopPropagation prevents dragging to "bubble up" which triggers same event for all elements below this object
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
  }

  function dragged() {
    projection.rotate([d3.event.x, -d3.event.y]);
    pathG.selectAll("path").attr("d", path);
  }

  function dragended(d) {
    d3.select(this).classed("dragging", false);
  }

  d3.select(self.frameElement).style("height", height + "px");


  /**
   * Data handling: globe
   */
  function drawGlobe() {
    svg
      .append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .call(zoomEnhanced);

    pathG
      .append("defs")
      .append("path")
      .datum({ type: "Sphere" })
      .attr("id", "sphere")
      .attr("d", path);

    pathG.append("use").attr("class", "stroke").attr("xlink:href", "#sphere");
    pathG.append("use").attr("class", "fill").attr("xlink:href", "#sphere");
    pathG
      .append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);
  }

  function fetchWorldData() {
    return new Promise((resolve, reject) => {
      d3.json("public/assets/data/topo.json", function (error, world) {
        if (error) {
          reject(error);
        } else {
          resolve(world);
        }
      });
    });
  }

  function drawLand(world) {
    // to render meridians/graticules on top of lands, use insert which adds new path before graticule in the selection
    pathG
      .insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

    pathG
      .insert("path", ".graticule")
      .datum(
        topojson.mesh(world, world.objects.countries, function (a, b) {
          return a !== b;
        })
      )
      .attr("class", "boundary")
      .attr("d", path);
  }

  /**
   * Data handling: trips
   */

  function drawTrips(trips, citiesMapping) {
    for (const trip of trips) {
      pathG.append("path")
        .data([{
          type: "LineString",
          coordinates: trip.locations.map(
            location => citiesMapping[location.city])
        }])
        .attr("d", path)
        .style({ 'fill': 'none' })
        .style({ 'stroke-width': 2, 'stroke': trip.color, 'stroke-linejoin': 'round' });
    }
  }

  function fetchTripData() {
    return fetch("/public/assets/data/trips.json")
      .then(res => res.json());
  }

  function fetchCitiesData() {
    return fetch("/public/assets/data/cities.json")
      .then(res => res.json());
  }

  /**
   * Main
   */
  Promise.all([fetchWorldData(), fetchTripData(), fetchCitiesData()])
    .then(([world, tripData, citiesData]) => {
      drawGlobe();
      drawLand(world);
      drawTrips(tripData, citiesData)
    });
})()
