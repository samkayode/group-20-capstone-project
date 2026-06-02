import "./footer.css";

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
            <p>©2026 Design by <a href="https://amakandukwu.com/">Amaka</a> & <a href="https://www.linkedin.com/in/ifeomaokocha">Ifeoma A.</a></p>
            <p>Built by <a href="https://github.com/samkayode/group-20-capstone-project.git">TS Academy Group 20</a>. All rights reserved</p>
          </div>

          <div className="footer-right">
            <a href="https://tsacademyonline.com/">TSAcademy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;