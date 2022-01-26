const fs = require("fs");
const { JSDOM } = require("jsdom");
const path = require("path");

fs.readFile("./src/assets/map.svg", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const dom = new JSDOM(data);
  const svg = dom.window.document.querySelector("svg");
  const countries = svg.querySelectorAll("path");
  const countriesJson = [];
  for (let i = 0; i < countries.length; i++) {
    // id of the path = abbreviation of the country
    // title of the path = name of the country
    // d of the path = path of the country
    // Put all the data in an object
    const country = countries[i];
    var id = country.id;
    var name = country.getAttribute("title");
    var path = country.getAttribute("d");
    countriesJson.push({
      abbreviation: id,
      name: name,
      path: path,
    });
  }
  // Write the json file
  fs.writeFile("./src/assets/map.json", JSON.stringify(countriesJson), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Successfully converted the SVG to JSON");
  });
});
