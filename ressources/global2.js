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


    // List of groups (here I have one group per column)
    var allGroup = ["casConfirmes", "deces", "hospitalises"]

    // Various changes to the data to make it clean
    allGroup.forEach(function(item,index){
        for (var i in data) {
            if (i == 1) {
                var old = data[i].item
            } else {
                if (data[i].item == null || data[i].item <= 0) {
                    data[i].item = old
                }
                var newd = data[i].item
                data[i].item = data[i].item - old
                var old = newd
            }
        }
        old = 0
        newd = 0
    });
    
    data = data.slice(7, 1000)
    console.log(data);

    // add the options to the button
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) {
            return d;
        }) // text showed in the menu
        .attr("value", function (d) {
            return d;
        }) // corresponding value returned by the button

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
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, (d3.max(data, function (d) {
            return +d.casConfirmes;
        }))])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the line
    var line = svg
        .append('g')
        .append("path")
        .datum(data)
        .attr("d", d3.line()
            .x(function (d) {
                return x(+d.date)
            })
            .y(function (d) {
                return y(+d.casConfirmes)
            })
        )
        .attr("stroke", function (d) {
            return myColor("valueA")
        })
        .style("stroke-width", 4)
        .style("fill", "none")

    // A function that update the chart
    function update(selectedGroup) {
        // Create new data with the selection?
        var dataFilter = data.map(function (d) {
            return {
                date: d.date,
                value: d[selectedGroup]
            }
        })

        // Give these new data to update line
        line
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function (d) {
                    return x(+d.date)
                })
                .y(function (d) {
                    return y(+d.value)
                })
            )
            .attr("stroke", function (d) {
                return myColor(selectedGroup)
            })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function (d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })
})