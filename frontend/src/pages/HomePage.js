import Header from "./components/Header";
import Search from "./components/Search";
import WeekCalendar from "./components/WeekCalendar";

function HomePage(){
    return (
        <>
        <Header></Header>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px"}}>
            <h1>My Meal Plan</h1>
        </div>
        <main>
            <WeekCalendar></WeekCalendar>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px"}}>
                <h1>Add To Your Plan!</h1>
            </div>
            <Search></Search>
        </main>
        </>
    );
}

export default HomePage;