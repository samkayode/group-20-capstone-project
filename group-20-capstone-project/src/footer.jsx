import "./style.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-top">
          <h3>About</h3>
          <p>first name of group members</p>
        </div>

        <hr />

        <div className="footer-bottom">
          <div className="footer-left">
            <p>©2026 Design by Amaka & Ifeoma A.</p>
            <p>Built by GroupName. All rights reserved</p>
          </div>

          <div className="footer-right">
            <p>TSAcademy</p>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;