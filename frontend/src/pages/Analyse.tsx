import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './AdminUserList'
import DetectionCanvas from '../components/DetectionCanvas';
import '../assets/Analyse.css'


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
    const formattedBoxes = detections.map((det) => ({
        x1: det.bounding_box[0],
        y1: det.bounding_box[1],
        x2: det.bounding_box[2],
        y2: det.bounding_box[3],
        class_result: det.species,
        confidence: det.confidence
    }));


    // Vérifier l'authentification
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token envoyé 1 UseEffect :", token);
        if (!token) {
            console.log("Token:", localStorage.getItem("token"));
            navigate("/auth/login"); // Redirige vers la page de connexion si non connecté
        }
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetections([]);
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

                    // Convertir en Blob puis File
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const resizedFile = new File([blob], file.name, { type: file.type });
                            setSelectedFile(resizedFile);
                            setImageUrl(URL.createObjectURL(resizedFile));
                        }
                    }, file.type);
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
        console.log("Token envoyé 2 Handle upload :", token); // <-- Log le token

        setIsLoading(true); // Début du chargement
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("/analyse/analyse", {
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
            console.log("reponse du backend :") ; 
            const data = await response.json();
            console.log("Réponse du serveur avec les données associées :", data);
            setDetections(data.detections || []);
        } catch (error) {
            console.error("Erreur lors de l'upload :", error);
        } finally {
            setIsLoading(false); // Fin du chargement
        }
    };

    

    return (
        <div className="main-content-mosquito">
          <div className="mosquito-container">
      
            <section className="mosquito-objective">
              <p>
              MAAID est un outil conçu pour fournir une identification précise et rapide des différentes espèces de moustiques.
              Cette solution utilise des techniques avancées de reconnaissance d’image pour analyser des photos fournies par les utilisateurs.
              </p>
            </section>
      
            <section className="mosquito-upload-section">
              <p>Sélectionnez une image</p>
              <p>Fichiers autorisés : JPEG, PNG (max 5Mo)</p>
              
            
              <input
                className="file-input"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleChange}
                
              />
                {imageUrl && ( 
                 <div className='image-container'>                             
                    <DetectionCanvas imageUrl={imageUrl} boxes={formattedBoxes} />
                    </div> 
                  )}
            </section>
      
            <section className="analysis-section">
                <button
                    onClick={handleUpload}
                    className={`analyze-button ${isLoading ? "loading" : ""}`}
                    disabled={isLoading}
                >
                    {isLoading ? "Chargement..." : "Analyser l'image"}
            </button>
                
            </section>
      
            {detections.length > 0 && (
              <section className="mosquito-results">
                <h2>Résultats de l’analyse</h2>
                <ul className="results-list">
                  {detections.map((det, index) => (
                    <li className="result-item" key={index}>
                      <strong>Espèce :</strong> {det.species}<br />
                      <strong>Confiance :</strong> {det.confidence.toFixed(2)}<br />
                      <strong>Bounding box :</strong> {det.bounding_box.join(', ')}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      );
};

export default Analyse;

