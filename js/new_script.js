
var sweden = [[26,55],[25,54],[25,55],[24,54],[24,55],[24,56],[23,56],[23,55],[23,54],[22,55],[22,56],[21,55],[21,56],[20,56],[20,57],[19,56],[19,57],[18,57]]

var selectedColor = "Orange";
var dataCountryColor = "#b3b3b3";
var countryColor = "#d3d3d3"


d3.queue()
    .defer(d3.csv, "data/map.csv")
    .defer(d3.csv, "waves/wave1.csv")
    .defer(d3.csv, "waves/wave2.csv")
    .defer(d3.csv, "waves/wave3.csv")
    .defer(d3.csv, "waves/wave4.csv")
    .defer(d3.json, "data/countries.json")
    .await(loadData);

function loadData(error, mapData, wave1, wave2, wave3, wave4, co) {
    if(error){console.log(error);}
    // console.log(co)
    // console.log(wave1)
    data = wave1;
    $('.spinner').hide()
    $('#trail').show()
    var selected;

    function getCountry(y,x) {
        // for (var i = 0; i < sweden.length; i++) {
        //     if(x == sweden[i][0] && y ==sweden[i][1]){
        //         return "Sweden"
        //     }
        // }
        var value = "Other"
        co.forEach(function(c) {
            for (var i = 0; i < c.cords.length; i++) {
                if(x == c.cords[i][0] && y ==c.cords[i][1]){
                    // console.log("Hitta: " + c.country)
                    value = c.country
                }
            } 
        })
        return value
    }

    function mover(d) {
      var el = d3.select(this)
        .transition()
        .duration(10)     
        .style("fill-opacity", 0.3)
        ;
    }

    //Mouseout function
    function mout(d) { 
      var el = d3.select(this)
         .transition()
         .duration(1000)
         .style("fill-opacity", 1)
         ;
    };

    function click(d) {
        var el = d3.select(this)
            .transition(5000)
            .duration(10)
            .style("fill", "red")
            ;
    }
    function fillCountry(country) {
        if (selected == country) {
            return
        }
        d3.selectAll('#'+selected)
                .transition(500)
                .duration(500)
                .style("fill", dataCountryColor)
        if(country != "Other"){
        selected = country;
            var el = d3.selectAll("#"+country)
                .transition(10)
                .duration(10)
                .style("fill", selectedColor)
                ;

        }else{
            selected = null;
        }
    }

    var margin = {
        top: 50,
        right: 20,
        bottom: 20,
        left: 50
    };


    var width = $(window).width() - margin.left - margin.right - 40;
    var height = $(window).height() - margin.top - margin.bottom - 80;


    var MapColumns = 100,
      MapRows = 80;
      
    //The maximum radius the hexagons can have to still fit the screen
    var hexRadius = d3.min([width/(Math.sqrt(3)*(MapColumns+3)),
          height/((MapRows+3)*1.5)]);
                
    //Set the new height and width based on the max possible
    width = MapColumns*hexRadius*Math.sqrt(3);
    height = MapRows*1.5*hexRadius+0.5*hexRadius;

    //Set the hexagon radius
    var hexbin = d3.hexbin()
        .radius(hexRadius);

    //Calculate the center positions of each hexagon  
    var points = [];
    var truePoints = [];
    for (var i = 0; i < MapRows; i++) {
        for (var j = 0; j < MapColumns; j++) {
          var a;
          var b = (3 * i) * hexRadius / 2;
          if (i % 2 == 0) {
          a = Math.sqrt(3) * j * hexRadius;
          } else {
          a = Math.sqrt(3) * (j - 0.5) * hexRadius;
          }
          points.push([a, b, {"id":getCountry((j+1),i+adjustCordinate(j))}]);
            truePoints.push([hexRadius * j * Math.sqrt(3), hexRadius * i * 1.5]);
        }
    }

    var worldSVG = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function adjustCordinate(y) {
        var offset;
        if (y % 2 == 0){
            if(y == 1){
                offset = 2
            }else{
                offset = 1
            }
        }else{
            offset = 2
        }
        return offset
    }
    function logCordinate(x, y) {
        offset = adjustCordinate(y)
        // console.log(getCountry((x+offset),(y+1)))
        console.log((y+1)+","+(x+offset))
    }

    worldSVG.append("g")
        .selectAll(".hexagon")
        .data(hexbin(points))
        .enter().append("path")
        .attr("class", "hexagon")
        .attr("country", function(d) {
            return getCountry(d.i+adjustCordinate(d.j), d.j+1)
        })
        .attr("id", function(d) {
            return getCountry(d.i+adjustCordinate(d.j), d.j+1)
        })
        .attr("d", function (d) {
        return "M" + d.x + "," + d.y + hexbin.hexagon();
        })
        .attr("stroke", "white")
        .attr("stroke-width", "1px")
        .style("fill", function (d,i) {
            // console.log("hexagon at : " + d.i + ":" + d.j)
            // var even = true;
            if (d.j % 2 == 0){
                if(d.j == 1){
                    rowOffset = 2
                }else{
                    rowOffset = 1
                }
            }else{
                rowOffset = 2
            }
            a = mapData[d.j][d.i+rowOffset]
            if (a === "n") {
                return "white"
            }else if (a==="y"){
                if( getCountry(d.i+adjustCordinate(d.j), d.j+1) != "Other"){
                    return dataCountryColor
                }else{
                    return countryColor
                }
            }else{
                return "red"
            }
      })
        .style("fill-opacity", 1)
        .on("mouseover", mover)
        .on("click", function(d) {
            logCordinate(d.i, d.j)
            country = getCountry(d.i+adjustCordinate(d.j), d.j+1);
            fillCountry(country);
      })
        .on("mouseout", mout);

}; 