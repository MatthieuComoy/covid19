
$.getJSON('https://coronavirusapi-france.now.sh/AllLiveData', function(json) {
  //get and parse the data
  var myJson = json

  covid = myJson.allLiveFranceData

  covid = covid.sort((a, b) => d3.descending(a.deces, b.deces))
  covid = covid.slice(2, -1)
  console.log(covid);
  data = covid
  data = data.filter(function(d){ return d.code.startsWith("REG")})
  console.log(data);

// set the dimensions and margins of the graph
  var margin = {top: 30, right: 30, bottom: 70, left: 200},
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")

    .append("div")
    // Container class to make it responsive.
    .classed("svg-container", true)
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 600 400")
    // Class to make it responsive.
    .classed("svg-content-responsive", true)
    // Fill with a rectangle for visualization.*

// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.nom; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) {return d.deces;})])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.nom); })
    .attr("y", function(d) { return y(d.deces); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.deces); })
    .attr("fill", "#2f2f2f")
})
