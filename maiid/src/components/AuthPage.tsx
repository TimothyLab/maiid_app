import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthPageProps {
    isLogin: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ isLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async () => {
        if (!username || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }
        setError('');
        setLoading(true);

        const url = isLogin ? "/login/" : "/register/";
        const payload = { username, password };

        try {
            const response = await fetch(`http://127.0.0.1:8000${url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem("token", data.access_token);
                    navigate("/analyse"); // Redirection après connexion
                } else {
                    alert("Inscription réussie !");
                    navigate("/"); // Redirection vers la connexion après inscription
                }
            } else {
                setError(data.detail || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error("Erreur lors de l'authentification :", error);
            setError('Une erreur est survenue, veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>{isLogin ? "Connexion" : "Inscription"}</h1>
            <input 
                type="text" 
                placeholder="Nom d'utilisateur" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Mot de passe" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleAuth} disabled={loading}>
                {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default AuthPage;
