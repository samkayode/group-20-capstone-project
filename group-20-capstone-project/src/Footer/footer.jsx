import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-top">
          <h3>About</h3>
          <a href="https://github.com/Triumph74926/Triumph74926">Ajetomobi Bethel</a>
          <a href="https://github.com/mhiz-tayo">Fadeelah Omotayo</a>
          <a href="https://github.com/samkayode">Samuel Kayode</a>
          <a href="https://github.com/JohnChimeremeze">John Chimeremeze</a>
          <a href="https://github.com/freddot-com">Odiagbe Fred</a>
          <a href="https://github.com/tatamiyih-ops">Hamza</a>
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