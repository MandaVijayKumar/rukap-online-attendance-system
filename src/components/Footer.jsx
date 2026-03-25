import React from "react";
import "./Footer.css";
import { FaEnvelope, FaPhoneAlt, FaUserTie } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Section */}
        <div className="footer-left">
          <h3>Rayalaseema University Attendance System</h3>
          <p>© 2026 All Rights Reserved</p>
        </div>

        {/* Right Section */}
        <div className="footer-right">
          <h4>Contact</h4>

          <p className="footer-item">
            <FaUserTie className="icon" />
            <span>V. Satish Kumar</span>
          </p>

          <p>Assistant Professor</p>

          <p className="footer-item">
            <FaEnvelope className="icon" />
            <a href="mailto:valmikisatish71@gmail.com">
              valmikisatish71@gmail.com
            </a>
          </p>

          <p className="footer-item">
            <FaPhoneAlt className="icon" />
            <a href="tel:+919866248428">
              +91 9866248428
            </a>
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;