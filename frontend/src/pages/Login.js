import React, { useState } from "react";
import StoneSoupIcon from "../StoneSoupIcon.png"
import { Link, useNavigate } from 'react-router-dom';
import "./login.css"

function Login({ setUserID }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let data = { 'username': username, 'email' : email, 'password': password};
        
        const res = await fetch('/api/validate/user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const res_json = await res.json();

        if(!res.ok){
            alert(res_json.message);
            return;
        }

        setUserID(JSON.parse(res_json));


        navigate('/home');
    }


    return (
        <div className="background"><form className="login" onSubmit={handleSubmit}>
            <img src={StoneSoupIcon} alt="StoneSoup Icon" style={{ width: "70px",height: "70px", display:"block", margin:"8px auto"}}></img>
            <h3>Sign In</h3>
            <label htmlFor="name">Username</label>
            <input type="text" id="name" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <label htmlFor="pass">Password</label>
            <input type="password" id="pass" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button className="submit-button" type="submit" >Submit</button>
            <p style={{ marginTop: "20px"}}>New to Stone Soup? <Link to="/signUp">Create Account</Link></p>
        </form></div>
    );  
}   

export default Login; 