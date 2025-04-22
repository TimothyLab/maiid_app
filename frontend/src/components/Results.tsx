import React from 'react';
import '../assets/Results.css';

interface ResultsProps {
  fileName: string;
  genre: string;
  score: number;
}

const Results: React.FC<ResultsProps> = ({ fileName, genre, score }) => {
  return (
    <div className="results">
      <p><strong>Nom du fichier:</strong> {fileName}</p>
      <p><strong>Genre détecté:</strong> {genre}</p>
      <p><strong>Score d'identification:</strong> {score}%</p>
    </div>
  );
};

export default Results;
