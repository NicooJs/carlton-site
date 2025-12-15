// src/components/Footer.jsx

import React from 'react';
import './Footer.css';

export function Footer() {
  // Pega o ano atual automaticamente para o copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <p>&copy; {currentYear} Carlton.</p>
        
        <div className="footer-socials">
          {/* Links para as redes sociais */}
          <a href="https://www.instagram.com/carltonnnnnnnnnnnn" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://www.youtube.com/@carltonnnnn" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Youtube">
            <i className="fa-brands fa-youtube"></i>
          </a>
          {/* NOVO LINK PARA O SPOTIFY */}
          <a href="https://open.spotify.com/intl-pt/artist/7K6V47VqjdHcc6QE90qKQJ?si=2jYV4l8xSdWLEpuSXEKbrg" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Spotify">
            <i className="fa-brands fa-spotify"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}