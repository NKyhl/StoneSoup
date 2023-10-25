import Header from "./components/Header";
import Profile from "./components/Profile";

function UserPage(){
    return (
        <>
        <Header></Header>
        <main className="user-main">
            <Profile></Profile>
        </main>
        </>
    );
}

export default UserPage;