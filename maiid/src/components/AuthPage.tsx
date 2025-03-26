import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthPageProps {
    isLogin: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ isLogin }) => {
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

        const url = isLogin ? "/auth/login/" : "/auth/register/";
        const payload = { username, password,nom,prenom, email};

        try {
            const response = await fetch(`http://192.168.1.144:8000${url}`, {
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
            {!isLogin && ( //si islogin est faux: si on s'inscrit
                <>
                    <input 
                        type="Nom" 
                        placeholder="Nom" 
                        value={nom} 
                        onChange={(e) => setNom(e.target.value)} 
                    />
                    <input 
                        type="prenom" 
                        placeholder="prenom" 
                        value={prenom} 
                        onChange={(e) => setPrenom(e.target.value)} 
                    />
                    <input 
                        type="mail" 
                        placeholder="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </>
            )}
                  
            <button onClick={handleAuth} disabled={loading} className='button-primary'>
                {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default AuthPage;
