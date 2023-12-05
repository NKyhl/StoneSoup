import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import React, { useState } from 'react';
import WeekSummary from './WeekSummary';
import TotalSummary from './TotalSummary';

function Summary({renderSummary, setRenderSummary, weekPlan, userData}){

    const [tabValue, setTabValue] = useState(0);

    const handleChangeTab = (event, newValue) => {  
      setTabValue(newValue);
    };

    const handleClose = () => {
        setTabValue(0);
        setRenderSummary(false);
    };



    return renderSummary ? (
        <div className="summary-popup">
            <div className="summary-popup-inner">
                <IconButton  className="popup-close-btn" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                </IconButton>

                <Tabs value={tabValue} onChange={handleChangeTab}
                variant="fullWidth">
                    <Tab label="Total" />
                    <Tab label="Daily" />
                </Tabs>

                {tabValue === 1 && <WeekSummary weekPlan={weekPlan} userData={userData}/>}
                {tabValue === 0 && <TotalSummary weekPlan={weekPlan}/>}
            </div>
        </div>
    ) : "";
}

export default Summary;