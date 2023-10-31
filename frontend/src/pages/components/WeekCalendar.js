import React, { useState } from 'react';
import "./calendar.css";  

function WeekCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const renderWeekDays = () => {
    const days = [];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Set to the beginning of the week (Sunday)

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