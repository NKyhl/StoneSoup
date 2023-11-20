import React, { useState } from 'react';
import "./calendar.css";  

function WeekCalendar({ drag, setDrag, weekPlan, setWeekPlan }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const renderWeekDays = () => {

    const handleDragOver = (e) => {
      e.preventDefault();
      e.target.style.backgroundColor = 'yellow';
    }

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.target.style.backgroundColor = 'lightgrey';
    }

    const onDrop = (e, day, mealType) => {
      var draggedRecipe = e.dataTransfer.getData('text/plain');
      draggedRecipe = JSON.parse(draggedRecipe);
      setWeekPlan((prevWeekPlan) => {
        const newWeekPlan = { ...prevWeekPlan };
        newWeekPlan[day] = { ...newWeekPlan[day], [mealType]: draggedRecipe };
        return newWeekPlan;
      });
    }

    const days = [];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      days.push(
        <div key={i}>
          <div className="day">
            <div className="day-name">{daysOfWeek[day.getDay()]}</div>
            <div className="day-number">{day.getDate()}</div>
          </div>
          <div className='meals'>
            <div className='meal' style={{ backgroundColor: drag ? 'lightgrey' : '',}} onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e,daysOfWeek[day.getDay()], "breakfast")} onDragLeave={handleDragLeave}>{weekPlan[daysOfWeek[day.getDay()]]["breakfast"]["name"]}</div>
            <div className='meal' style={{ backgroundColor: drag ? 'lightgrey' : '',}} onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e,daysOfWeek[day.getDay()], "lunch")} onDragLeave={handleDragLeave}>{weekPlan[daysOfWeek[day.getDay()]]["lunch"]["name"]}</div>
            <div className='meal' style={{ backgroundColor: drag ? 'lightgrey' : '',}} onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e,daysOfWeek[day.getDay()], "dinner")} onDragLeave={handleDragLeave}>{weekPlan[daysOfWeek[day.getDay()]]["dinner"]["name"]}</div>
            <div className='meal' style={{ backgroundColor: drag ? 'lightgrey' : '',}} onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e,daysOfWeek[day.getDay()], "snack")} onDragLeave={handleDragLeave}>{weekPlan[daysOfWeek[day.getDay()]]["snack"]["name"]}</div>
          </div>
        </div>
      );
    }
    return days;
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const getWeekRange = () => {
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const startDateString = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const endDateString = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return `${startDateString}\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0${endDateString}`;
  };  

  return (
    <div className="week-calendar">
      <div className="calendar-header">
        <button onClick={handlePreviousWeek} className='week-buttons'>Previous Week</button>
        <h3>{getWeekRange()}</h3>
        <button onClick={handleNextWeek} className='week-buttons'>Next Week</button>
      </div>
      <div className="week-days">{renderWeekDays()}</div>
    </div>
  );
};

export default WeekCalendar;