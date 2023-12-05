import { useState } from 'react';
import './FlipCard.css';

function FlipCard({ data }){
console.log(data);

  const [isFlipped, setFlipped] = useState(false);
  const flipCard = () => {
    setFlipped(!isFlipped);
  };

  return (
    <div draggable="false" className={`flip-card${isFlipped ? ' flipped' : ''}`} onClick={flipCard}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img draggable="true" className="flip-card-image" src={data["img_url"]} alt={data["name"]} style={{ width: '100%', height: '200px' }} />
        <h3>{data["name"]}</h3>
        </div>
        <div className="flip-card-back">
          <h3>Food Information</h3>
          <p>Calories: {data["calories"]}</p>
          <p>Protein: {data["protein"]}g</p>
          <p>Fat: {data["fat"]}g</p>
          <p>Carbs: {data["carbs"]}g</p>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;