$.getJSON('https://coronavirusapi-france.now.sh/AllDataByDepartement?Departement=France', function (json) {
  //get and parse the data
  var myJson = json
  covid = myJson.allDataByDepartement
  console.log(covid);
  covid = covid.filter(function (d) {
    return d.sourceType === "ministere-sante"
  });
  covid = covid.slice(-31)
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
  data = data.slice(1)
  console.log(data);

  // set the dimensions and margins of the graph
  var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }


  // append the svg object to the body of the page
  var svg = d3.select("#cases")
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("viewBox", `0 0 530 300`)

  //Create Title
  /*
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 0)
    .style("text-anchor", "middle")
    .text("Nouveaux cas sur les 30 derniers jours coulissants");*/

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
      return +d.casConfirmes;
    })])
    .range([height, 0]);
  /*
  svg.append("g")
    .call(d3.axisLeft(y));

  //check if positive or negative
  if (data[3].casConfirmes > data[6].casConfirmes) {
    var color = 'green'
  } else {
    var color = 'red'
  } */
  var color = '#b66d00'



  // define the area
  var area = d3.area()
    .x(function (d) {
      return x(d.date);
    })
    .y0(height)
    .y1(function (d) {
      return y(d.casConfirmes);
    });

  // add the area
  svg.append("path")
    .data([data])
    .attr("class", "area")
    .style("fill", '#b66d00')
    .attr("d", area)

    


})