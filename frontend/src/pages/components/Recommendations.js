import { useState } from 'react';
import './recommendations.css';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function Recommendations({ setDrag }) {



    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1200 },
          items: 4
        },
        tablet: {
          breakpoint: { max: 1200, min: 900 },
          items: 3
        },
        mobile: {
          breakpoint: { max: 900, min: 600 },
          items: 2
        },
        m: {
            breakpoint: { max: 600, min: 0 },
            items: 1
          }
      };

    const [ recList, setRecList ] = useState([{"name": "Chicken Noodle Soup" , "category": "FOOD-CAT" , "url" : "https://example.com/", "img_url" : "https://www.thelifejolie.com/wp-content/uploads/2023/01/Hearty-Chicken-Noodle-Soup-Recipe-The-Life-Jolie-4.jpg"}, {"name": "Chicken Noodle Soup" , "category": "FOOD-CAT" , "url" : "https://example.com/", "img_url" : "https://www.thelifejolie.com/wp-content/uploads/2023/01/Hearty-Chicken-Noodle-Soup-Recipe-The-Life-Jolie-4.jpg"},{"name": "Chicken Noodle Soup" , "category": "FOOD-CAT" , "url" : "https://example.com/", "img_url" : "https://www.thelifejolie.com/wp-content/uploads/2023/01/Hearty-Chicken-Noodle-Soup-Recipe-The-Life-Jolie-4.jpg"}, {"name": "Chicken Noodle Soup" , "category": "FOOD-CAT" , "url" : "https://example.com/", "img_url" : "https://www.thelifejolie.com/wp-content/uploads/2023/01/Hearty-Chicken-Noodle-Soup-Recipe-The-Life-Jolie-4.jpg"}, {"name": "Chicken Noodle Soup" , "category": "FOOD-CAT" , "url" : "https://example.com/", "img_url" : "https://www.thelifejolie.com/wp-content/uploads/2023/01/Hearty-Chicken-Noodle-Soup-Recipe-The-Life-Jolie-4.jpg"}, {"name": "Chicken Noodle Soup" , "category": "FOOD-CAT" , "url" : "https://example.com/", "img_url" : "https://www.thelifejolie.com/wp-content/uploads/2023/01/Hearty-Chicken-Noodle-Soup-Recipe-The-Life-Jolie-4.jpg"},{"name": "Chicken Noodle Soup" , "category": "FOOD-CAT" , "url" : "https://example.com/", "img_url" : "https://www.thelifejolie.com/wp-content/uploads/2023/01/Hearty-Chicken-Noodle-Soup-Recipe-The-Life-Jolie-4.jpg"}, {"name": "Chicken Noodle Soup" , "category": "FOOD-CAT" , "url" : "https://example.com/", "img_url" : "https://www.thelifejolie.com/wp-content/uploads/2023/01/Hearty-Chicken-Noodle-Soup-Recipe-The-Life-Jolie-4.jpg"}]);

    const handleDragStart = (e, recipe) => {
        setDrag(true);
        e.dataTransfer.setData('text/plain', JSON.stringify(recipe));
      }
  
      const handleDrag = (e) => {
        if(window.scrollY >= 50){
          window.scrollBy(0, -2);
        }
      }
  
      const handleDragEnd = (e) => {
        e.preventDefault();
        setDrag(false);
      }

    const getRecs = async () => {
      const res = await fetch('/api/recommend', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ search: "10 30 23"})
    });
  
    if(!res.ok){
        return;
    }
  
    const res_json = await res.json();
    console.log(res_json);

    setRecList(res_json["recipes"]);

    }


    return (
      <div> <button onClick={getRecs}>HELLO</button>
        <div className="recommendations-container">
            <div className='recommendations-inside-container'>
            <Carousel 
              ssr
              partialVisibile
              responsive={responsive}
              itemClass="car-item"
              containerClass="carousel"
              minimumTouchDrag={80}
              >
                {recList.map((recipe, index) => (
                        <div key={index} className="meal-item" draggable
                            onDragStart={(e) => handleDragStart(e, recipe)}
                            onDrag={(e) => handleDrag(e)}
                            onDragEnd={(e) => handleDragEnd(e)}>
                            <img src={recipe.img_url} alt={recipe.name} draggable="false"/>
                            <h2 className='meal-card'>{recipe.name}</h2>
                            <p>{recipe.category}</p>
                            <a href={recipe.url} target="_blank" rel="noopener noreferrer">
                                View Recipe
                            </a>
                        </div>
                    ))}
            </Carousel>
       
            </div>
        </div>
      </div>
    )
}

export default Recommendations;
