const TotalSummary = () => {
    const weekData = {
      protein: 50, carbs: 30, fat: 15, calories: 500 
    };
  
    return (
        <div className="total-summary-container">
            <div className="total-summary">
                <h2>Summary</h2>
                <p>Protein: {weekData.protein}g</p>
                <p>Carbs: {weekData.carbs}g</p>
                <p>Fat: {weekData.fat}g</p>
                <p>Calories: {weekData.calories} kcal</p>
            </div>
            <div className="ingredients">
                <h2>Ingredients</h2>
            </div>
        </div>
    );
  };
  
  export default TotalSummary;