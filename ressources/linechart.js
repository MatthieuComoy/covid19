
$.getJSON('https://coronavirusapi-france.now.sh/AllDataByDepartement?Departement=France', function(json) {
//get and parse the data
  var myJson = json
  covid = myJson.allDataByDepartement
  console.log(covid);
  covid = covid.filter(function(d){ return d.sourceType === "ministere-sante"});
  covid = covid.slice(-9,-1)
  covid = covid.filter(function(d){ return d.date != null; });
  data = covid;
  data.forEach(function(d) {
    d.date = d3.timeParse("%Y-%m-%d")(d.date);
  });
  // Opération pour avoir le différentiel de data
  for (var i in data){
    if (i == 0){
      var value = data[i].deces
    }
    else{
      var nvalue = data[i].deces
      data[i].deces = data[i].deces - value
      var value = nvalue
    }
  }
  data = data.slice(1,8)
  console.log(data);

  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 0, left: 60}

  // append the svg object to the body of the page
  var svg = d3.select("#my_linechart")
    .append("svg")
      .attr("viewBox", `0 0 650 400`)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

   //Create Title
    svg.append("text")
    .attr("x", width / 2 )
    .attr("y", 0)
    .style("text-anchor", "middle")
    .text("Les décès sur les sept derniers jours coulissants");

   // Add X axis --> it is a date format
   var x = d3.scaleTime()
     .domain(d3.extent(data, function(d) { return d.date; }))
     .range([ 0, width]);
   svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x).ticks(7));

   // Add Y axis
   var y = d3.scaleLinear()
     .domain([0, d3.max(data, function(d) { return +d.deces; })])
     .range([ height, 0 ]);
   svg.append("g")
     .call(d3.axisLeft(y));

   //check if positive or negative
   if (data[3].deces > data[6].deces){
     var color = 'green'
   }
   else{
     var color = 'red'
   }

   // Add the line
   svg.append("path")
     .datum(data)
     .attr("fill", "none")
     .attr("stroke", color)
     .attr("stroke-width", 1.5)
     .attr("d", d3.svg.line()
       .interpolate("basis")
       .x(function(d) { return x(d.date) })
       .y(function(d) { return y(d.deces) })
    )


})
