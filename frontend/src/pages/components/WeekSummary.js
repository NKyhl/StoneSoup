const WeekSummary = ({ weekPlan }) => {
    // Sample data for each day
    const weekData = [
      { day: 'Monday', protein: 50, carbs: 30, fat: 15, calories: 500 },
      { day: 'Tuesday', protein: 55, carbs: 25, fat: 20, calories: 550 },
      { day: 'Wednesday', protein: 60, carbs: 20, fat: 25, calories: 600 },
      { day: 'Thursday', protein: 45, carbs: 35, fat: 18, calories: 480 },
      { day: 'Friday', protein: 48, carbs: 32, fat: 17, calories: 520 },
      { day: 'Saturday', protein: 65, carbs: 15, fat: 30, calories: 700 },
      { day: 'Sunday', protein: 40, carbs: 40, fat: 15, calories: 480 },
    ];
  
    return (
      <div className="week-summary">
        {weekData.map((dayData, index) => (
          <div key={index} className="day-summary">
            <h2>{dayData.day}</h2>
            <p>Protein: {dayData.protein}g</p>
            <p>Carbs: {dayData.carbs}g</p>
            <p>Fat: {dayData.fat}g</p>
            <p>Calories: {dayData.calories} kcal</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default WeekSummary;