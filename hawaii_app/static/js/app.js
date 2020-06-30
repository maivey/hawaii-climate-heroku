var currentSelection = d3.select('#currentPage').text()
if (currentSelection === 'Dates and Precipitation Scores Per Day for the Last 12 Months') {
    d3.json('/api/v1.0/precipitation').then((data) => {
            console.log(typeof data)
            console.log(data)
            var test = Object.keys(data).map(function(key) {
                // console.log(key)
                // console.log(data[key])
                var precip = data[key]
                var precips = [];
                for (var i = 0; i<precip.length; i++) {
                    if (precip[i]!== null) {
                        precips.push(precip[i])
                    }
                // console.log('PRECIPS')
                // console.log(precips)
                }
                return [key, precips];
                // return [key, data[key]];
                });
            console.log(test)
            var myDates = [];
            var myPrecips = [];
            var tbody = d3.select("tbody");
            for (var i = 0; i<test.length; i++) {
                var row = tbody.append("tr");
                var cell = row.append("td");
                cell.text(test[i][0]);
                // myDates.push(test[i][0])
                // myPrecips.push(test[i][1])
                for (var j=0; j<test[i][1].length; j++) {
                    var cell = row.append("td");
                    cell.text(test[i][1][j]);
                    myDates.push(test[i][0])
                    myPrecips.push(test[i][1][j])
                }
            };
            console.log(myDates)
            console.log(myPrecips)
            console.log(myDates.length)
            console.log(myPrecips.length)
            tbody.selectAll('td').attr('style','font-size:20px');
            
            var trace_precips = {
                x : myDates,
                y : myPrecips
            }
            var layout_precips = {
                title : {text: "Last 12 Months Precipitation Data"},
                xaxis: {title : "Date"},
                yaxis: {title : "Precipitation Score"}
            }
            var data_precips = [trace_precips];
            Plotly.newPlot('precip_div', data_precips, layout_precips);

        }); //Ends d3.json('/api/v1.0/precipitation')
    }
