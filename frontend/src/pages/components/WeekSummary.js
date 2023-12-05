import { useEffect, useState } from 'react';
const WeekSummary = ({ weekPlan, userData }) => {
    
    const [weekData, setWeekData] = useState([
      { day: 'Monday', protein: 0, carbs: 0, fat: 0, calories: 0 },
      { day: 'Tuesday', protein: 0, carbs: 0, fat: 0, calories: 0 },
      { day: 'Wednesday', protein: 0, carbs: 0, fat: 0, calories: 0 },
      { day: 'Thursday', protein: 0, carbs: 0, fat: 0, calories: 0 },
      { day: 'Friday', protein: 0, carbs: 0, fat: 0, calories: 0 },
      { day: 'Saturday', protein: 0, carbs: 0, fat: 0, calories: 0 },
      { day: 'Sunday', protein: 0, carbs: 0, fat: 0, calories: 0 },
    ]);

    useEffect(() => {

      const dayIndex = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6
      }

      let struct = [{},{},{},{},{},{},{}];
      let i = 0;
      for(const day in weekPlan){
          console.log(day);
          console.log(i);
          let protein = 0;
          let carbs = 0;
          let fat = 0;
          let calories = 0;
          let total_time = 0;
          for(const meal in weekPlan[day]){
            if(weekPlan[day][meal]){
              protein += weekPlan[day][meal]["protein"];
              carbs += weekPlan[day][meal]["carbs"];
              fat += weekPlan[day][meal]["fat"];
              calories += weekPlan[day][meal]["calories"];
              total_time += weekPlan[day][meal]["total_time"];
            }
          }
          struct[dayIndex[day]] = { day: day.charAt(0).toUpperCase() + day.slice(1), protein: protein, carbs: carbs, fat: fat, calories: calories, total_time: total_time}
          i += 1;
        }
        console.log(struct);
        setWeekData(struct);

  }, [weekPlan])
  
    return (
      <div className="week-summary">
        {weekData.map((dayData, index) => {
          let proGoal = dayData.protein >= userData["protein_goal"];
          let carbGoal = dayData.carbs >= userData["carb_goal"];
          let fatGoal = dayData.fat >= userData["fat_goal"];
          let calGoal = dayData.calories >= userData["cal_goal"];

          let meetsGoals = proGoal && carbGoal && fatGoal && calGoal;

          return <div key={index} className="day-summary">
            <h2>{dayData.day}</h2>
            <p style={{ color: proGoal ? 'green' : 'red' }}>Protein: {dayData.protein}g</p>
            <p style={{ color: carbGoal ? 'green' : 'red' }}>Carbs: {dayData.carbs}g</p>
            <p style={{ color: fatGoal ? 'green' : 'red' }}>Fat: {dayData.fat}g</p>
            <p style={{ color: calGoal ? 'green' : 'red' }}>Calories: {dayData.calories} kcal</p>
            <p>Time: {dayData.total_time} min</p>
            <p>
              {meetsGoals ? '✅ Meets Goals' : '❌ Doesn\'t Meet Goals'}
            </p>
          </div>
      })}
      </div>
    );
  };
  
  export default WeekSummary;