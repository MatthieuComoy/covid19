    // The svg
    var svg = d3.select("#map").append("svg"),
        width = 440,
        height = 300;

    // Map and projection
    var projection = d3.geoMercator()
        .center([2, 47])                // GPS of location to zoom on
        .scale(980)                       // This is like the zoom
        .translate([ width/2, height/2 ])

    // Load external data and boot

$.getJSON('https://france-geojson.gregoiredavid.fr/repo/regions.geojson', function(json) {
  var myJson = json
  // Filter data
  data.features = data.features.filter(function(d){console.log(d.properties.name) ; return d.properties.name=="France"})

  // Draw the map
  svg.append("g")
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
        .attr("fill", "grey")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
      .style("stroke", "none")

})
