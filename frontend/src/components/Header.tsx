import React from 'react';
import { Link } from 'react-router-dom'; 
import '../assets/Header.css';
import logo1 from '../assets/Logo-EPHE-PSLcouleur.png';
import logo2 from '../assets/Logo-INRAE_Transparent.png';

const Header: React.FC = () => {
    const isLogin = !!localStorage.getItem("token"); 
    return (
        <header className="header">
  <div className="header-left">
    <img src={logo1} alt="Logo 1" className="logo" />
    <img src={logo2} alt="Logo 2" className="logo" />
  </div>

  <div className="header-title">
    <h1>
      MAAID : Mosquito Identification and Characterization<br />
      Knowledge System based on Artificial Intelligence
    </h1>
  </div>

  <div className="header-right">
    <ul>
      <li><a href="/">ACCUEIL</a></li>
      <li><a href="/api">API</a></li>
      <li><a href="/inscription">INSCRIPTION</a></li>
      <li><a href="/connexion">CONNEXION</a></li>
    </ul>
  </div>
</header>
    );
};

export default Header;
