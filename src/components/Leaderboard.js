// Create a leaderboard component that renders a list of countries sorted by the selected statistic (which is passed in as a prop).
import { useState } from "react";
import { useEffect } from "react";
import generateNationStats from "../helpers/generateNationStats";
// It should be positioned absolutely on the bottom left of the screen, should be scrollable, and should be responsive to the screen size.
// The component should render a list of countries, each with their ranking, name, and the statistic.
// The leaderboard statistic is passed in as a prop.

export default function Leaderboard(props) {
  const [nations, setNations] = useState([]);
  const [countryData, setCountryData] = useState([]);

  const populateNationStats = () => {
    // Loop through countryData
    let nt = [];
    countryData.forEach((country) => {
      var nationStats = generateNationStats(country.name);
      if (nationStats != "undefined") {
        nt.push(nationStats);
      }
    });
    nt.sort((a, b) => {
      return b[props.mapmode] - a[props.mapmode];
    });
    setNations(nt);
  };

  useEffect(() => {
    // Set default props
    if (props.mapmode === undefined) {
      props.mapmode = "growth";
    }

    setCountryData(props.countryData);
    populateNationStats();
    return () => {
      setNations([]);
    };
  }, [populateNationStats, props]);

  return (
    <>
      <div className="container" style={{ position: "absolute", bottom: 0, left: 0, zIndex: 100 }}>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title text-center">Leaderboard</h6>
                <hr />
                <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
                  <table className="table table-sm table-striped">
                    <thead>
                      <tr>
                        <th scope="col">Rank</th>
                        <th scope="col">Name</th>
                        <th scope="col">{props.mapmode}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nations.map((nation, index) => (
                        <tr key={nation.name}>
                          <td>{index + 1}</td>
                          <td>{nation.name}</td>
                          <td>{nation[props.mapmode]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
