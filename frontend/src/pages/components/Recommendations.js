import { useState } from 'react';
import './recommendations.css';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function Recommendations({ setDrag, weekPlan, userData }) {

  const responsive = {
      superLargeDesktop: {
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

    const [ recList, setRecList ] = useState([]);

    const handleDragStart = (e, recipe) => {
        setDrag(true);
        e.dataTransfer.setData('text/plain', JSON.stringify(recipe));
    }
  
    const handleDrag = (e) => {
      if(window.scrollY >= 100){
        window.scrollBy(0, -5);
      }
    }
  
    const handleDragEnd = (e) => {
      e.preventDefault();
      setDrag(false);
    }

    const [loading, setLoading] = useState(2);

    const getRecs = async () => {
      let searchString = "";
      for(const day in weekPlan){
        for(const meal in weekPlan[day]){
          if(weekPlan[day][meal]){
            searchString += " " + weekPlan[day][meal]["id"].toString();
          }
        }
      }
      if (searchString === "") {
        setLoading(3);
        return;
      }

      setLoading(1);

      const res = await fetch('/api/recommend', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ search: searchString, cal_goal: userData["cal_goal"], protein_goal: userData["protein_goal"]})
      });
  
      if(!res.ok){
          return;
      }
    
      const res_json = await res.json();
      console.log(res_json);

      setRecList(res_json["recipes"]);
      setLoading(0);
    }

    const responses = ['', 'Loading...', 'Refresh to Begin', 'Add to your calendar, then refresh!'];

    if(loading){
      return (
        <>
        <div className="recommendations-container">
            <div className='recommendations-inside-container' style={{display: "flex" , justifyContent: "center" , alignItems: "center"}}>
                <h2>{responses[loading]}</h2>
              </div>
        </div>
        <div style={{ display: "flex" , justifyContent: "center", height: "40px", alignItems: "center"}}>
          <button className="cal-button" onClick={getRecs}>Refresh</button>
        </div>
      </>
      );
    }


    return (
      <>
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
        <div style={{ display: "flex" , justifyContent: "center", height: "40px", alignItems: "center"}}>
          <button className="cal-button" onClick={getRecs}>Refresh</button>
        </div>
      </>
    )
}

export default Recommendations;
