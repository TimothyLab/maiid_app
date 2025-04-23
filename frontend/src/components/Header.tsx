import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/Header.css';
import logo1 from '../assets/Logo-EPHE-PSLcouleur.png';
import logo2 from '../assets/Logo-INRAE_Transparent.png';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const isLogin = !!localStorage.getItem("token");
    const username = localStorage.getItem("username");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/connexion");
    };

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
                    <li><Link to="/">ACCUEIL</Link></li>
                    <li><Link to="http://localhost:8000/docs">API</Link></li>
                    {!isLogin && <li><Link to="/inscription">INSCRIPTION</Link></li>}
                    
                    {!isLogin ? (
                        <li><Link to="/login">CONNEXION</Link></li>
                    ) : (
                        <>
                            <li className="username-display"> 👤 {username}</li>
                            <li><button onClick={handleLogout} className="logout-button">Déconnexion</button></li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
};

export default Header;
