import { Link } from "react-router-dom";
import StoneSoupIcon from "./../../StoneSoupIcon.png";

function Header() {
  
    return (
    <header className="header-outer">
        <div className="header-inner responsive-wrapper">
            <div className="header-logo">
                <img src={StoneSoupIcon} alt="Stone Soup Icon"/>
                <h1>Stone Soup</h1>
            </div>
            <nav className="header-navigation">
                <Link to="/">Home</Link>
                <Link to="/User">User</Link>
                <Link to="/Login">Sign In</Link>
                <Link to="/signUp">Sign Up</Link>
                <button>Menu</button>
            </nav>
        </div>
    </header>
    );
}

export default Header;
