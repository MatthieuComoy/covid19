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
  data_2 = data.slice(-30)
  data_1 = data.slice(-7)
  console.log(data_1);
  console.log(data_2);

  // set the dimensions and margins of the graph
  var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  // append the svg object to the body of the page
  var svg = d3.select("#decesplot")
    .append("svg")
    .attr("viewBox", `0 0 530 300`)
    .append("g")
  // .attr("transform",
  //   "translate(" + margin.left + "," + margin.top + ")");
  /*
    //Create Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 0)
      .style("text-anchor", "middle")
      .text("Les décès sur les sept derniers jours coulissants");
  */


  // Init X
  var x = d3.scaleTime()
    .domain(d3.extent(data, function (d) {
      return d.date;
    }))
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(7));

  // Init Y
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) {
      return +d.deces;
    })])
    .range([height, 0]);

  // A function that update the chart
  function update(data) {

    // Add X axis --> it is a date format
    x = d3.scaleTime()
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
    //vg.append("g")
    //  .call(d3.axisLeft(y));

    var u = svg.selectAll(".lineTest")
      .data([data], function (d) {
        return d.ser1
      });
    var color = '#b60000'

    // Add the line
    u
      .enter()
      .append("path")
      .attr("class", "linetest")
      .merge(u)
      .transition()
      .duration(2000)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 1.5)
      .attr("d", d3.svg.line()
        //.interpolate("basis")
        .x(function (d) {
          return x(d.date)
        })
        .y(function (d) {
          return y(d.deces)
        })
      )
  }

  update(data_1)

  document.getElementById("but1").onclick = function () {
    update(data_1);
  }
  document.getElementById("but2").onclick = function () {
    update(data_2);
  }

  $("#days-select").on('change', function () {
    var day = $(this).children(':selected').data('params')
    alert(day);
  });
})