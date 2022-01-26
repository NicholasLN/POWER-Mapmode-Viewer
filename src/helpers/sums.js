import statesData from "../assets/data/allStates.json";

function sumGDP() {
  // Find the state with the highest gdp
  var max = 0;
  for (let i = 0; i < statesData.length; i++) {
    if (parseFloat(statesData[i].GDP) > max) {
      max = parseFloat(statesData[i].GDP);
    }
  }
  return max;
}

function sumPop() {
  // Find the state with the highest population
  var max = 0;
  for (let i = 0; i < statesData.length; i++) {
    if (parseFloat(statesData[i].population) > max) {
      max = parseFloat(statesData[i].population);
    }
  }
  return max;
}

function multiNationGDP(countryName) {
  var countryStates = statesData.filter((state) => {
    return state.country == countryName;
  });
  var sum = 0;
  for (let i = 0; i < countryStates.length; i++) {
    sum += parseFloat(countryStates[i].GDP);
  }
  return sum;
}
function multiNationPop(countryName) {
  var countryStates = statesData.filter((state) => {
    return state.country == countryName;
  });
  var sum = 0;
  for (let i = 0; i < countryStates.length; i++) {
    sum += parseFloat(countryStates[i].population);
  }
  return sum;
}

function weightedProperty(countryName, property) {
  // Select the states from the statesData that match the country
  var countryStates = statesData.filter((state) => {
    return state.country == countryName;
  });
  var entries = [];
  // For each state, add the property and the population to the entries array
  for (let i = 0; i < countryStates.length; i++) {
    entries.push({
      property: parseFloat(countryStates[i][property]),
      population: parseFloat(countryStates[i].population),
    });
  }
  // Now calculate the weighted average of the property
  var sum = 0;
  var sumPop = 0;
  for (let i = 0; i < entries.length; i++) {
    sum += entries[i].property * entries[i].population;
    sumPop += entries[i].population;
  }
  return sum / sumPop;
}

export { sumGDP, sumPop, weightedProperty, multiNationGDP, multiNationPop };
