import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import '../components/AdminUserList'

interface AnalyseProps {
    isLogin: boolean;
}

const MAX_WIDTH = 800;
const MAX_HEIGHT = 600;

const Analyse: React.FC<AnalyseProps> = ({ isLogin }) => {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState<string>(''); 
    const [selectedFile, setSelectedFile] = useState<File | null>(null); 
    const [detections, setDetections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Ajout de l'état pour le chargement


    // Vérifier l'authentification
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token envoyé:", token);
        if (!token) {
            console.log("Token:", localStorage.getItem("token"));
            navigate("/auth/login"); // Redirige vers la page de connexion si non connecté
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token"); // Supprime le token
        navigate("/login"); // Redirige vers la page de connexion
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.src = e.target?.result as string;
                img.onload = () => {
                    
                    //canvas pour redimensionner l'image
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (ctx) {
                    // nouvelle largeur et hauteur de l'image
                    let newWidth = img.width;
                    let newHeight = img.height;

                    const ratio = img.width / img.height;

                    if (img.width > MAX_WIDTH)  {
                        newWidth = MAX_WIDTH;
                        newHeight = newWidth / ratio;
                    }

                    if (newHeight > MAX_HEIGHT) {
                        newHeight = MAX_HEIGHT;
                        newWidth = newHeight * ratio;
                    }

                    // Redimensionnez l'image sur le canvas
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);

                    const resizedImageUrl = canvas.toDataURL();
                    setImageUrl(resizedImageUrl);
                }    

            };
        };

        reader.readAsDataURL(file);

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

        const token = localStorage.getItem("token");
        console.log("Token envoyé:", token); // <-- Log le token

        setIsLoading(true); // Début du chargement
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("http://192.168.1.144:8000/analyse/analyse", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Authentification via le token
                },
                body: formData,
                
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erreur du serveur :", errorData.detail || errorData);
                setIsLoading(false); // Fin du chargement
                return;
            }

            const data = await response.json();
            //console.log("Réponse du serveur :", data);
            setDetections(data.detections || []);
        } catch (error) {
            console.error("Erreur lors de l'upload :", error);
        } finally {
            setIsLoading(false); // Fin du chargement
        }
    };

    const handleNavigate = (path: string) => () => {
        console.log("Navigation vers", path); 
        navigate(path);
    };

    return (
        <div className="App">
            <header className="App-header"> 
                <h1> Bienvenue sur le projet MAIID </h1>
                {isLogin && <p>Utilisateur connecté</p>}
                <div className="header-container">
                <button onClick={handleLogout} className="logout-button">Se Déconnecter</button>
                </div>
            </header>

            <div>
                <input type="file" onChange={handleChange} />
                {imageUrl && ( 
                    <div className='image-container'>                             
                        <img src={imageUrl} className="image" alt="Preview" />
                    </div> )}
            </div>

            <div>
                <button onClick={handleUpload}
                className={`button-primary' ${isLoading ? 'button-loading' : ''}`}
                disabled={isLoading}>{isLoading ? 'Chargement...' : 'Analyser l\'image'}</button>
                <button onClick={handleNavigate("/admin/users")}>Liste des utilisateurs</button>
            </div>

            {detections.length > 0 && (
                <div>
                    <h2>Résultats de l'Analyse :</h2>
                    <ul>
                        {detections.map((det, index) => (
                            <li key={index}>
                                <strong>Espèce :</strong>{det.species},
                                <strong>Confiance :</strong>{det.confidence.toFixed(2)}, 
                                <strong>Bounding_box :</strong>{det.bounding_box}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Analyse;




















