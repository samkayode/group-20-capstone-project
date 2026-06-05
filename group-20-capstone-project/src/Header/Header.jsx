import "./Header.css";
import logo from "../assets/graphics.png";
import header from "../assets/Image.png";
function Header() {
  return (
    <div className="header">
      <div className="logo">
        <img src={logo} className="logo-img" />
      </div>
      <div className="header-container">
        <div className="text">
          <div className="text-edit">
            <h1>Explore Our Solar system Through Data</h1>
            <p>
              Understand the planets not just by name, but by measureable facts.
              from size and mass to gravity and density, this page breaks down
              the solar system in a clear, data-driven way.
            </p>
          </div>

          <div className="buttons">
            <button
              className="explore-btn"
              onClick={() => {
                document
                  .getElementById("planets")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore the Data
            </button>
            <button
              className="contact-btn"
              onClick={() => {
                document
                  .getElementById("form")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
        <div className="image">
          <img src={header} alt="planet-image" className="planet-img" />
        </div>
      </div>
    </div>
  );
}
export default Header;
