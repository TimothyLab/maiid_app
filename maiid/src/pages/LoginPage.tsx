import React from 'react';
import AuthPage from '../components/AuthPage';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate(); // Initialisation de navigate pour la redirection

    // Fonction pour rediriger vers la page d'inscription
    const goToRegister = () => {
        navigate('/register/');
    };

    return (
        <div>
            <AuthPage isLogin={true} /> {/* La page de connexion */}
            <button onClick={goToRegister}>Pas encore de compte ? Inscris-toi</button> {/* Bouton d'inscription */}
        </div>
    );
};

export default LoginPage;
