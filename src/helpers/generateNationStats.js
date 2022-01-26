import statesData from "../assets/data/allStates.json";
import _ from "lodash";
import { multiNationGDP, multiNationPop, weightedProperty } from "./sums";

export default function generateNationStats(nation) {
  var returnData = {};

  if (nation != "China" && nation != "United States" && nation != "United Kingdom") {
    // Find where name or country == nation in statesData
    let nationData = statesData.find((state) => {
      return state.name == nation || state.country == nation;
    });
    if (nationData) {
      returnData.gdp = parseFloat(nationData.GDP);
      returnData.population = parseFloat(nationData.population);
      returnData.church = parseFloat(nationData.church);
      returnData.econSpeciality = nationData["econ specialty"];
      returnData.education = parseFloat(nationData.education);
      returnData.environment = parseFloat(nationData.environment);
      returnData.gini = parseFloat(nationData.gini) * 100;
      returnData.growth = parseFloat(nationData.growth);
      returnData.infrastructure = parseFloat(nationData.infrastructure);
      returnData.lawAndOrder = parseFloat(nationData.lawandorder);
      returnData.poverty = parseFloat(nationData.poverty);
      returnData.unemployment = parseFloat(nationData.unemployment);
      returnData.uninsured = parseFloat(nationData.uninsured);
      returnData.avgEP = parseFloat(nationData["avg EP"]);
      returnData.avgSP = parseFloat(nationData["avg SP"]);
      returnData.populationGrowth = parseFloat(nationData.populationgrowth);
      returnData.gdpPerCapita = returnData.gdp / returnData.population;
      return returnData;
    } else {
      return "undefined";
    }
  } else {
    if (nation == "United States") {
      nation = "USA";
    }
    if (nation == "United Kingdom") {
      nation = "UK";
    }
    // Filter the statesData to only include the states in the nation
    let nationStates = statesData.filter((state) => {
      return state.country == nation;
    });
    returnData.gdp = multiNationGDP(nation);
    returnData.population = multiNationPop(nation);
    returnData.church = weightedProperty(nation, "church");
    returnData.education = weightedProperty(nation, "education");
    returnData.environment = weightedProperty(nation, "environment");
    returnData.gini = weightedProperty(nation, "gini") * 100;
    returnData.growth = weightedProperty(nation, "growth");
    returnData.infrastructure = weightedProperty(nation, "infrastructure");
    returnData.lawAndOrder = weightedProperty(nation, "lawandorder");
    returnData.poverty = weightedProperty(nation, "poverty");
    returnData.unemployment = weightedProperty(nation, "unemployment");
    returnData.uninsured = weightedProperty(nation, "uninsured");
    returnData.avgEP = weightedProperty(nation, "avg EP");
    returnData.avgSP = weightedProperty(nation, "avg SP");
    returnData.populationGrowth = weightedProperty(nation, "populationgrowth");
    returnData.gdpPerCapita = returnData.gdp / returnData.population;
    return returnData;
  }
}
