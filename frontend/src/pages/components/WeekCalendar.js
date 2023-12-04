import React, { useEffect, useState } from 'react';
import "./calendar.css";  
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import IconButton from '@mui/material/IconButton';
import Summary from './Summary';
import FlipCard from './FlipCard';

function WeekCalendar({ drag, setDrag, weekPlan, setWeekPlan }) {

  const calcFirstStart = () => {
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    return startDate.toDateString();
  };

  const [renderSummary, setRenderSummary] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDay, setStartDay] = useState(() => calcFirstStart());

  useEffect(() => {
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    setStartDay(startDate.toDateString());
  }, [currentDate]);

  useEffect(() => {
    console.log(startDay);
  }, [startDay]);

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const handleDragStart = (e, recipe) => {
    setDrag(true);
    e.dataTransfer.setData('text/plain', JSON.stringify(recipe));
  }

  const handleDragEnd = (e) => {
    e.preventDefault();
    setDrag(false);
  }

  const removeDay = (e, day, meal) => {
    e.preventDefault();
    setWeekPlan((prevWeekPlan) => {
      const newWeekPlan = { ...prevWeekPlan };
      newWeekPlan[day] = { ...newWeekPlan[day], [meal]: '' };
      return newWeekPlan;
    });
  }

  const handleDragStart = (e, recipe) => {
    setDrag(true);
    e.dataTransfer.setData('text/plain', JSON.stringify(recipe));
  }

  const handleDragEnd = (e) => {
    e.preventDefault();
    setDrag(false);
  }

  const removeDay = (e, day, meal) => {
    e.preventDefault();
    setWeekPlan((prevWeekPlan) => {
      const newWeekPlan = { ...prevWeekPlan };
      newWeekPlan[day] = { ...newWeekPlan[day], [meal]: '' };
      return newWeekPlan;
    });
  }

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

    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      days.push(
        <div key={i}>
          <div className="day">
            <div className="day-name">{capitalizeFirstLetter(daysOfWeek[day.getDay()])}</div>
            <div className="day-number">{day.getDate()}</div>
          </div>
          <div className='meals'>
            <div draggable={weekPlan[daysOfWeek[day.getDay()]]["breakfast"] ? true : false} onDragStart={(e) => handleDragStart(e, weekPlan[daysOfWeek[day.getDay()]]["breakfast"])}
              onDragEnd={(e) => {handleDragEnd(e); removeDay(e, daysOfWeek[day.getDay()],"breakfast");}} className='meal' style={{ border: drag ? '2px solid orange' : ''}} onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e,daysOfWeek[day.getDay()], "breakfast")} onDragLeave={handleDragLeave}>{weekPlan[daysOfWeek[day.getDay()]]["breakfast"] ? <FlipCard data={weekPlan[daysOfWeek[day.getDay()]]["breakfast"]}></FlipCard> : ''}</div>
            <div draggable={weekPlan[daysOfWeek[day.getDay()]]["lunch"] ? true : false} onDragStart={(e) => handleDragStart(e, weekPlan[daysOfWeek[day.getDay()]]["lunch"])}
              onDragEnd={(e) => {handleDragEnd(e); removeDay(e, daysOfWeek[day.getDay()],"lunch");}} className='meal' style={{ border: drag ? '2px solid orange' : ''}} onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e,daysOfWeek[day.getDay()], "lunch")} onDragLeave={handleDragLeave}>{weekPlan[daysOfWeek[day.getDay()]]["lunch"] ? <FlipCard data={weekPlan[daysOfWeek[day.getDay()]]["lunch"]}></FlipCard> : ''}</div>
            <div draggable={weekPlan[daysOfWeek[day.getDay()]]["dinner"] ? true : false} onDragStart={(e) => handleDragStart(e, weekPlan[daysOfWeek[day.getDay()]]["dinner"])}
              onDragEnd={(e) => {handleDragEnd(e); removeDay(e, daysOfWeek[day.getDay()],"dinner");}} className='meal' style={{ border: drag ? '2px solid orange' : ''}} onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e,daysOfWeek[day.getDay()], "dinner")} onDragLeave={handleDragLeave}>{weekPlan[daysOfWeek[day.getDay()]]["dinner"] ? <FlipCard data={weekPlan[daysOfWeek[day.getDay()]]["dinner"]}></FlipCard> : ''}</div>
            <div draggable={weekPlan[daysOfWeek[day.getDay()]]["snack"] ? true : false} onDragStart={(e) => handleDragStart(e, weekPlan[daysOfWeek[day.getDay()]]["snack"])}
              onDragEnd={(e) => {handleDragEnd(e); removeDay(e, daysOfWeek[day.getDay()],"snack");}} className='meal' style={{ border: drag ? '2px solid orange' : ''}} onDragOver={handleDragOver}
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

    // setStartDay(startDate.toDateString());

    const startDateString = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const endDateString = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return `${startDateString}\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0${endDateString}`;
  };

  const handleReset = () => {
    setWeekPlan({
      sunday: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snack: "",
      },
      monday: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snack: "",
      },
      tuesday: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snack: "",
      },
      wednesday: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snack: "",
      },
      thursday: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snack: "",
      },
      friday: {
        breakfast: "",
        lunch: "",
        dinner: "",
        snack: "",
      },
      saturday: {
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
      <div className='calendar-bottom'>
        <h3>Click meals to show their information</h3>
        <div className='bottom-buttons'>
          <button className="cal-button" style={{ marginRight : "0"}} onClick={handleSummaryClick}>Summary</button>
          <button className="cal-button" >Save Plan</button>
          <IconButton aria-label="delete" onClick={handleReset} >
          <RestartAltIcon>
          </RestartAltIcon>
          </IconButton>
        </div>
        <h3>Click and drag recipes from below to add them to this plan</h3>
      </div>
    </div>
  );
};

export default WeekCalendar;