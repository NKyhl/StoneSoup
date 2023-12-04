import Header from "./components/Header";
import Profile from "./components/Profile";
import Charts from "./components/Charts";

function UserPage({ userData, setUserData }){
    return (
        <>
        <Header userData={userData} ></Header>
        <main className="user-main">
            <Profile userData={userData} setUserData={setUserData} ></Profile>
            <Charts></Charts>
        </main>
        </>
    );
}

export default UserPage;