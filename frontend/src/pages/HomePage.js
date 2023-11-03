import Header from "./components/Header";
import Search from "./components/Search";
import WeekCalendar from "./components/WeekCalendar";

function HomePage({ userData, setUserData }){

    return (
        <>
        <Header userData={userData} ></Header>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "20px"}}>
            <h1>Welcome {userData.name ? userData.name : "User"}!</h1>
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
