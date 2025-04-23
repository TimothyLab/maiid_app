import React, { useEffect, useRef, useState } from 'react';

interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  class_result: string;
  score?: number;
  confidence?: number;
}

interface DetectionCanvasProps {
  imageUrl: string;
  boxes: BoundingBox[];
}

const DetectionCanvas: React.FC<DetectionCanvasProps> = ({ imageUrl, boxes }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);  // Référence de l'image pour la redimensionner.

  useEffect(() => {
    // Créer un objet image pour obtenir ses dimensions
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const containerWidth = window.innerWidth * 0.8; // 80% de la largeur de la fenêtre
      const containerHeight = window.innerHeight * 0.8; // 80% de la hauteur de la fenêtre

      // Calcul du facteur de redimensionnement tout en gardant l'aspect ratio
      const scale = Math.min(containerWidth / img.width, containerHeight / img.height);
      setImageSize({ width: img.width * scale, height: img.height * scale });

      // Conserver l'image chargée pour l'utiliser dans le canvas
      imageRef.current = img;
    };
  }, [imageUrl]);

  useEffect(() => {
    // Une fois que la taille de l'image est prête et l'image est chargée
    const canvas = canvasRef.current;
    if (canvas && imageRef.current) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = imageRef.current;

        // Réinitialiser le canvas et redessiner l'image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, imageSize.width, imageSize.height);

        // Dessiner les bounding boxes
        boxes.forEach((box) => {
          const x = (box.x1 / img.width) * imageSize.width;
          const y = (box.y1 / img.height) * imageSize.height;
          const width = ((box.x2 - box.x1) / img.width) * imageSize.width;
          const height = ((box.y2 - box.y1) / img.height) * imageSize.height;

          ctx.strokeStyle = 'red';
          ctx.lineWidth = 5;
          ctx.strokeRect(x, y, width, height);

          // Ajouter un fond rouge derrière le texte
          const label = `${box.class_result} (${(box.confidence ? (box.confidence * 100).toFixed(1) : 'N/A')}%)`;

          // Mesurer la largeur et la hauteur du texte pour ajouter un fond rouge
          const textWidth = ctx.measureText(label).width;
          const textHeight = 16; // Hauteur approximative du texte

          // Calculer un léger décalage pour ne pas superposer le fond rouge sur la box
          const padding = 5;

          // Fond rouge juste sous le texte, mais au-dessus de la bounding box
          ctx.fillStyle = 'red';
          ctx.fillRect(x, y - textHeight - padding, textWidth + 2 * padding, textHeight + 2 * padding); // Fond derrière le texte

          // Couleur du texte : blanc
          ctx.fillStyle = 'white';
          ctx.fillText(label, x + padding, y - padding); // Position du texte directement au-dessus de la bounding box

        });
      }
    }
  }, [boxes, imageSize]); // Dépendances sur boxes et imageSize

  return (
    <div
      style={{
        position: 'relative',
        width: imageSize.width,
        height: imageSize.height,
        maxWidth: '100%',
        maxHeight: '80vh',
        overflow: 'hidden',
        margin: 'auto',
      }}
    >
      {/* Canvas sur lequel on dessine l'image et les bounding boxes */}
      <canvas
        ref={canvasRef}
        width={imageSize.width}
        height={imageSize.height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          border: '1px solid black',
        }}
      />
    </div>
  );
};

export default DetectionCanvas;
