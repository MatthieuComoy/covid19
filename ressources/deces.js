$.getJSON('https://coronavirusapi-france.now.sh/AllDataByDepartement?Departement=France', function (json) {

  // List of groups (here I have one group per column)
  var days = ["30 jours", "7 jours"]

  // add the options to the button
  d3.select("#selectDeath")
    .selectAll('myOptions')
    .data(days)
    .enter()
    .append('option')
    .text(function (d) {
      return d;
    }) // text showed in the menu
    .attr("value", function (d) {
      return d;
    }) // corresponding value returned by the button

  //get and parse the data
  var myJson = json
  covid = myJson.allDataByDepartement
  console.log(covid);
  covid = covid.filter(function (d) {
    return d.sourceType === "ministere-sante"
  });
  covid = covid.filter(function (d) {
    return d.date != null;
  });
  data = covid;
  data.forEach(function (d) {
    d.date = d3.timeParse("%Y-%m-%d")(d.date);
  });

  // Opération pour avoir le différentiel de data
  for (var i in data) {
    if (i == 0) {
      var value = data[i].deces
    } else {
      var nvalue = data[i].deces
      data[i].deces = data[i].deces - value
      var value = nvalue
    }
  }
  data_1 = data.slice(-8, -1)
  data_2 = data.slice(-30, -1)
  console.log(data);

  // set the dimensions and margins of the graph
  var margin = {
    top: 10,
    right: 30,
    bottom: 0,
    left: 60
  }

  // append the svg object to the body of the page
  var svg = d3.select("#decesplot")
    .append("svg")
    .attr("viewBox", `0 0 600 400`)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  //Create Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 0)
    .style("text-anchor", "middle")
    .text("Les décès sur les sept derniers jours coulissants");

  // A function that update the chart
  function update(data) {

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
      .domain([0, d3.max(data, function (d) {
        return +d.deces;
      })])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    //check if positive or negative
    if (data[3].deces > data[6].deces) {
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
          return y(d.deces)
        })
      )
  }

  update(data_2)
  window.onload = function () {
    var btn1 = document.getElementById("but1");
    var btn2 = document.getElementById("but2");
    btn1.onclick = update(data_1);
    btn2.onclick = update(data_2);
  }
})