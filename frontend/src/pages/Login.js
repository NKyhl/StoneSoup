import React, { useState } from "react";
import StoneSoupIcon from "../StoneSoupIcon.png"
import { Link } from 'react-router-dom';
import "./login.css"

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="background"><form className="login">
            <img src={StoneSoupIcon} alt="StoneSoup Icon" style={{ width: "70px",height: "70px", display:"block", margin:"8px auto"}}></img>
            <h3>Sign In</h3>
            <label htmlFor="name">Username</label>
            <input type="text" id="name" placeholder="Email or Phone" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <label htmlFor="pass">Password</label>
            <input type="password" id="pass" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button className="submit-button">Submit</button>
            <p style={{ marginTop: "20px"}}>New to Stone Soup? <Link to="/signUp">Create Account</Link></p>
        </form></div>
    );  
}   

export default Login; 