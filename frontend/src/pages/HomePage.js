import { useState } from "react";
import Header from "./components/Header";
import Search from "./components/Search";
import WeekCalendar from "./components/WeekCalendar";

function HomePage({ userData, setUserData }){

    const [drag, setDrag] = useState(false);
    const [weekPlan, setWeekplan] = useState({
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

    return (
        <>
        <Header userData={userData} ></Header>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "20px"}}>
            <h1>Welcome {userData.name ? userData.name : "User"}!</h1>
            <h1>My Meal Plan</h1>
        </div>
        <main>
            <WeekCalendar drag={drag} setDrag={setDrag} weekPlan={weekPlan} setWeekPlan={setWeekplan}></WeekCalendar>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px"}}>
                <h1>Add To Your Plan!</h1>
            </div>
            <Search setDrag={setDrag}></Search>
        </main>
        <footer></footer>
        </>
    );
}

export default HomePage;