import "./Table.css";

const Table = () => {
  return (
    <div className="container">
      <h2 className="title">Planetary Facts at a Glance</h2>
      <p className="subtitle">
        Below is a comparative table of major planets in our solar system. The
        data highlights key physical properties used by astronomers and
        researchers worldwide.
      </p>
      <br />

      <p className="note">
        Data about the planets of our solar system (Planetary facts taken from NASA)
      </p>
     <div className="table-wrapper">
      <table className="planet-table">
        <thead>
          <tr>
            <th scope="col" colSpan="2"> </th>
            <th scope="col">Name</th>
            <th scope="col">Mass (10 24kg)</th>
            <th scope="col">Diameter (km)</th>
            <th scope="col">Density (kg/m3)</th>
            <th scope="col">Gravity (m/s2)</th>
          </tr>
        </thead>

        <tbody>
          {/* Terrestrial Planets */}
          <tr>
            <td className="category" rowSpan="4" colSpan="2">Terrestrial Planets</td>
            <td>Mercury</td>
            <td>0.330</td>
            <td>4,878</td>
            <td>5427</td>
            <td>3.7</td>
          </tr>
          <tr>
            <td>Venus</td>
            <td>0.330</td>
            <td>4,878</td>
            <td>5427</td>
            <td>3.7</td>
          </tr>
          <tr>
            <td>Earth</td>
            <td>0.330</td>
            <td>4,878</td>
            <td>5427</td>
            <td>3.7</td>
          </tr>
          <tr>
            <td>Mars</td>
            <td>0.330</td>
            <td>4,878</td>
            <td>5427</td>
            <td>3.7</td>
          </tr>

          {/* Jovian Planets */}
          <tr>
            <td className="category" rowSpan="4">Jovian Planets</td>
            <td className="category" rowSpan="2">Jupiter</td>
            <td>Jupiter</td>
            <td>0.330</td>
            <td>4,878</td>
            <td>5427</td>
            <td>3.7</td>
          </tr>
          <tr>
            <td>Saturn</td>
            <td>0.330</td>
            <td>4,878</td>
            <td>5427</td>
            <td>3.7</td>
          </tr>
          <tr>
            <td className="category" rowSpan="2">Ice Giant</td>
            <td>Uranus</td>
            <td>0.330</td>
            <td>4,878</td>
            <td>5427</td>
            <td>3.7</td>
          </tr>
          <tr>
            <td>Neptune</td>
            <td>0.330</td>
            <td>4,878</td>
            <td>5427</td>
            <td>3.7</td>
          </tr>

          {/* Dwarf Planets */}
          <tr>
            <td className="category" colSpan="2">Dwarf Planets</td>
            <td>Pluto</td>
            <td>0.330</td>
            <td>4,878</td>
            <td>5427</td>
            <td>3.7</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Table;