// The new data variable.

$.getJSON('https://coronavirusapi-france.now.sh/AllLiveData', function(json) {
  var myJson = json
  parsedJSON = myJson.allLiveFranceData
  var filterArray = ["nom", "deces"]
  var covid = '[';
  for (var i = 0; i < parsedJSON.length; ++i) {
    x = true
    for (var filterItem in filterArray) {
      if (x) {
        covid += ('{"nom": "')
        covid += (parsedJSON[i][filterArray[filterItem]])
        covid += ('", ')
        x = false
      } else {
        covid += ('"deces": ')
        covid += (parsedJSON[i][filterArray[filterItem]])
        covid += ('},')
        x = true
      }
    }
  }

  var margin = {
      top: 50,
      right: 0,
      bottom: 100,
      left: 100
    },
    width = 1500 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(0);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>" + d.nom + " :</strong> <span style='color:red'>" + d.deces + "</span>";
    })

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);


  covid = covid.slice(0, -1)
  covid += ']'
  covid = JSON.parse(covid)
  covid = covid.sort((a, b) => d3.descending(a.deces, b.deces))
  covid = covid.slice(2, -1)
  console.log(covid);
  data = covid
  // The following code was contained in the callback function.
  x.domain(data.map(function(d) {
    return d.nom;
  }));
  y.domain([0, d3.max(data, function(d) {
    return d.deces;
  })]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("transform", "rotate(-65)");


  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Nombre de deces");

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) {
      return x(d.nom);
    })
    .attr("width", x.rangeBand())
    .attr("y", function(d) {
      return y(d.deces);
    })
    .attr("height", function(d) {
      return height - y(d.deces);
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  function type(d) {
    d.deces = +d.deces;
    return d;
  }

});
