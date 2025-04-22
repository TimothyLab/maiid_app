import React from 'react';
import '../assets/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2025 MaiiD Application. Tous droits réservés.</p>
      <ul>
        <li><a href="/mentions-legales">Mentions légales</a></li>
        <li><a href="/confidentialite">Politique de confidentialité</a></li>
      </ul>
    </footer>
  );
};

export default Footer;
