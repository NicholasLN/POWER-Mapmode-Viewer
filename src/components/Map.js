import React, { useEffect, useState } from "react";
import countryData from "../assets/map.json";
import * as d3 from "d3";
import style1 from "../assets/styles/mapStyle1.json";
import style2 from "../assets/styles/mapStyle2.json";
import generateNationStats from "../helpers/generateNationStats";
import { sumGDP, sumPop } from "../helpers/sums";

function selectColor(colors, domain, x) {
  var chroma = require("chroma-js");
  var scale = chroma.scale(colors).domain(domain);
  return scale(x).hex();
}

export default function Map() {
  const [mapmode, setMapmode] = useState("avgEP");

  const populateMap = () => {
    const svg = d3.select("svg").append("g");
    countryData.forEach((country) => {
      const k = generateNationStats(country.name);
      var path = svg.append("path");
      path.attr("d", country.path).attr("class", "country").attr("title", country.name).attr("id", country.abbreviation).attr("stroke", "black").attr("stroke-width", "0.5");
      path.attr("info", JSON.stringify(k));
      if (k != "undefined") {
        var color;
        switch (mapmode) {
          case "growth":
            color = selectColor(["red", "lightgrey", "green"], [-10, 10], k.growth);
            break;
          case "popGrowth":
            color = selectColor(["red", "lightgrey", "green"], [-5, 6], k.populationGrowth);
            break;
          case "poverty":
            color = selectColor(["#feff73", "red"], [1, 70], k.poverty);
            break;
          case "unemployment":
            color = selectColor(["#feff73", "red"], [0, 25], k.unemployment);
            break;
          case "uninsured":
            color = selectColor(["green", "lightgrey", "red"], [0, 70], k.uninsured);
            break;
          case "lawAndOrder":
            color = selectColor(["#feff73", "red"], [100, 0], k.lawAndOrder);
            break;
          case "gini":
            color = selectColor(["#feff73", "red"], [20, 70], k.gini);
            break;
          case "population":
            let pop = sumPop();
            color = selectColor(["white", "green"], [0, pop], k.population);
            break;
          case "gdp":
            let gdp = sumGDP();
            color = selectColor(["white", "green"], [0, gdp], k.gdp);
            break;
          case "gdpPerCapita":
            color = selectColor(["white", "green"], [0, 70000], k.gdpPerCapita);
            break;
          case "avgEP":
            color = selectColor(["blue", "white", "red"], [-3, 3], k.avgEP);
            break;
          case "avgSP":
            color = selectColor(["blue", "white", "red"], [-3, 3], k.avgSP);
            break;

          default:
            color = "white";
        }
        path.attr("fill", color);
        path.on("click", function () {
          var info = JSON.parse(this.getAttribute("info"));
          console.log(info);
        });
      }
    });
  };

  useEffect(() => {
    d3.select("svg").remove();
    d3.select("#map")
      .append("svg")
      .attr("id", "svgMap")
      .attr("width", "100%")
      .attr("height", "100%")
      // Make sure the map fits the screen
      .attr("viewBox", "0 0 1120 660");
    populateMap();
    const handleZoom = (e) => {
      d3.select("svg g").attr("transform", e.transform);
    };
    let zoom = d3.zoom().on("zoom", handleZoom);
    d3.select("#svgMap").call(zoom);
  }, [mapmode]);
  return (
    <div style={style1}>
      <button onClick={(e) => setMapmode("growth")}>GDP Growth</button>
      <button onClick={(e) => setMapmode("popGrowth")}>Population Growth</button>
      <button onClick={(e) => setMapmode("poverty")}>Poverty</button>
      <button onClick={(e) => setMapmode("unemployment")}>Unemployment</button>
      <button onClick={(e) => setMapmode("uninsured")}>Uninsured</button>
      <button onClick={(e) => setMapmode("lawAndOrder")}>Law and Order (%)</button>
      <button onClick={(e) => setMapmode("gini")}>Gini</button>
      <button onClick={(e) => setMapmode("population")}>Population</button>
      <button onClick={(e) => setMapmode("gdp")}>GDP</button>
      <button onClick={(e) => setMapmode("gdpPerCapita")}>GDP Per Capita</button>
      <button onClick={(e) => setMapmode("avgEP")}>Average EP</button>
      <button onClick={(e) => setMapmode("avgSP")}>Average SP</button>
      <div id="map" style={style2}></div>
    </div>
  );
}
