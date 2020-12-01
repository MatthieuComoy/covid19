

// The svg
var svg = d3.select("#map"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var projection = d3.geoNaturalEarth()
    .scale(width / 1.3 / Math.PI)
    .translate([width / 2, height / 2])

// Load external data and boot
d3.json("\regions.geojson", function(data){
    data = data.features
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#fff")
})
