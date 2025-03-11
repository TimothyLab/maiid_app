import React, { useState } from 'react';
import './App.css';

function App() {

  const [imageUrl, setImageUrl] = useState<string>(''); 
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Gestion du fichier

    // Fonction pour gérer la sélection d'une image
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Vérifie qu'un fichier est sélectionné
        if (file) {
            setSelectedFile(file);
            setImageUrl(URL.createObjectURL(file)); // Affiche la prévisualisation
        }
    };

    // Fonction pour gérer l'upload
    const handleUpload = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedFile) {
            console.error("Aucun fichier sélectionné.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("http://127.0.0.1:5000/", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("Réponse du serveur :", data);
        } catch (error) {
            console.error("Erreur lors de l'upload :", error);
        }
    };
  

    return (
      <div className="App">
          <header className="App-header"> 
              <h1> Bienvenu sur le projet MAIID </h1>
          </header>
          <div>
              <input type="file" onChange={handleChange}/>
              {imageUrl && <img src={imageUrl} className='image' />}
              
          </div>
          
          <div>
          <button onClick={handleUpload}>Uploader</button>
          
          </div>


          
          <p> Edit <code>src/App.tsx</code>  </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer"> Learn React</a>
      </div>
  );
}

export default App;
