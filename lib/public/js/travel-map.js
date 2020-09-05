(function () {
  /**
   * SOURCES
   * drawing paths on globe: https://stackoverflow.com/questions/18165533/how-to-draw-a-line-link-between-two-points-on-a-d3-map-based-on-latitude-lon
   * animating paths: https://bl.ocks.org/basilesimon/f164aec5758d16d51d248e41af5428e4
   */

  /**
   * --------------------
   * Setup
   * --------------------
   */
  const routes = [];
  const width = 680;
  const height = 680;
  const center = [width / 2, height / 2];
  const projection = d3.geo
    .orthographic()
    .scale(270)
    .translate(center)
    .clipAngle(90)
    .precision(0.5);
  d3.select(self.frameElement).style("height", height + "px");

  const path = d3.geo.path().projection(projection);
  const graticule = d3.geo.graticule();

  const svg = d3
    .select("#globe")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const pathG = svg.append("g");

  /**
   * --------------------
   * Animation
   * --------------------
   */

  /**
   * Routes are drawn forwards when the globe is created and when it's dragged/zoomed
   */
  function animateRouteForwards(r) {
    r.interrupt();
    const totalLength = r.node().getTotalLength();
    r
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
      .ease("linear")
      .attr("stroke-dashoffset", 0);
  }

  /**
   * --------------------
   * Interactivity
   * --------------------
   */

  /**
   * Points need to be translated explicitly on drag/zoom
   */
  function handleDragCircle(d) {
    return "translate(" + projection([
      d.coordinates[0],
      d.coordinates[1]
    ]) + ")"
  }

  const zoom = d3.behavior.zoom()
    .scaleExtent([1, 6])
    .on("zoom", zoomed);

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
    for (const route of routes) {
      animateRouteForwards(route)
    }
    pathG.selectAll("circle")
      .attr("transform", handleDragCircle)
      .attr("opacity", handlePointBeyondHorizon)
  }

  function dragstarted(d) {
    //stopPropagation prevents dragging to "bubble up" which triggers same event for all elements below this object
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
  }

  function dragged() {
    projection.rotate([d3.event.x, -d3.event.y]);
    pathG.selectAll("path").attr("d", path);
    pathG.selectAll("circle")
      .attr("transform", handleDragCircle)
      .attr("opacity", handlePointBeyondHorizon)
  }

  function dragended(d) {
    d3.select(this).classed("dragging", false);
  }

  /**
   * Points on the other side of the globe should be hidden
   */
  function handlePointBeyondHorizon(d) {
    var geoangle = d3.geo.distance(
      d.coordinates,
      projection.invert(center));
    if (geoangle > Math.PI / 2) {
      return "0";
    } else {
      return "1.0";
    }
  }

  /**
   * --------------------
   * Data handling: globe
   * --------------------
   */

  function drawGlobe() {
    pathG
      .append("defs")
      .append("path")
      .datum({ type: "Sphere" })
      .attr("id", "sphere")
      .attr("d", path)
      .call(zoomEnhanced);

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
      .attr("d", path)
      .call(zoomEnhanced);


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
   * --------------------
   * Data handling: trips
   * --------------------
   */

  function fetchTripData() {
    return fetch("/public/assets/data/trips.json")
      .then(res => res.json());
  }

  function fetchCitiesData() {
    return fetch("/public/assets/data/cities.json")
      .then(res => res.json());
  }

  function getCityCoords(citiesMapping, cityName) {
    if (Object.keys(citiesMapping).includes(cityName)) {
      return citiesMapping[cityName];
    } else {
      console.error(`Cannot find ${cityName} in cities -- returning origin instead of failing`)
      return [0, 0]
    }
  }

  function drawTrips(trips, citiesMapping) {
    for (const trip of trips) {
      function onMouseOver() {
        const selected = pathG
          .selectAll(`.${trip.id}`)
          .style({ 'stroke-width': 5 })
      }

      function onMouseOut() {
        const selected = pathG
          .selectAll(`.${trip.id}`)
          .style({ 'stroke-width': 3 })
      }

      for (const location of trip.locations) {
        const coords = getCityCoords(citiesMapping, location.city)
        const point = pathG.append("circle")
          .data([{ type: "Point", coordinates: coords }])
          .attr("d", path)
          .attr("r", 5)
          .attr("transform", handleDragCircle)
          .attr("opacity", handlePointBeyondHorizon)
          .on("mouseover", onMouseOver)
          .on("mouseout", onMouseOut)
          .style("fill", trip.color)
      }

      const route = pathG.append("path")
        .data([{
          type: "LineString",
          coordinates: trip.locations.map(location => getCityCoords(citiesMapping, location.city))
        }])
        .attr("class", trip.id)
        .attr("d", path)
        .style({ 'fill': 'none' })
        .style({ 'stroke-width': 3, 'stroke': trip.color, 'stroke-linejoin': 'round' })
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut)
        .call(zoomEnhanced);
      animateRouteForwards(route);
      routes.push(route);
    }
  }

  /**
   * --------------------
   * Main
   * --------------------
   */
  Promise.all([fetchWorldData(), fetchTripData(), fetchCitiesData()])
    .then(([world, tripData, citiesData]) => {
      drawGlobe();
      drawLand(world);
      drawTrips(tripData, citiesData)
    });
})()
