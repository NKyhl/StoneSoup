import { useEffect, useState } from "react";

const TotalSummary = ( { weekPlan }) => {

    const [ingredientList, setIngredientList] = useState([]);

    const [weekData, setWeekData] = useState({
        protein: 0,
        carbs: 0,
        fat: 0,
        calories: 0,
        prep_time: 0,
        cook_time: 0,
        total_time: 0
      });

    useEffect(() => {
        let protein = 0;
        let carbs = 0;
        let fat = 0;
        let calories = 0;
        let prep_time = 0;
        let cook_time = 0;
        let total_time = 0;

        let searchString = "";
        

        for(const day in weekPlan){
            for(const meal in weekPlan[day]){
              if(weekPlan[day][meal]){
                protein += weekPlan[day][meal]["protein"];
                carbs += weekPlan[day][meal]["carbs"];
                fat += weekPlan[day][meal]["fat"];
                calories += weekPlan[day][meal]["calories"];
                prep_time += weekPlan[day][meal]["prep_time"];
                cook_time += weekPlan[day][meal]["cook_time"];
                total_time += weekPlan[day][meal]["total_time"];
                searchString += " " + weekPlan[day][meal]["id"].toString();
              }
            }
          }

          setWeekData({ protein: protein, carbs: carbs, fat: fat, calories: calories, prep_time: prep_time, cook_time: cook_time, total_time: total_time});

          async function fetchIngredients() {
            const res = await fetch('/api/get/ingredients', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ recipe_ids: searchString})
            });
          
            if(!res.ok){
                return;
            }
          
            const res_json = await res.json();
            console.log(res_json);
            setIngredientList(res_json["ingredients"]);
          }
        
        fetchIngredients();

    }, [weekPlan])
  
    return (
        <div className="total-summary-container">
            <div className="total-summary">
                <h2>Summary</h2>
                <p>Protein: {weekData.protein}g</p>
                <p>Carbs: {weekData.carbs}g</p>
                <p>Fat: {weekData.fat}g</p>
                <p>Calories: {weekData.calories} kcal</p>
                <p>Prep Time: {weekData.prep_time} min</p>
                <p>Cook Time: {weekData.cook_time} min</p>
                <p>Total Time: {weekData.total_time} min</p>
            </div>
            <div className="ingredients">
                <h2>Ingredients</h2>
                <ul>
                    {ingredientList.map((ingredient, index) => {

                    let displayString = "";
                    if(ingredient["quantity"]){
                        displayString += ingredient["quantity"];
                    }
                    if(ingredient["quantity_type"]){
                        displayString += " " + ingredient["quantity_type"];
                    }
                    if (displayString){
                        displayString += ", ";
                    }
                    displayString += ingredient["name"];

                    if(ingredient["style"]){
                        displayString += ", " + ingredient["style"];
                    }

                    return <li key={index}>{displayString}</li>;
                })}
                </ul>
            </div>
        </div>
    );
  };
  
  export default TotalSummary;