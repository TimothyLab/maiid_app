import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

interface AnalyseProps {
    isLogin: boolean;
}

const Analyse: React.FC<AnalyseProps> = ({ isLogin }) => {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState<string>(''); 
    const [selectedFile, setSelectedFile] = useState<File | null>(null); 
    const [detections, setDetections] = useState<any[]>([]);

    // Vérifier l'authentification
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // Redirige vers la page de connexion si non connecté
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token"); // Supprime le token
        navigate("/login"); // Redirige vers la page de connexion
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedFile) {
            console.error("Aucun fichier sélectionné.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("http://127.0.0.1:8000/analyse", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Authentification via le token
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erreur du serveur :", errorData.detail || errorData);
                return;
            }

            const data = await response.json();
            console.log("Réponse du serveur :", data);
            setDetections(data.detections || []);
        } catch (error) {
            console.error("Erreur lors de l'upload :", error);
        }
    };

    return (
        <div className="App">
            <header className="App-header"> 
                <h1> Bienvenu sur le projet MAIID </h1>
                {isLogin && <p>Utilisateur connecté</p>}
                <div className="header-container">
                <button onClick={handleLogout} className="logout-button">Se Déconnecter</button>
                </div>
            </header>

            <div>
                <input type="file" onChange={handleChange} />
                {imageUrl && <img src={imageUrl} className="image" alt="Preview" />}
            </div>

            <div>
                <button onClick={handleUpload}>Uploader</button>
            </div>

            {detections.length > 0 && (
                <div>
                    <h2>Résultats de l'Analyse :</h2>
                    <ul>
                        {detections.map((det, index) => (
                            <li key={index}>
                                Espèce : {det.species}, Confiance : {det.confidence.toFixed(2)}, Bounding_box : {det.bounding_box}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Analyse;
