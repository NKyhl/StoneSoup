import "./landing.css";
import StoneSoupIcon from "../StoneSoupIcon.png";
import BlankStoneSoupIcon from "../BlankStoneSoupIcon.png"
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import CursorContextProvider from './components/CursorContextProvider';
import Cursor from "./components/Cursor";

function Landing(){

    const navigate = useNavigate();
    const handleImgClick = () => {
        navigate('/login');
    }

    const [hovered, setHovered] = useState(false);

    return <>
        <CursorContextProvider>
        <Cursor />
        <div className="large-image-container">
            <img src={hovered ? StoneSoupIcon : BlankStoneSoupIcon} alt="Stone Soup" className="main-icon" onClick={handleImgClick} onMouseEnter={() => {setHovered(true)}} onMouseLeave={() => {setHovered(false)}}/>
        </div>
        </CursorContextProvider>
    </>;
}

export default Landing;