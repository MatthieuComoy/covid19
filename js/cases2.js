$.getJSON('https://coronavirusapi-france.now.sh/AllDataByDepartement?Departement=France', function (json) {

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
      var value = data[i].casConfirmes
    } else {
      var nvalue = data[i].casConfirmes
      data[i].casConfirmes = data[i].casConfirmes - value
      var value = nvalue
    }
  }
  var data_long = data.slice(-30)
  var data_short = data.slice(-7)

  // set the dimensions and margins of the graph
  var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  // parse the date / time
  var parseTime = d3.timeParse("%Y-%m-%d"),
    formatDate = d3.timeFormat("%m/%d"),
    bisectDate = d3.bisector(function (d) {
      return d.date;
    }).left;

  // append the svg object to the body of the page
  var svg = d3.select("#cases")
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
      return +d.casConfirmes;
    })])
    .range([height, 0]);



  // A function that update the chart
  function update_cas(data) {

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
        return +d.casConfirmes;
      })])
      .range([height, 0]);
    //vg.append("g")
    //  .call(d3.axisLeft(y));

    var u = svg.selectAll(".lineTest")
      .data([data], function (d) {
        return d.ser1
      });
    var color = '#b66d00'


    // add the area
    u
      .enter()
      .append("path")
      .data([data])
      .attr("class", "linetest")
      .merge(u)
      .transition()
      .duration(500)
      .attr("stroke-width", 1.5)
      .style("fill", color)
      .attr("d", d3.area()
      .x(function (d) {
        return x(d.date);
      })
      .y0(height)
      .y1(function (d) {
        return y(d.casConfirmes);
      })
    )

    ///////////////////////////////////////TOOLTIP//////////////////////////////////////////
    var focus = svg.append("g")
      .style("display", "none");

    // append the circle at the intersection 
    focus.append("circle")
      .attr("class", "y")
      .style("fill", "black")
      .style("stroke", "black")
      .attr("r", 4);

    // append rectangle pour le style
    focus.append("rect")
      .attr("class", "tooltip")
      .attr("width", 100)
      .attr("height", 50)
      .attr("x", 0)
      .attr("y", -22)
      .attr("rx", 4)
      .attr("ry", 4);

    // place the value at the intersection
    focus.append("text")
      .attr("class", "tooltip-date")
      .attr("dx", 8)
      .attr("dy", "-.3em");

    // place the date at the intersection
    focus.append("text")
      .attr("class", "tooltip-cas")
      .attr("dx", 8)
      .attr("dy", "1em");

    // append the rectangle to capture mouse
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function () {
        focus.style("display", null);
      })
      .on("mouseout", function () {
        focus.style("display", "none");
      })
      .on("mousemove", mousemove);

    function mousemove() {
      var x0 = x.invert(d3.pointer(event, this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;

      focus.select("circle.y")
        .attr("transform",
          "translate(" + x(d.date) + "," +
          y(d.casConfirmes) + ")");

      focus.select("text.tooltip-date")
        .attr("transform",
          "translate(" + x(d.date) + "," +
          y(d.casConfirmes) + ")")
        .text("Cas : " + d.casConfirmes);

      focus.select("text.tooltip-cas")
        .attr("transform",
          "translate(" + x(d.date) + "," +
          y(d.casConfirmes) + ")")
        .text(formatDate(d.date));

      focus.select("rect.tooltip")
        .attr("transform",
          "translate(" + x(d.date) + "," +
          y(d.casConfirmes) + ")")
    }
  }

  update_cas(data_long)

  document.getElementById("sema").onclick = function () {
    update_cas(data_short);
  }
  document.getElementById("mois").onclick = function () {
    update_cas(data_long);
  }

  $("#days-select").on('change', function () {
    var day = $(this).children(':selected').data('params')
    alert(day);
  });
})