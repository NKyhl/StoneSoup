import Header from "./components/Header";
import Profile from "./components/Profile";

function UserPage({ userData, setUserData }){
    return (
        <>
        <Header userData={userData} ></Header>
        <main className="user-main">
            <Profile userData={userData} setUserData={setUserData} ></Profile>
        </main>
        <footer></footer>
        </>
    );
}

export default UserPage;