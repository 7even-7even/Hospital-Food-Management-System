// src/components/Footer.jsx
import React from "react";
import "../styles/Footer.css";

const Footer = () => {
    return (
        <footer className="custom-footer">
            <p>
                ---© {new Date().getFullYear()} @Siddharth_Ohal | All rights reserved---
            </p>
        </footer>
    );
};

export default Footer;
