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
            var old_cas = data[i].casConfirmes
        } else {
            if (data[i].casConfirmes == null || data[i].casConfirmes <= 0) {
                data[i].casConfirmes = old_cas
            }
            var new_cas = data[i].casConfirmes
            data[i].casConfirmes = data[i].casConfirmes - old_cas
            var old_cas = new_cas
        }
    }

    for (var i in data) {
        if (i == 1) {
            var old_cas = data[i].deces
        } else {
            if (data[i].deces == null) {
                data[i].deces = old_cas
            } else if (data[i].deces < 0) {
                data[i].deces = 0
            }
            var new_cas = data[i].deces
            data[i].deces = data[i].deces - old_cas
            var old_cas = new_cas
        }
    }
    
    for (var i in data) {
        if (i == 1) {
            var old_cas = data[i].hospitalises
        } else {
            if (data[i].hospitalises == null || data[i].hospitalises <= 0) {
                data[i].hospitalises = old_cas
            }
            var new_cas = data[i].hospitalises
            data[i].hospitalises = data[i].hospitalises - old_cas
            var old_cas = new_cas
        }
    }
    
    data = data.slice(7, 1000)
    console.log(data);

    // List of groups (here I have one group per column)
    var allGroup = ["casConfirmes", "deces", "hospitalises"]


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
        .attr("class", "x-axis")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, (d3.max(data, function (d) {
            return +d.casConfirmes;
        }))])
        .range([height, 0]);
    svg.append("g")
        .attr("class", "y-axis")
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
            return myColor("casConfirmes")
        })
        .style("stroke-width", 2)
        .style("fill", "none")


    // A function that update the chart
    function update(selectedGroup) {

        //Update y axis
        var maxrange = 10000
        console.log(selectedGroup)
        if (selectedGroup == 'deces'){
            maxrange = 700
            minrange = 0
        } else if (selectedGroup == 'hospitalises') {
            maxrange = 4000
            minrange = -1000
        } else {
            maxrange = 90000
            minrange = 0
        }
        y.domain([minrange, maxrange]);
        svg.selectAll("g.y-axis")
            .transition().duration(1000)
            .call(d3.axisLeft(y));

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