import { Link } from "react-router-dom";
import StoneSoupIcon from "./../../StoneSoupIcon.png";

function Header({ userData }) {
  
    return (
    <header className="header-outer">
        <div className="header-inner responsive-wrapper">
            <div className="header-logo">
                <img src={StoneSoupIcon} alt="Stone Soup Icon"/>
                <h1>Stone Soup</h1>
            </div>
            <nav className="header-navigation">
                <Link to="/home">Home</Link>
                <Link to="/user">User</Link>
                {userData ? '' : <Link to="/login">Sign In</Link>}
                {userData ? '' : <Link to="/signup">Sign Up</Link>}
                <button>Menu</button>
            </nav>
        </div>
    </header>
    );
}

export default Header;
