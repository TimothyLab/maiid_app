import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/Header.css';
import logo1 from '../assets/Logo-EPHE-PSLcouleur.png';
import logo2 from '../assets/Logo-INRAE_Transparent.png';
import '../pages/AdminUserList'

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    /* const isAdmin = localStorage.getItem("role") === "1";
    const isLogin = !!localStorage.getItem("token");
    const username = localStorage.getItem("username");
     */
    useEffect(() => {
        const handleStorageChange = () => {
            const role = localStorage.getItem("role");
            const token = localStorage.getItem("token");
            const storedUsername = localStorage.getItem("username");
    
            setIsAdmin(role === "1");
            setIsLogin(!!token);
            setUsername(storedUsername);
        };
    
        window.addEventListener("storage", handleStorageChange);
    
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        }; 
    }, []);


    const handleNavigate = (path: string) => () => {
        console.log("Navigation vers", path); 
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");

         // Mettez à jour l'état React
        setIsLogin(false);
        setIsAdmin(false);
        setUsername(null);
        
        navigate("/login");
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
                    {isLogin && isAdmin && (
                     <button className="logout-button" onClick={handleNavigate("/admin/users")}>Liste des utilisateurs</button>
                    )}
                    {!isLogin && <li><Link to="/register">INSCRIPTION</Link></li>}
                    
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
