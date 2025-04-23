import React from 'react';
import AuthPage from '../components/AuthPage';
import { useNavigate } from 'react-router-dom';
import '../assets/LoginPage.css';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const goToRegister = () => {
        navigate('/register/');
    };

    return (
        <div className="login-background">
            <div className="login-wrapper">
                <AuthPage isLogin={true} />
                <button className="signup-button" onClick={goToRegister}>
                    Pas encore de compte ? Inscris-toi
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
