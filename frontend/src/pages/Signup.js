import { useState } from "react";
import { useNavigate } from "react-router-dom"

function Signup(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [rePassword, setRePassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        // Front-end verification
        event.preventDefault();
        if (!username || !email || !password || !rePassword) {
            alert('You are missing a field');
            return;
        }
        if (password !== rePassword) {
            alert('Passwords do not match');
            return;
        }
        if (!email.includes('@')) {
            alert('Invalid email')
        }

        // Check if the username is available
        let data = {'username': username};
        const res1 = await fetch('/api/validate/username', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        
        if (!res1.ok) {
            alert('Error connecting to backend.');
            return;
        }

        const res1_json = await res1.json()
        if (res1_json.exists) {
            alert('Username is not available');
            return;
        }

        // Sign up user
        data = {
            'username': username,
            'email': email,
            'password': password
        }

        const res2 = await fetch('/api/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!res2.ok) {
            if (res2.status === 404) {
                return;
            } else {
                const res2_json = await res2.json()
                alert(res2_json.message);
                return;
            }
        }

        // Navigate to Login on success
        navigate('/login');
    }

    return (
        <div className="background"><form className="login">
        <h3>Sign Up</h3>
        <label htmlFor="name">Username</label>
        <input type="text" id="name" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <label htmlFor="email">Email</label>
        <input type="text" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <label htmlFor="pass">Password</label>
        <input type="password" id="pass" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <label htmlFor="rePass">Re-enter Password</label>
        <input type="password" id="rePass" placeholder="Password" value={rePassword} onChange={(e) => setRePassword(e.target.value)}></input>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
    </form></div>
    );
}

export default Signup;