import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/RegisterPage.css';

interface RegisterPageProps {
    isLogin: boolean;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ isLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
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

        const url = isLogin ? "/auth/login" : "/auth/register";
        const payload = { username, password,nom,prenom, email};
        console.warn(url)
        try {
            
            const response = await fetch(`${url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log("Réponse complète de l'API :", data);

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem("token", data.access_token);
                    localStorage.setItem("username", username);
                    localStorage.setItem("role", data.role);
                    //console.log("Rôle de l'utilisateur :", data.role);

                    // Optionnel : Vous pouvez déclencher un événement personnalisé pour informer le Header
                    window.dispatchEvent(new Event("storage"));   

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
        <div className="register-wrapper">
            <img src="/logo_MASCARA.jpg" alt="Logo de l'application" className="register-logo" />
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
            
            {!isLogin && (
                <>
                    <input 
                        type="text" 
                        placeholder="Nom" 
                        value={nom} 
                        onChange={(e) => setNom(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Prénom" 
                        value={prenom} 
                        onChange={(e) => setPrenom(e.target.value)} 
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </>
            )}
            
            <button onClick={handleAuth} disabled={loading} className="button-primary">
                {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
            </button>
            
            {error && <p className="error-message">{error}</p>}
        </div>
    );
    
};

export default RegisterPage;