else if (currentSelection === 'Stations in the Dataset') {
    d3.json('/api/v1.0/station_counts').then((data) => {
    console.log(typeof data)
    console.log(data.length)
    
    var stationCounts = [];
    var stationNames = [];
    var test = Object.keys(data).map(function(key) {
        stationCounts.push(data[key]);
        stationNames.push(key);
        return [key, data[key]];
        });
    stationCounts.sort(function(a,b) {
        return b-a;
    });
    console.log(stationCounts)
    
    sortedNames = [];
    for (var i=0; i<stationCounts.length; i++) {
        currentCount = stationCounts[i];
        for (var j=0; j<test.length; j++) {
            if (test[j][1]===currentCount) {
                sortedNames.push(test[j][0])
            }
        }
    };
    console.log(sortedNames)
    console.log(stationCounts)
    console.log(sortedNames[0])
    console.log(stationCounts[0])

    // var sortTest = Object.keys(test).sort(function(a,b){return test[a]-test[b]});
    // console.log(sortTest)
    var tbody = d3.select("tbody");
    for (var i = 0; i<sortedNames.length; i++) {
        var row = tbody.append("tr");
        var cell = row.append("td");
        cell.text(sortedNames[i]);
        var cell = row.append("td");
        cell.text(stationCounts[i]);
    };
    
    tbody.selectAll('td').attr('style','font-size:25px')
    var topStationText = "The most active station is <span style='color:whitesmoke'>"+sortedNames[0].toString() +"</span> with <span style='color:whitesmoke'>"+ stationCounts[0].toString()+" </span> counts"
    d3.select('#top_station').html(topStationText)
    // d3.select('#top_station').selectAll('p').append('p').text('hello')
    }); // ENDS d3.json('/api/v1.0/station_count')

    d3.json('/api/v1.0/top_station').then((data)=> {
        console.log(data)
        console.log(data[0])
        var topStationText = "For the most active station (<span style='color:whitesmoke'>" + data[0].toString() + "</span>) : ";
        var topStationLow = "Lowest temperature recorded: <span style='color:whitesmoke'>" + data[1].toString() +"<span>&#176;</span>F</span>"
        var topStationHigh = "Highest temperature recorded: <span style='color:whitesmoke'>" + data[2].toString()+"<span>&#176;</span>F</span>"
        var topStationAvg = "Average temperature recorded: <span style='color:whitesmoke'>" + data[3].toString()+"<span>&#176;</span>F </span>"
        // var topStationStats = topStationLow + topStationHigh + topStationAvg

        d3.select('#top_station_stats_header').html(topStationText)
        d3.select('#top_station_stats_1').html(topStationLow)
        d3.select('#top_station_stats_2').html(topStationHigh)
        d3.select('#top_station_stats_3').html(topStationAvg)
        // Highest temperature recorded: 85.0
        // Average temperature recorded: 71.66378066378067"
        // d3.select('#top_station').html()

    });// Ends d3.json('/api/v1.0/top_station')
    d3.json('/api/v1.0/top_station_tobs').then((data)=> {
        var topStation = d3.select('#top_station_stats_header').text().slice(29,40)
        myDates = [];
        myTemps = [];
        var test = Object.keys(data).map(function(key) {
            myTemps.push(data[key]);
            myDates.push(key);
            return [key, data[key]];
            });
        trace_top_tobs = {
            histfunc: "count",
            y: myDates,
            x: myTemps,
            marker: {
                color: "#3A80E2",
                 line: {
                  color:  "#1859B3", 
                  width: 1
          } 
             },
            type: "histogram",
            // x: myTemps,
            // type: 'histogram'
        }
        layout_top_tops = {
            title: {text: "Temperature Counts for Station "+ topStation.toString()},
            xaxis : {title: "Temperature (<span>&#176;</span>F)"},
            yaxis : {title: "Frequency Counts"}
        }
        data_top_tobs = [trace_top_tobs];
        Plotly.newPlot('hist_tobs',data_top_tobs, layout_top_tops)

    })

}
else if (currentSelection === 'Temperature Observations (TOBS) for the Last 12 Months') {
    d3.json('/api/v1.0/tobs').then((data) => {
    console.log(data)
    console.log(typeof data)
    tobs = [];
    tobsDates = [];
    tobsTemps = [];
    for (var i=0; i<data.length; i++) {
        if (i%2 === 0) {
        var current = data.slice(i,i+2);
        tobs.push(current);
        tobsDates.push(current[0]);
        tobsTemps.push(current[1]);
        }
    };
    var tbody = d3.select("tbody");
    tobs.forEach((d) => {
        var row = tbody.append("tr");
        var cell = row.append("td");
        cell.text(d[0]);
        var cell = row.append("td");
        cell.text(d[1]);

    });
    tbody.selectAll('td').attr('style','font-size:20px')
    console.log(tobs)
    tobs.forEach((d) => {
        d[1] = +(d[1])
    })
    console.log(tobs)
    var trace_tobs = {
        x: tobsDates,
        y: tobsTemps

    };
    var layout_tobs = {
        title : {text: "TOBS Per Day"},
        xaxis : {
        title: "Date"},
        yaxis : {
        title: "Temperature (<span>&#176;</span>F)"}
    }
    data_tobs = [trace_tobs]
    Plotly.newPlot('myDiv', data_tobs, layout_tobs)
    });
} else if (currentSelection.slice(14,20).trim() === 'since') {
    var startDate = d3.select('#currentPage').text().slice(20,).trim();
    console.log(startDate)
    var startPath = "/api/v1.0/" + startDate
    d3.json(startPath).then((data) => {
    console.log(data)
    var startDates = data.map(d => d[0][0])
    var tMINS = data.map(d => d[0][1])
    // var tAVGS = data.map(d => d[0][2])
    var tAVGS = data.map(d => +(Number.parseFloat(d[0][2]).toFixed(2)))

    var tMAXS = data.map(d => d[0][3])
    console.log(startDates)
    console.log(startDates.length)
    console.log(tMINS)
    console.log(tMINS.length)

    console.log(tAVGS)
    console.log(tAVGS.length)

    console.log(tMAXS)
    console.log(tMAXS.length)
    
    var maxMax = Math.max(...tMAXS)
    var minMin = Math.min(...tMINS)
    var avgAvg = tAVGS.reduce((a,b) => a + b, 0) / tAVGS.length;

    var minDates = [];
    var maxDates = [];
    for (var i = 0; i<tMINS.length; i++) {
        var current_min = data[i][0][1];
        var current_max = data[i][0][3];
        if (current_min === minMin) {
            var minDate = data[i][0][0]
            minDates.push(minDate)
        } 
        else if (current_max === maxMax) {
            var maxDate = data[i][0][0]
            maxDates.push(maxDate)
        }
    };
    console.log(minDates)
    console.log(maxDates)
    // var topStationLow = "Lowest temperature recorded: <span style='color:whitesmoke'>" + minMin.toString() +"</span> on <span style='color:whitesmoke'>" 
    if (minDates.length >1) {
        var lowestTemp = "Lowest temperature recorded: <span style='color:whitesmoke'>" + minMin.toString() +"<span>&#176;</span> F</span> on "
        for (var i=0; i<minDates.length; i++) {
            var current = minDates[i].toString();
            if (i===0) {
                lowestTemp = lowestTemp + "<span style='color:whitesmoke'>" + current.toString() +"</span>"
            } else {
                lowestTemp = lowestTemp + " and <span style='color:whitesmoke'>" + current.toString() +"</span>"
            }
        }
    } else {
        var lowestTemp = "Lowest temperature recorded: <span style='color:whitesmoke'>" + minMin.toString() +"<span>&#176;</span> F</span> on <span style='color:whitesmoke'>" + minDates[0].toString() +"</span>"
    }
    if (maxDates.length >1) {
        var highestTemp = "Highest temperature recorded: <span style='color:whitesmoke'>" + maxMax.toString() +"<span>&#176;</span> F</span> on "
        for (var i=0; i<maxDates.length; i++) {
            var current = maxDates[i].toString();
            if (i===0) {
                highestTemp = highestTemp + " <span style='color:whitesmoke'>" + current.toString() +"</span>"
            } else {
                highestTemp = highestTemp + " and <span style='color:whitesmoke'>" + current.toString() +"</span>"
            }
        }
    } else {
        var highestTemp = "Highest temperature recorded: <span style='color:whitesmoke'>" + maxMax.toString() +"<span>&#176;</span> F</span> on <span style='color:whitesmoke'>" + maxDates[0].toString() +"</span>"
    }
    var averageTemp = "Average temperature: <span style='color:whitesmoke'>" + Number.parseFloat(avgAvg).toFixed(2).toString() +"<span>&#176;</span> F</span>"


    d3.select('#min-temp').html(lowestTemp)
    d3.select('#max-temp').html(highestTemp)
    d3.select('#average-temp').html(averageTemp)
    // d3.select('#top_station_stats_3').html(topStationAvg)



    var tbody = d3.select("tbody");
    for (var i = 0; i<startDates.length; i++) {
        var row = tbody.append("tr");
        var cell = row.append("td");
        cell.text(startDates[i]);
        // var row = tbody.append("tr");
        var cell = row.append("td");
        cell.text(tMINS[i]);
        // var row = tbody.append("tr");
        var cell = row.append("td");
        cell.text(tAVGS[i]);
        // var row = tbody.append("tr");
        var cell = row.append("td");
        cell.text(tMAXS[i]);

    }
    traceNorms_min = {
        x: startDates,
        y: tMINS,
        name : 'Daily Minimum'
    };
    traceNorms_avg = {
        x: startDates,
        y: tAVGS,
        name : 'Daily Average'
    };
    traceNorms_max = {
        x: startDates,
        y: tMAXS,
        name : 'Daily Maximum'
    };
    var layoutNorms = {
        title : {text: "Temperature Normals Per Day"},
        xaxis : {
        title: "Date"},
        yaxis : {
        title: "Temperature  (<span>&#176;</span>F)"},
        showlegend: true,
    };
    dataNorms= [traceNorms_min, traceNorms_avg, traceNorms_max]
    Plotly.newPlot('normDiv', dataNorms, layoutNorms);

    }); //Ends d3.json(startPath)
} //Ends else if (d3.select('#currentPage').text().slice(0,13) === 'Daily Normals')
else if (currentSelection.slice(0,18) === 'Daily Normals from') {
    var startDate = d3.select('#currentPage').text().slice(19,30).trim();
    var endDate = d3.select('#currentPage').text().slice(33,).trim();
    var startEndPath = "/api/v1.0/" + startDate + '/' + endDate
    d3.json(startEndPath).then((data) => {
    // console.log(data)
    var startDates = data.map(d => d[0][0])
    var tMINS = data.map(d => d[0][1])
    // var tAVGS = data.map(d => d[0][2])
    var tAVGS = data.map(d => +(Number.parseFloat(d[0][2]).toFixed(2)))

    var tMAXS = data.map(d => d[0][3])
    // console.log(startDates)
    // console.log(startDates.length)
    // console.log(tMINS)
    // console.log(tMINS.length)

    // console.log(tAVGS)
    // console.log(tAVGS.length)

    // console.log(tMAXS)
    // console.log(tMAXS.length)

    var maxMax = Math.max(...tMAXS)
    var minMin = Math.min(...tMINS)
    var avgAvg = tAVGS.reduce((a,b) => a + b, 0) / tAVGS.length;

    var minDates = [];
    var maxDates = [];
    for (var i = 0; i<tMINS.length; i++) {
        var current_min = data[i][0][1];
        var current_max = data[i][0][3];
        if (current_min === minMin) {
            var minDate = data[i][0][0]
            minDates.push(minDate)
        } 
        else if (current_max === maxMax) {
            var maxDate = data[i][0][0]
            maxDates.push(maxDate)
        }
    };
    // console.log(minDates)
    // console.log(maxDates)
    // var topStationLow = "Lowest temperature recorded: <span style='color:whitesmoke'>" + minMin.toString() +"</span> on <span style='color:whitesmoke'>" 
    if (minDates.length >1) {
        var lowestTemp = "Lowest temperature recorded: <span style='color:whitesmoke'>" + minMin.toString() +"<span>&#176;</span> F</span> on "
        for (var i=0; i<minDates.length; i++) {
            var current = minDates[i].toString();
            if (i===0) {
                lowestTemp = lowestTemp + "<span style='color:whitesmoke'>" + current.toString() +"</span>"
            } else {
                lowestTemp = lowestTemp + " and <span style='color:whitesmoke'>" + current.toString() +"</span>"
            }
        }
    } else {
        var lowestTemp = "Lowest temperature recorded: <span style='color:whitesmoke'>" + minMin.toString() +"<span>&#176;</span> F</span> on <span style='color:whitesmoke'>" + minDates[0].toString() +"</span>"

    }
    if (maxDates.length >1) {
        var highestTemp = "Highest temperature recorded: <span style='color:whitesmoke'>" + maxMax.toString() +"<span>&#176;</span> F</span> on "
        for (var i=0; i<maxDates.length; i++) {
            var current = maxDates[i].toString();
            if (i===0) {
                highestTemp = highestTemp + " <span style='color:whitesmoke'>" + current.toString() +"</span>"
            } else {
                highestTemp = highestTemp + " and <span style='color:whitesmoke'>" + current.toString() +"</span>"
            }
        }
    } else {
        var highestTemp = "Highest temperature recorded: <span style='color:whitesmoke'>" + maxMax.toString() +"<span>&#176;</span> F</span> on <span style='color:whitesmoke'>" + maxDates[0].toString() +"</span>"
    }
    var averageTemp = "Average temperature: <span style='color:whitesmoke'>" + Number.parseFloat(avgAvg).toFixed(2).toString() +"<span>&#176;</span> F</span>"


    d3.select('#min-temp').html(lowestTemp)
    d3.select('#max-temp').html(highestTemp)
    d3.select('#average-temp').html(averageTemp)

    var tbody = d3.select("tbody");
    for (var i = 0; i<startDates.length; i++) {
        var row = tbody.append("tr");
        var cell = row.append("td");
        cell.text(startDates[i]);
        // var row = tbody.append("tr");
        var cell = row.append("td");
        cell.text(tMINS[i]);
        // var row = tbody.append("tr");
        var cell = row.append("td");
        cell.text(tAVGS[i]);
        // var row = tbody.append("tr");
        var cell = row.append("td");
        cell.text(tMAXS[i]);
    }
    traceNorms_min = {
        x: startDates,
        y: tMINS,
        name : 'Daily Minimum'
    };
    traceNorms_avg = {
        x: startDates,
        y: tAVGS,
        name : 'Daily Average'
    };
    traceNorms_max = {
        x: startDates,
        y: tMAXS,
        name : 'Daily Maximum'
    };
    var layoutNorms = {
        title : {text: "Temperature Normals Per Day"},
        xaxis : {
        title: "Date"},
        yaxis : {
        title: "Temperature (<span>&#176;</span>F)"},
        showlegend: true,
    };
    dataNorms= [traceNorms_min, traceNorms_avg, traceNorms_max]
    Plotly.newPlot('normDiv', dataNorms, layoutNorms);

    }); //Ends d3.json(startPath)

    /// ************** NEED TO ADD d3.select('#is2016').empty()
} else if ((currentSelection.slice(0,9) === 'YOUR TRIP') && (d3.select('#is2016').empty()===true)) {
    var startDate = d3.select('#currentPage').text().slice(18,29).trim();
    var endDate = d3.select('#currentPage').text().slice(32,).trim();
    // CHANGE TO DISPLAY CORRECT DATE
    var startDateText = startDate;
    var endDateText = endDate;
    if (Number.parseFloat(startDate.slice(0,4))>2018) {
        startDate = "2018"+ startDate.slice(4,)
    }
    if (Number.parseFloat(endDate.slice(0,4))>2018) {
        endDate = "2018"+ endDate.slice(4,)
    }


    // Temperature Normals for PAST YEAR ONLY
    var trip_norm_prev_year_Path = '/trip_norm_prev_year/'+ startDate + '/'+ endDate;
    // console.log(trip_norm_prev_year_Path)
    d3.json(trip_norm_prev_year_Path).then((data)=> {
        // console.log(data['Dates'])
        // console.log(data['Normals'][0][0])
        // console.log(typeof data)
        //the approximate temperatures for my trip to Hawaii
        var pastYearDateText = "Based on the previous year's data for the same dates, the approximate temperatures for your trip to Hawaii on <span style='color:whitesmoke'>" + startDateText + "</span> to <span style='color:whitesmoke'>" + endDateText + " </span> will be: <br>";
        d3.select('#past-year-dates').html(pastYearDateText)

        var lowestTemp = "Lowest:<br> <span style='color:whitesmoke'>" + data['Normals'][0][0].toString() +"<span>&#176;</span> F</span> <br>"
        d3.select('#past-year-norms-1').html(lowestTemp);

        var highestTemp = "Highest:<br> <span style='color:whitesmoke'>" + data['Normals'][0][2].toString() +"<span>&#176;</span> F</span> <br>"
        d3.select('#past-year-norms-2').html(highestTemp);

        var avgTemp = "Average:<br> <span style='color:whitesmoke'>" + Number.parseFloat(data['Normals'][0][1]).toFixed(2).toString() +"<span>&#176;</span> F</span>"
        d3.select('#past-year-norms-3').html(avgTemp);

        var pastYearTablePath = "/api/v1.0/" + data['Dates'][0] + "/" + data['Dates'][1];
        d3.json(pastYearTablePath).then((data) => {
            var startDates = data.map(d => d[0][0])
            var tMINS = data.map(d => d[0][1])
            var tAVGS = data.map(d => +(Number.parseFloat(d[0][2]).toFixed(2)))
            var tMAXS = data.map(d => d[0][3])
            // console.log(startDates)
            // console.log(startDates.length)
            // console.log(tMINS)
            // console.log(tMINS.length)

            // console.log(tAVGS)
            // console.log(tAVGS.length)

            // console.log(tMAXS)
            // console.log(tMAXS.length)
            

            var tbody1 = d3.select("tbody");
            for (var i = 0; i<startDates.length; i++) {
                var row = tbody1.append("tr");
                var cell = row.append("td");
                cell.text(startDates[i]);
                // console.log(startDates[i])
                // var row = tbody1.append("tr");
                var cell = row.append("td");
                cell.text(tMINS[i].toString());
                // var row = tbody.append("tr");
                var cell = row.append("td");
                cell.text(tAVGS[i].toString());
                // var row = tbody.append("tr");
                var cell = row.append("td");
                cell.text(tMAXS[i].toString());
            }
            tbody1.selectAll('td').attr('style','font-size:20px')

            // traces = [
            //     {x : startDates, y: tMINS, name : 'tMin', stackgroup:'one'},
            //     {x : startDates, y: tAVGS, name : 'tAvg', stackgroup:'one'},
            //     {x : startDates, y: tMAXS, name : 'tMax',stackgroup:'one'}
            // ]
            trace1 = {
                x: startDates.map((d,i)=> i+1),
                // x : startDates.map(d=> new Date(new Date(d).getFullYear(),new Date(d).getMonth(),new Date(d).getDate()+1 )),
                 y: tMAXS, 
                 name : 'tMax', 
                 fill: 'tozeroy',
                 type: 'scatter',
                 fillcolor:'rgba(212, 134, 134, 0.75)',
                 line: {color: 'rgb(212, 134, 134)'}
                
                 }
            trace2 =   {
                x: startDates.map((d,i)=> i+1),
                // x : startDates.map(d=> new Date(new Date(d).getFullYear(),new Date(d).getMonth(),new Date(d).getDate()+1 )),
                y: tAVGS,
                name : 'tAvg',
                fill: 'tozeroy',
                type: 'scatter',
                fillcolor:'rgba(214, 198, 129, 0.75)',
                line: {color: 'rgb(214, 198, 129)'}
                }
            trace3 = {
                x: startDates.map((d,i)=> i+1),
                // x : startDates.map(d=> new Date(new Date(d).getFullYear(),new Date(d).getMonth(),new Date(d).getDate()+1 )),
                y: tMINS,
                name : 'tMin',
                fill: 'tozeroy',
                type: 'scatter',
                fillcolor:'rgba(83, 124, 172, 0.75)',
                line: {color: 'rgb(83, 124, 172))'}
                }
            
            layout = {
                title:{text:"Last Year Trip Normals"},
                xaxis: {
                    title: "Date",
                    tickvals : startDates.map((d,i)=> i+1),
                    ticktext : startDates
                },
                yaxis : {
                    title: "Temperature (<span>&#176;</span>F)",
                },
                showLegend: true

            }
            data = [trace1,trace2,trace3]
            Plotly.newPlot('area-chart', data,layout)
        });

    });
    



    // YEARLY TRIP NORMALS TABLE
    var trip_norm_each_year_Path = "/trip_norm_each_year/"+ startDate + '/'+endDate;
    d3.json(trip_norm_each_year_Path).then((data)=> {
        // console.log(data)
        var temp = Object.keys(data).map(function(key) {
            return [key, data[key]];
        });
        // console.log(temp)
        var myYears = [];
        var mins = [];
        var avgs = [];
        var maxs = [];
        var tbody = d3.select("#by-year").select('tbody');
        // var tbody = d3.select('tbody');
        for (var i = 0; i<temp.length; i++) {
            var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text(temp[i][0].toString());
            myYears.push(temp[i][0])
            // console.log(temp[i][0])
            // var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text(temp[i][1][0][0].toString());
            mins.push(temp[i][1][0][0])
            // console.log(temp[i][1][0][0])
            // var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text(Number.parseFloat(temp[i][1][0][1]).toFixed(2).toString());
            avgs.push(Number.parseFloat(temp[i][1][0][1]).toFixed(2))
            // console.log(temp[i][1][0][1])
            // var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text(temp[i][1][0][2].toString());
            maxs.push(temp[i][1][0][2])
            // console.log(temp[i][1][0][2])
        };
        tbody.selectAll('td').attr('style','font-size:25px')

        // console.log(myYears)
        // console.log(mins)
        // console.log(avgs)
        // console.log(maxs)
        
        var tripStart =  d3.select('#past-year-dates').text().slice(110,120)
        var tripEnd = d3.select('#past-year-dates').text().slice(124,134)
        // What is the normals of the normals for every year
        var allYearDateText = "Based on every year of data for the same dates, the approximate temperatures for your trip to Hawaii on <span style='color:whitesmoke'>" + startDateText + "</span> to <span style='color:whitesmoke'>" + endDateText + " </span> will be: <br>";
        d3.select('#all-years-dates').html(allYearDateText)
        var minMean = mins.reduce((a,b) => a + b, 0) / mins.length;
        var maxMean = maxs.reduce((a,b) => a + b, 0) / maxs.length;
        avgs = avgs.map(d=>Number.parseFloat(d))
        var avgMean = avgs.reduce((a,b) => a + b, 0) / avgs.length;

        var lowestTemp = "Lowest (Average) : <br> <span style='color:whitesmoke'>" + minMean.toFixed(2).toString() +"<span>&#176;</span> F</span> <br>"
        d3.select('#all-year-norms-1').html(lowestTemp);

        var highestTemp = "Highest (Average): <br> <span style='color:whitesmoke'>" + maxMean.toFixed(2).toString() +"<span>&#176;</span> F</span> <br>"
        d3.select('#all-year-norms-2').html(highestTemp);

        var avgTemp = "Average (Overall): <br> <span style='color:whitesmoke'>" + avgMean.toFixed(2).toString() +"<span>&#176;</span> F</span>"
        d3.select('#all-year-norms-3').html(avgTemp);

        var trace1 = {
            x: myYears,
            y : mins,
            name : 'Minimum',
            type: 'bar',
            marker: {color: 'rgb(83, 124, 172)'}
        }
        var trace2 = {
            x: myYears,
            y : avgs,
            name : 'Average',
            type: 'bar',
            marker: {color: 'rgb(214, 198, 129)'}
        }
        var trace3 = {
            x: myYears,
            y : maxs,
            name : 'Maximum',
            type: 'bar',
            marker: {color: 'rgb(212, 134, 134)'}
        };
        var data_Year = [trace1, trace2, trace3];

        var layout_Year = {
            barmode: 'group',
            title: {text: "Yearly Temperature Normals for " + startDate.slice(5,) + " to " + endDate.slice(5,)},

            // title: {text: "Trip Dates Temperature Normals per Year"},
            xaxis: {title: "Year"},
            yaxis : {title: "Temperature (<span>&#176;</span>F)"},
            showLegend: true
        };
        Plotly.newPlot('yearNormDiv', data_Year, layout_Year);

    });

    var pastYearRainPath = "/rainfall/"+ startDate+ "/" +endDate;
    d3.json(pastYearRainPath).then((data)=> {
        // console.log(data.map(d=> d['Station']))
        var stations = data.map(d=> d['Station'])
        var stationName = data.map(d=> d['Name'])
        var lat = data.map(d=> d['Lat'])
        var lon = data.map(d=> d['Lon'])
        var elevation = data.map(d=> d['Elevation'])
        var rainfallAmt = data.map(d=>d['Total Amount of Rainfall'])
        console.log(stations)
        var tbody = d3.select("#station-rainfall").select('tbody');
        // var tbody = d3.select('tbody');
        for (var i = 0; i<stations.length; i++) {
            var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text(stations[i].toString());

            var cell = row.append("td");
            cell.text(stationName[i]);

            var cell = row.append("td");
            cell.text(lat[i].toString());

            var cell = row.append("td");
            cell.text(lon[i].toString());
            var cell = row.append("td");
            cell.text(elevation[i].toString());
            var cell = row.append("td");
            cell.text(rainfallAmt[i].toString());
            
        };
        tbody.selectAll('td').attr('style','font-size:20px')
    }); //ENDS d3.json(pastYearRainPath).then((data)


    var dailyRainPath = "/rainfall_last_year/" + startDate+"/"+ endDate
    d3.json(dailyRainPath).then((data)=> {
        var test = Object.keys(data).map(function(key) {
            console.log(key)
            // console.log(data[key])
            var precip = data[key]
            var precips = [];
            for (var i = 0; i<precip.length; i++) {
                if (precip[i]!== null) {
                    precips.push(precip[i])
                }
            // console.log('PRECIPS')
            // console.log(precips)
            }
            return [key, precips];
            // return [key, data[key]];
            });
        console.log(test)
        var myDates = [];
        var myPrecips = [];
        var allPrecips = [];
        var tbody = d3.select("#trip-rainfall").select('tbody');
        for (var i = 0; i<test.length; i++) {
            var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text(test[i][0]);
            myDates.push(test[i][0])
            var eachPrecip = [];
            // myPrecips.push(test[i][1])
            for (var j=0; j<test[i][1].length; j++) {
                var cell = row.append("td");
                cell.text(test[i][1][j]);
                // myDates.push(test[i][0])
                myPrecips.push(test[i][1][j])
                eachPrecip.push(test[i][1][j])
            }
            allPrecips.push(eachPrecip)
        };
        console.log(myDates)
        console.log(myPrecips)
        console.log(myDates.length)
        console.log(myPrecips.length)
        precipAverages = [];
        allPrecips.forEach((d)=> {
            var precipMean = d.reduce((a,b) => a + b, 0) / d.length;
            precipAverages.push(precipMean)
        });
        console.log(precipAverages)
        var trace_precip = {
                    x: myDates.map((d,i)=>i+1),
                    y: precipAverages
                    // type:'bar'
        }
        var layout_precips = {
            title: {text: "Trip Daily Average Rainfall"},
            xaxis: {
                title: 'Date',
                tickvals : myDates.map((d,i)=> i+1),
                ticktext : myDates
            },
            yaxis: {title: 'Rainfall (mm)'}
        }
        var data_precip = [trace_precip];
        Plotly.newPlot('rain-daily',data_precip,layout_precips)

        var minPrecip = Math.min(...myPrecips);
        var maxPrecip = Math.max(...myPrecips);
        var avgPrecip = myPrecips.reduce((a,b) => a + b, 0) / myPrecips.length;
        console.log(allPrecips)
        var allYearDateText = "Based on every year of data for the same dates, the approximate rainfall for your trip to Hawaii on <span style='color:whitesmoke'>" + startDateText + "</span> to <span style='color:whitesmoke'>" + endDateText + " </span> will be: <br>";
        d3.select('#past-year-rain').html(allYearDateText)
        //<h2 id = 'past-year-rain' class = "text-info"></h2>
        var lowestTemp = "Lowest : <br> <span style='color:whitesmoke'>" + minPrecip.toFixed(2).toString() +" mm </span> <br>"
        d3.select('#rain-1').html(lowestTemp);

        var highestTemp = "Highest: <br> <span style='color:whitesmoke'>" + maxPrecip.toFixed(2).toString() +" mm </span> <br>"
        d3.select('#rain-2').html(highestTemp);

        var avgTemp = "Average: <br> <span style='color:whitesmoke'>" + avgPrecip.toFixed(2).toString() +" mm</span>"
        d3.select('#rain-3').html(avgTemp);

    });

} // Ends else if (currentSelection === 'Your trip')


