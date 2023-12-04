import { useState } from "react";
import Header from "./components/Header";
import Search from "./components/Search";
import WeekCalendar from "./components/WeekCalendar";
import Recommendations from "./components/Recommendations";

function HomePage({ userData, setUserData }){

    const [drag, setDrag] = useState(false);
    const [weekPlan, setWeekplan] = useState({
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

    return (
        <>
        <Header userData={userData} ></Header>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop: "20px", backgroundColor: "#ff7f50"}}>
            {/* <h1>Welcome {userData.name ? userData.name : "User"}!</h1> */}
            <h1 style={{ color: "white"}}>My Meal Plan</h1>
        </div>
        <main>
            <WeekCalendar drag={drag} setDrag={setDrag} weekPlan={weekPlan} setWeekPlan={setWeekplan}></WeekCalendar>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px"}}>
                <h1 style={{ color: "white"}}>Recommendations</h1>
            </div>
            <Recommendations setDrag={setDrag}></Recommendations>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px"}}>
                <h1 style={{ color: "white"}}>Search For Meals</h1>
            </div>
            <Search setDrag={setDrag}></Search>
        </main>
        </>
    );
}

export default HomePage;