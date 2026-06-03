import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Top Section */}
        <div className="footer-top">
          <h3>About</h3>
          <p className="team-description">
            We are Group 20, a collaborative team of frontend developers. 
            Say hello to Bethel, Fadeelah, Samuel, John, Fred, and Hamza.
          </p>
        </div>

        <hr className="footer-divider" />

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-left">
            <p>
              &copy;2026 Design by{' '}
              <a href="https://amakandukwu.com/" target="_blank" rel="noreferrer">
                Amaka
              </a>{' '}
              &{' '}
              <a href="https://www.linkedin.com/in/ifeomaokocha" target="_blank" rel="noreferrer">
                Ifeoma A.
              </a>
            </p>
            <p>
              Built by{' '}
              <a href="https://github.com/samkayode/group-20-capstone-project.git" target="_blank" rel="noreferrer">
                TS Academy Group 20
              </a>
              . All rights reserved
            </p>
          </div>

          <div className="footer-right">
            <a href="https://tsacademyonline.com/" target="_blank" rel="noreferrer" className="ts-link">
              TSAcademy
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;