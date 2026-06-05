import { useEffect, useState } from "react";
import "./Planets.css";

function Planets() {
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    fetch("https://anurella.github.io/json/planets.json")
      .then((res) => res.json())
      .then((data) => setPlanets(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div id="planets" className="planet">
      <div className="planet-container">
        <h2>Visualizing the Differences Between Planets</h2>

        <p>
          Each planet in our solar system has unique physical characteristics.
          Visual comparisons help highlight how vastly different terrestrial
          planets are from gas giants and ice giants.
        </p>

        <div className="planet-display">
          {planets.map((planet) => (
            <div key={planet.planet} className="card">
              <img src={planet.image} alt={planet.planet} />

              <div className="card-content">
                <h4>{planet.planet}</h4>
                <p>{planet.distanceFromSun} million km from Sun</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Planets;
