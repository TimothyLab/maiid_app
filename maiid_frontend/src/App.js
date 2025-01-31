import './App.css';
import React, { useState } from "react";

//explication de chaque ligne 
function App() { //déclare la fonction App
  const [file, setFile] = useState(); //déclare une variable file et une fonction setFile qui permet de modifier la variable file, useState permet de déclarer une variable d'état
  const [results,setResults] = useState(); //déclare une variable results et une fonction setResults qui permet de modifier la variable results, useState permet de déclarer une variable d'état
  const [imageUrl, setImageUrl] = useState(); //déclare une variable imageUrl et une fonction setImageUrl qui permet de modifier la variable imageUrl, useState permet de déclarer une variable d'état

  const handleChange = (e) => { //déclare une fonction handleChange qui prend en paramètre e
      const selectedFile = e.target.files[0]; //affiche dans la console le fichier
      setFile(selectedFile); //modifie la variable file avec le fichier
      setImageUrl(URL.createObjectURL(selectedFile)); //modifie l'url de l'image
  }; 

  const handleUpload = async () => { //déclare une fonction handleUpload
    if (!file) { //si file n'est pas défini
        return; //retourne
    }

    const formData = new FormData(); //déclare une variable formData qui prend un objet FormData
    formData.append("file", file); //ajoute un fichier à formData

    try { //essaie
        const response = await fetch("/", { //déclare une variable response qui attend la réponse de la fonction fetch
            method: "POST", //méthode POST
            body: formData, //corps de la requête
        });

        if (!response.ok) { //si la réponse n'est pas ok
            throw new Error("Failed to upload file"); //affiche un message d'erreur
        }

        const data = await response.json(); //déclare une variable data qui attend la réponse de la fonction response.json
        setResults(data); //modifie la variable results avec data   
      } catch (error) { //attrape l'erreur
        console.error(error); //affiche l'erreur dans la console
      }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Mosquito identification app</h1>
          <div className="image">
            <input type="file" onChange={handleChange} /> 
            <img src={imageUrl} className="image" /> 
          </div>
        
          <button onClick={handleUpload}>Analyser l'image</button>  {/* Bouton pour envoyer l'image */}

         

        {/* Affichage des résultats */}
        {results && (
          <div>
            <h2>Résultats de l'analyse :</h2>
            <pre>{JSON.stringify(results, null, 2)}</pre>  {/* Affiche les résultats au format JSON */}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
