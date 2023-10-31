import { useState } from "react";

function Signup(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    return (
        <div className="background"><form className="login">
        <h3>Sign Up</h3>
        <label htmlFor="name">Username</label>
        <input type="text" id="name" placeholder="Email or Phone" value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <label htmlFor="pass">Password</label>
        <input type="password" id="pass" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <label htmlFor="rePass">Re-enter Password</label>
        <input type="password" id="rePass" placeholder="Password" value={rePassword} onChange={(e) => setRePassword(e.target.value)}></input>
        <button className="submit-button">Submit</button>
    </form></div>
    );
}

export default Signup;