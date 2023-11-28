import { useState } from 'react';
import './FlipCard.css';

function FlipCard({ data }){
  const [isFlipped, setFlipped] = useState(false);
  const flipCard = () => {
    setFlipped(!isFlipped);
  };

  return (
    <div className={`flip-card${isFlipped ? ' flipped' : ''}`} onClick={flipCard}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img className="flip-card-image" src={data["img_url"]} alt={data["name"]} style={{ width: '100%', height: '200px' }} />
        <h3>{data["name"]}</h3>
        </div>
        <div className="flip-card-back">
          <h3>Food Information</h3>
          <p>Calories: XXX</p>
          <p>Protein: XXg</p>
          <p>Fat: XXg</p>
          <p>Carbs: XXg</p>
          <button onClick={flipCard}>Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;