function show_2016_Data() {
    var my2016Div = document.getElementById('show2016data');
    // var displaySetting = my2016Div.style.display;
    var displaySetting = my2016Div.style.visibility;
    if (displaySetting ==='hidden') {
        my2016Div.style.visibility = 'visible'

    }


    console.log(d3.select('#currentPage').text())
    var startDate = d3.select('#currentPage').text().slice(18,29).trim();
    var endDate = d3.select('#currentPage').text().slice(32,).trim();
    // CHANGE TO DISPLAY CORRECT DATE
    var startDateText = startDate;
    var endDateText = endDate;
    if (Number.parseFloat(startDate.slice(0,4))>=2018) {
        startDate = "2017"+ startDate.slice(4,)
    }
    if (Number.parseFloat(endDate.slice(0,4))>=2018) {
        endDate = "2017"+ endDate.slice(4,)
    }


    // Temperature Normals for PAST YEAR ONLY
    var trip_norm_prev_year_Path = '/trip_norm_prev_year/'+ startDate + '/'+ endDate;
    // console.log(trip_norm_prev_year_Path)
    d3.json(trip_norm_prev_year_Path).then((data)=> {
        // console.log(data['Dates'])
        // console.log(data['Normals'][0][0])
        // console.log(typeof data)
        //the approximate temperatures for my trip to Hawaii
        var pastYearDateText = "Based on the previous year's data for the same dates, the approximate temperatures for your trip to Hawaii on <span style='color:whitesmoke'>" + startDateText + "</span> to <span style='color:whitesmoke'>" + endDateText + " </span> will be: <br>";
        d3.select('#past-year-dates').html(pastYearDateText)

        var lowestTemp = "Lowest:<br> <span style='color:whitesmoke'>" + data['Normals'][0][0].toString() +"<span>&#176;</span> F</span> <br>"
        d3.select('#past-year-norms-1').html(lowestTemp);

        var highestTemp = "Highest:<br> <span style='color:whitesmoke'>" + data['Normals'][0][2].toString() +"<span>&#176;</span> F</span> <br>"
        d3.select('#past-year-norms-2').html(highestTemp);

        var avgTemp = "Average:<br> <span style='color:whitesmoke'>" + Number.parseFloat(data['Normals'][0][1]).toFixed(2).toString() +"<span>&#176;</span> F</span>"
        d3.select('#past-year-norms-3').html(avgTemp);

        var pastYearTablePath = "/api/v1.0/" + data['Dates'][0] + "/" + data['Dates'][1];
        d3.json(pastYearTablePath).then((data) => {
            var startDates = data.map(d => d[0][0])
            var tMINS = data.map(d => d[0][1])
            var tAVGS = data.map(d => +(Number.parseFloat(d[0][2]).toFixed(2)))
            var tMAXS = data.map(d => d[0][3])
            // console.log(startDates)
            // console.log(startDates.length)
            // console.log(tMINS)
            // console.log(tMINS.length)

            // console.log(tAVGS)
            // console.log(tAVGS.length)

            // console.log(tMAXS)
            // console.log(tMAXS.length)
            

            var tbody1 = d3.select("tbody");
            for (var i = 0; i<startDates.length; i++) {
                var row = tbody1.append("tr");
                var cell = row.append("td");
                cell.text(startDates[i]);
                // console.log(startDates[i])
                // var row = tbody1.append("tr");
                var cell = row.append("td");
                cell.text(tMINS[i].toString());
                // var row = tbody.append("tr");
                var cell = row.append("td");
                cell.text(tAVGS[i].toString());
                // var row = tbody.append("tr");
                var cell = row.append("td");
                cell.text(tMAXS[i].toString());
            }
            tbody1.selectAll('td').attr('style','font-size:20px')

            // traces = [
            //     {x : startDates, y: tMINS, name : 'tMin', stackgroup:'one'},
            //     {x : startDates, y: tAVGS, name : 'tAvg', stackgroup:'one'},
            //     {x : startDates, y: tMAXS, name : 'tMax',stackgroup:'one'}
            // ]
            trace1 = {
                x: startDates.map((d,i)=> i+1),
                // x : startDates.map(d=> new Date(new Date(d).getFullYear(),new Date(d).getMonth(),new Date(d).getDate()+1 )),
                 y: tMAXS, 
                 name : 'tMax', 
                 fill: 'tozeroy',
                 type: 'scatter',
                 fillcolor:'rgba(212, 134, 134, 0.75)',
                 line: {color: 'rgb(212, 134, 134)'}
                
                 }
            trace2 =   {
                x: startDates.map((d,i)=> i+1),
                // x : startDates.map(d=> new Date(new Date(d).getFullYear(),new Date(d).getMonth(),new Date(d).getDate()+1 )),
                y: tAVGS,
                name : 'tAvg',
                fill: 'tozeroy',
                type: 'scatter',
                fillcolor:'rgba(214, 198, 129, 0.75)',
                line: {color: 'rgb(214, 198, 129)'}
                }
            trace3 = {
                x: startDates.map((d,i)=> i+1),
                // x : startDates.map(d=> new Date(new Date(d).getFullYear(),new Date(d).getMonth(),new Date(d).getDate()+1 )),
                y: tMINS,
                name : 'tMin',
                fill: 'tozeroy',
                type: 'scatter',
                fillcolor:'rgba(83, 124, 172, 0.75)',
                line: {color: 'rgb(83, 124, 172))'}
                }
            
            layout = {
                title:{text:"Last Year Trip Normals"},
                xaxis: {
                    title: "Date",
                    tickvals : startDates.map((d,i)=> i+1),
                    ticktext : startDates
                },
                yaxis : {
                    title: "Temperature (<span>&#176;</span>F)",
                },
                showLegend: true

            }
            data = [trace1,trace2,trace3]
            Plotly.newPlot('area-chart', data,layout)
        });

    });
    



    // YEARLY TRIP NORMALS TABLE
    var trip_norm_each_year_Path = "/trip_norm_each_year/"+ startDate + '/'+endDate;
    d3.json(trip_norm_each_year_Path).then((data)=> {
        // console.log(data)
        var temp = Object.keys(data).map(function(key) {
            return [key, data[key]];
        });
        // console.log(temp)
        var myYears = [];
        var mins = [];
        var avgs = [];
        var maxs = [];
        var tbody = d3.select("#by-year").select('tbody');
        // var tbody = d3.select('tbody');
        for (var i = 0; i<temp.length; i++) {
            var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text(temp[i][0].toString());
            myYears.push(temp[i][0])
            // console.log(temp[i][0])
            // var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text(temp[i][1][0][0].toString());
            mins.push(temp[i][1][0][0])
            // console.log(temp[i][1][0][0])
            // var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text(Number.parseFloat(temp[i][1][0][1]).toFixed(2).toString());
            avgs.push(Number.parseFloat(temp[i][1][0][1]).toFixed(2))
            // console.log(temp[i][1][0][1])
            // var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text(temp[i][1][0][2].toString());
            maxs.push(temp[i][1][0][2])
            // console.log(temp[i][1][0][2])
        };
        tbody.selectAll('td').attr('style','font-size:25px')

        // console.log(myYears)
        // console.log(mins)
        // console.log(avgs)
        // console.log(maxs)
        
        var tripStart =  d3.select('#past-year-dates').text().slice(110,120)
        var tripEnd = d3.select('#past-year-dates').text().slice(124,134)
        // What is the normals of the normals for every year
        var allYearDateText = "Based on every year of data for the same dates, the approximate temperatures for your trip to Hawaii on <span style='color:whitesmoke'>" + startDateText + "</span> to <span style='color:whitesmoke'>" + endDateText + " </span> will be: <br>";
        d3.select('#all-years-dates').html(allYearDateText)
        var minMean = mins.reduce((a,b) => a + b, 0) / mins.length;
        var maxMean = maxs.reduce((a,b) => a + b, 0) / maxs.length;
        avgs = avgs.map(d=>Number.parseFloat(d))
        var avgMean = avgs.reduce((a,b) => a + b, 0) / avgs.length;

        var lowestTemp = "Lowest (Average) : <br> <span style='color:whitesmoke'>" + minMean.toFixed(2).toString() +"<span>&#176;</span> F</span> <br>"
        d3.select('#all-year-norms-1').html(lowestTemp);

        var highestTemp = "Highest (Average): <br> <span style='color:whitesmoke'>" + maxMean.toFixed(2).toString() +"<span>&#176;</span> F</span> <br>"
        d3.select('#all-year-norms-2').html(highestTemp);

        var avgTemp = "Average (Overall): <br> <span style='color:whitesmoke'>" + avgMean.toFixed(2).toString() +"<span>&#176;</span> F</span>"
        d3.select('#all-year-norms-3').html(avgTemp);

        var trace1 = {
            x: myYears,
            y : mins,
            name : 'Minimum',
            type: 'bar',
            marker: {color: 'rgb(83, 124, 172)'}
        }
        var trace2 = {
            x: myYears,
            y : avgs,
            name : 'Average',
            type: 'bar',
            marker: {color: 'rgb(214, 198, 129)'}
        }
        var trace3 = {
            x: myYears,
            y : maxs,
            name : 'Maximum',
            type: 'bar',
            marker: {color: 'rgb(212, 134, 134)'}
        };
        var data_Year = [trace1, trace2, trace3];

        var layout_Year = {
            barmode: 'group',
            title: {text: "Yearly Temperature Normals for " + startDate.slice(5,) + " to " + endDate.slice(5,)},

            // title: {text: "Trip Dates Temperature Normals per Year"},
            xaxis: {title: "Year"},
            yaxis : {title: "Temperature (<span>&#176;</span>F)"},
            showLegend: true
        };
        Plotly.newPlot('yearNormDiv', data_Year, layout_Year);

    });

    var pastYearRainPath = "/rainfall/"+ startDate+ "/" +endDate;
    d3.json(pastYearRainPath).then((data)=> {
        // console.log(data.map(d=> d['Station']))
        var stations = data.map(d=> d['Station'])
        var stationName = data.map(d=> d['Name'])
        var lat = data.map(d=> d['Lat'])
        var lon = data.map(d=> d['Lon'])
        var elevation = data.map(d=> d['Elevation'])
        var rainfallAmt = data.map(d=>d['Total Amount of Rainfall'])
        console.log(stations)
        var tbody = d3.select("#station-rainfall").select('tbody');
        // var tbody = d3.select('tbody');
        for (var i = 0; i<stations.length; i++) {
            var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text(stations[i].toString());

            var cell = row.append("td");
            cell.text(stationName[i]);

            var cell = row.append("td");
            cell.text(lat[i].toString());

            var cell = row.append("td");
            cell.text(lon[i].toString());
            var cell = row.append("td");
            cell.text(elevation[i].toString());
            var cell = row.append("td");
            cell.text(rainfallAmt[i].toString());
            
        };
        tbody.selectAll('td').attr('style','font-size:20px')
    }); //ENDS d3.json(pastYearRainPath).then((data)


    var dailyRainPath = "/rainfall_last_year/" + startDate+"/"+ endDate
    d3.json(dailyRainPath).then((data)=> {
        var test = Object.keys(data).map(function(key) {
            console.log(key)
            // console.log(data[key])
            var precip = data[key]
            var precips = [];
            for (var i = 0; i<precip.length; i++) {
                if (precip[i]!== null) {
                    precips.push(precip[i])
                }
            // console.log('PRECIPS')
            // console.log(precips)
            }
            return [key, precips];
            // return [key, data[key]];
            });
        console.log(test)
        var myDates = [];
        var myPrecips = [];
        var allPrecips = [];
        var tbody = d3.select("#trip-rainfall").select('tbody');
        for (var i = 0; i<test.length; i++) {
            var row = tbody.append("tr");
            var cell = row.append("td");
            cell.text(test[i][0]);
            myDates.push(test[i][0])
            var eachPrecip = [];
            // myPrecips.push(test[i][1])
            for (var j=0; j<test[i][1].length; j++) {
                var cell = row.append("td");
                cell.text(test[i][1][j]);
                // myDates.push(test[i][0])
                myPrecips.push(test[i][1][j])
                eachPrecip.push(test[i][1][j])
            }
            allPrecips.push(eachPrecip)
        };
        console.log(myDates)
        console.log(myPrecips)
        console.log(myDates.length)
        console.log(myPrecips.length)
        precipAverages = [];
        allPrecips.forEach((d)=> {
            var precipMean = d.reduce((a,b) => a + b, 0) / d.length;
            precipAverages.push(precipMean)
        });
        console.log(precipAverages)
        var trace_precip = {
                    x: myDates.map((d,i)=>i+1),
                    y: precipAverages
                    // type:'bar'
        }
        var layout_precips = {
            title: {text: "Trip Daily Average Rainfall"},
            xaxis: {
                title: 'Date',
                tickvals : myDates.map((d,i)=> i+1),
                ticktext : myDates
            },
            yaxis: {title: 'Rainfall (mm)'}
        }
        var data_precip = [trace_precip];
        Plotly.newPlot('rain-daily',data_precip,layout_precips)

        var minPrecip = Math.min(...myPrecips);
        var maxPrecip = Math.max(...myPrecips);
        var avgPrecip = myPrecips.reduce((a,b) => a + b, 0) / myPrecips.length;
        console.log(allPrecips)
        var allYearDateText = "Based on every year of data for the same dates, the approximate rainfall for your trip to Hawaii on <span style='color:whitesmoke'>" + startDateText + "</span> to <span style='color:whitesmoke'>" + endDateText + " </span> will be: <br>";
        d3.select('#past-year-rain').html(allYearDateText)
        //<h2 id = 'past-year-rain' class = "text-info"></h2>
        var lowestTemp = "Lowest : <br> <span style='color:whitesmoke'>" + minPrecip.toFixed(2).toString() +" mm </span> <br>"
        d3.select('#rain-1').html(lowestTemp);

        var highestTemp = "Highest: <br> <span style='color:whitesmoke'>" + maxPrecip.toFixed(2).toString() +" mm </span> <br>"
        d3.select('#rain-2').html(highestTemp);

        var avgTemp = "Average: <br> <span style='color:whitesmoke'>" + avgPrecip.toFixed(2).toString() +" mm</span>"
        d3.select('#rain-3').html(avgTemp);

    });
}