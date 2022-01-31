import React, { useEffect, useState } from "react";
import countryData from "../assets/map.json";
import * as d3 from "d3";
import style1 from "../assets/styles/mapStyle1.json";
import style2 from "../assets/styles/mapStyle2.json";
import buttonStyle from "../assets/styles/buttonStyle.json";
import generateNationStats from "../helpers/generateNationStats";
import { sumGDP, sumPop } from "../helpers/sums";
import ReactTooltip from "react-tooltip";
import "../assets/styles/style.css";
import Leaderboard from "./Leaderboard";
var numeral = require("numeral");

function selectColor(colors, domain, x) {
  var chroma = require("chroma-js");
  var scale = chroma.scale(colors).domain(domain);
  return scale(x).hex();
}
// Create a FUNCTION for formatting numbers into US currency:
// formatNumber(90000000) => "$90,000,000"
function formatNumber(x, addCommas = false) {
  // Round to the nearest thousandth (ex 9.7884 => 9.79)
  x = Math.round(x * 100) / 100;
  if (addCommas) {
    return numeral(x).format("(0,0)");
  } else {
    return x;
  }
}

export default function Map() {
  const [mapmode, setMapmode] = useState("growth");
  const [showButtons, setShowButtons] = useState(false);
  const [leaderboardStats, setLeaderboardStats] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

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
            color = selectColor(["red", "lightgrey", "green"], [-5, 6], k.popGrowth);
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
          case "church":
            color = selectColor(["white", "green"], [0, 100], k.church);
            break;
          case "avgSP":
            color = selectColor(["blue", "white", "red"], [-3, 3], k.avgSP);
            break;
          default:
            color = "white";
        }
        path.attr("fill", color);
        path.attr(
          "data-tip",
          `<div>
            <h5>${country.name}</h5>
            <table>
              <tr>
                <td><b>GDP:</b></td>
                <td>$${formatNumber(k.gdp, true)}</td>
              </tr>
              <tr>
                <td><b>Population:</b></td>
                <td>${formatNumber(k.population, true)}</td>
              </tr>
              <tr>
                <td><b>GDP per capita:</b></td>
                <td>$${formatNumber(k.gdpPerCapita, true)}</td>
              </tr>
              <tr>
                <td><b>Average EP:</b></td>
                <td>${formatNumber(k.avgEP)}</td>
              </tr>
              <tr>
                <td><b>Average SP:</b></td>
                <td>${formatNumber(k.avgSP)}</td>
              </tr>
              <tr>
                <td><b>Growth:</b></td>
                <td>${formatNumber(k.growth)}%</td>
              </tr>
              <tr>
                <td><b>Population growth:</b></td>
                <td>${formatNumber(k.popGrowth)}%</td>
              </tr>
              <tr>
                <td><b>Poverty:</b></td>
                <td>${formatNumber(k.poverty)}%</td>
              </tr>
              <tr>
                <td><b>Unemployment:</b></td>
                <td>${formatNumber(k.unemployment)}%</td>
              </tr>
              <tr>
                <td><b>Uninsured:</b></td>
                <td>${formatNumber(k.uninsured)}%</td>
              </tr>
              <tr>
                <td><b>Law and order:</b></td>
                <td>${formatNumber(k.lawAndOrder)}%</td>
              </tr>
              <tr>
                <td><b>Gini:</b></td>
                <td>${formatNumber(k.gini)}</td>
              </tr>
              <tr>
                <td><b>Church:</b></td>
                <td>${formatNumber(k.church)}%</td>
              </tr>
            </table>
          </div>`
        );
        path.attr("data-for", "tooltip");

        path.on("click", function () {
          var info = JSON.parse(this.getAttribute("info"));
          console.log(info);
        });
      }
    });
  };

  useEffect(() => {
    d3.select("#map")
      .append("svg")
      .attr("id", "svgMap")
      .attr("width", "100%")
      .attr("height", "100%")
      // Make sure the map fits the screen
      .attr("viewBox", "0 0 1120 660");
    populateMap();
    ReactTooltip.rebuild();
    const handleZoom = (e) => {
      d3.select("svg g").attr("transform", e.transform);
    };
    let zoom = d3.zoom().on("zoom", handleZoom);
    d3.select("#svgMap").call(zoom);

    return () => {
      d3.select("svg").remove();
    };
  }, [mapmode]);
  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="btn-group" style={{ zIndex: "100" }}>
          {showLeaderboard ? (
            <button className="btn btn-danger btn-sm" onClick={(e) => setShowLeaderboard(false)}>
              Hide Leaderboard
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={(e) => setShowLeaderboard(true)}>
              Show Leaderboard
            </button>
          )}
          {showButtons ? (
            <button className="btn btn-danger btn-sm" onClick={(e) => setShowButtons(false)}>
              Hide Buttons
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={(e) => setShowButtons(true)}>
              Show Buttons
            </button>
          )}
        </div>
        <div className="btn-group flex-wrap" style={{ zIndex: "100", position: "absolute", bottom: "0", marginBottom: "10px" }}>
          {showButtons && (
            <>
              <button className={mapmode === "growth" ? `btn btn-secondary btn-sm` : `btn btn-secondary btn-sm active`} onClick={(e) => setMapmode("growth")}>
                GDP Growth
              </button>
              <button className={mapmode === "popGrowth" ? `btn btn-secondary btn-sm` : `btn btn-secondary btn-sm active`} onClick={(e) => setMapmode("popGrowth")}>
                Population Growth
              </button>
              <button className={mapmode === "poverty" ? `btn btn-secondary btn-sm` : `btn btn-secondary btn-sm active`} onClick={(e) => setMapmode("poverty")}>
                Poverty
              </button>
              <button className={mapmode === "unemployment" ? `btn btn-secondary btn-sm` : `btn btn-secondary btn-sm active`} onClick={(e) => setMapmode("unemployment")}>
                Unemployment
              </button>
              <button className={mapmode === "uninsured" ? `btn btn-secondary btn-sm` : `btn btn-secondary btn-sm active`} onClick={(e) => setMapmode("uninsured")}>
                Uninsured
              </button>
              <button className={mapmode === "lawAndOrder" ? `btn btn-secondary btn-sm` : `btn btn-secondary btn-sm active`} onClick={(e) => setMapmode("lawAndOrder")}>
                Law and Order (%)
              </button>
              <button className={mapmode === "gini" ? `btn btn-secondary btn-sm` : `btn btn-secondary btn-sm active`} onClick={(e) => setMapmode("gini")}>
                Gini
              </button>
              <button className={mapmode === "population" ? `btn btn-secondary btn-sm` : `btn btn-secondary btn-sm active`} onClick={(e) => setMapmode("population")}>
                Population
              </button>
              <button className={mapmode === "gdp" ? `btn btn-secondary btn-sm` : `btn btn-secondary btn-sm active`} onClick={(e) => setMapmode("gdp")}>
                GDP
              </button>
              <button className={mapmode === "gdpPerCapita" ? `btn btn-secondary btn-sm` : `btn btn-secondary btn-sm active`} onClick={(e) => setMapmode("gdpPerCapita")}>
                GDP Per Capita
              </button>
              <button className={mapmode === "avgEP" ? `btn btn-secondary btn-sm` : `btn btn-secondary btn-sm active`} onClick={(e) => setMapmode("avgEP")}>
                Average EP
              </button>
              <button className={mapmode === "avgSP" ? `btn btn-secondary btn-sm` : `btn btn-secondary btn-sm active`} onClick={(e) => setMapmode("avgSP")}>
                Average SP
              </button>
              <button className={mapmode === "church" ? `btn btn-secondary btn-sm` : `btn btn-secondary btn-sm active`} onClick={(e) => setMapmode("church")}>
                Church Attendance
              </button>
            </>
          )}
        </div>
      </div>
      {showLeaderboard && <Leaderboard mapmode={mapmode} countryData={countryData} />}
      <div style={style1}>
        <div id="map" style={style2}></div>
      </div>

      <ReactTooltip
        id="tooltip"
        className="extraClass"
        effect="solid"
        getContent={(dataTip) => <p dangerouslySetInnerHTML={{ __html: dataTip }}></p>}
        delayShow={500}
        delayHide={500}
        delayUpdate={500}
        effect={"solid"}
        place={"right"}
      ></ReactTooltip>
    </>
  );
}
