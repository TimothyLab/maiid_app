import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";

//explication de chaque ligne 
function App() { //déclare la fonction App
  const [file, setFile] = useState(); //déclare une variable file et une fonction setFile qui permet de modifier la variable file, useState permet de déclarer une variable d'état
  function handleChange(e) { //déclare une fonction handleChange qui prend en paramètre e
      console.log(e.target.files); //affiche dans la console le fichier
      setFile(URL.createObjectURL(e.target.files[0])); //modifie la variable file avec le fichier
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Mosquito identification app</h1>
        <input type="file" onChange={handleChange} /> 
        %crée un input de type file qui appelle la fonction handleChange lorsqu'un fichier est sélectionné
        <img src={file} /> affiche l'image sélectionnée

        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload it modify this line in app.js file in /src rep.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
