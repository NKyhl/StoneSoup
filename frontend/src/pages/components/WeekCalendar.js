import React, { useState } from 'react';
import "./calendar.css";  
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import IconButton from '@mui/material/IconButton';
import Summary from './Summary';
import FlipCard from './FlipCard';

function WeekCalendar({ drag, setDrag, weekPlan, setWeekPlan }) {

  const [renderSummary, setRenderSummary] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const renderWeekDays = () => {

    const handleDragOver = (e) => {
      e.preventDefault();
      e.currentTarget.style.backgroundColor = 'lightgrey';
    }

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.currentTarget.style.backgroundColor = '';
    }

    const onDrop = (e, day, mealType) => {
      var draggedRecipe = e.dataTransfer.getData('text/plain');
      e.currentTarget.style.backgroundColor = '';
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
            <div className='meal' style={{ border: drag ? '2px solid orange' : ''}} onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e,daysOfWeek[day.getDay()], "breakfast")} onDragLeave={handleDragLeave}>{weekPlan[daysOfWeek[day.getDay()]]["breakfast"] ? <FlipCard data={weekPlan[daysOfWeek[day.getDay()]]["breakfast"]}></FlipCard> : ''}</div>
            <div className='meal' style={{ border: drag ? '2px solid orange' : ''}} onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e,daysOfWeek[day.getDay()], "lunch")} onDragLeave={handleDragLeave}>{weekPlan[daysOfWeek[day.getDay()]]["lunch"] ? <FlipCard data={weekPlan[daysOfWeek[day.getDay()]]["lunch"]}></FlipCard> : ''}</div>
            <div className='meal' style={{ border: drag ? '2px solid orange' : ''}} onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e,daysOfWeek[day.getDay()], "dinner")} onDragLeave={handleDragLeave}>{weekPlan[daysOfWeek[day.getDay()]]["dinner"] ? <FlipCard data={weekPlan[daysOfWeek[day.getDay()]]["dinner"]}></FlipCard> : ''}</div>
            <div className='meal' style={{ border: drag ? '2px solid orange' : ''}} onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e,daysOfWeek[day.getDay()], "snack")} onDragLeave={handleDragLeave}>{weekPlan[daysOfWeek[day.getDay()]]["snack"] ? <FlipCard data={weekPlan[daysOfWeek[day.getDay()]]["snack"]}></FlipCard> : ''}</div>
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

  const handleReset = () => {
    setWeekPlan({
      Sunday: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snack: "",
      },
      Monday: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snack: "",
      },
      Tuesday: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snack: "",
      },
      Wednesday: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snack: "",
      },
      Thursday: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snack: "",
      },
      Friday: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snack: "",
      },
      Saturday: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snack: "",
      },
    });
  }

  const handleSummaryClick = () => {
    setRenderSummary(true);
  };

  return (
    <div className="week-calendar">
      <Summary renderSummary={renderSummary} setRenderSummary={setRenderSummary} weekPlan={weekPlan}></Summary>
      <div className="calendar-header">
        <button onClick={handlePreviousWeek} className='week-buttons'>Previous Week</button>
        <h3>{getWeekRange()}</h3>
        <button onClick={handleNextWeek} className='week-buttons'>Next Week</button>
      </div>
      <div className="week-days">{renderWeekDays()}</div>
      <div>
        <button className="cal-button" style={{ marginRight : "0"}} onClick={handleSummaryClick}>Summary</button>
        <button className="cal-button" >Save Plan</button>
        <IconButton aria-label="delete" onClick={handleReset} >
        <RestartAltIcon>
        </RestartAltIcon>
        </IconButton>
      </div>
    </div>
  );
};

export default WeekCalendar;