$.getJSON('https://coronavirusapi-france.now.sh/AllDataByDepartement?Departement=France', function (json) {
  //get and parse the data
  var myJson = json
  covid = myJson.allDataByDepartement
  covid = covid.filter(function (d) {
    return d.sourceType === "ministere-sante"
  });
  covid = covid.filter(function (d) {
    return d.date !== ''
  });
  data = covid
  data.splice(304, 1);
  data.forEach(function (d) {
    d.date = d3.timeParse("%Y-%m-%d")(d.date);
  });
  console.log(data);

  // Opération pour avoir le différentiel de data
  for (var i in data) {
    if (i == 1) {
      var value = data[i].casConfirmes
    } else {
      if (data[i].casConfirmes == null || data[i].casConfirmes <= 0) {
        data[i].casConfirmes = value
      }
      var nvalue = data[i].casConfirmes
      data[i].casConfirmes = data[i].casConfirmes - value
      var value = nvalue
    }
  }
  data = data.slice(7, 1000)
  console.log(data);


  // List of groups (here I have one group per column)
  var allGroup = ["valueA", "valueB"]

  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
     .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // A color scale: one color for each group
  var myColor = d3.scaleOrdinal()
  .domain(allGroup)
  .range(d3.schemeSet2);

  // set the dimensions and margins of the graph
  var margin = {
    top: 10,
    right: 30,
    bottom: 30,
    left: 60
  }

  // append the svg object to the body of the page
  var svg = d3.select("#global")
    .append("svg")
    .attr("viewBox", `0 0 650 400`)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  //Create Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 0)
    .style("text-anchor", "middle")
    .text("Global data");

  // Add X axis --> it is a date format
  var x = d3.scaleTime()
    .domain(d3.extent(data, function (d) {
      return d.date;
    }))
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(7));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, (d3.max(data, function (d) {
      return +d.casConfirmes;
    }))])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  //check if positive or negative
  if (data[3].casConfirmes > data[6].casConfirmes) {
    var color = 'green'
  } else {
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
      .x(function (d) {
        return x(d.date)
      })
      .y(function (d) {
        return y(d.casConfirmes)
      })
    )
})