import "./landing.css";
import StoneSoupIcon from "../StoneSoupIcon.png";
import { useNavigate } from 'react-router-dom';
import CursorContextProvider from './components/CursorContextProvider';
import Cursor from "./components/Cursor";

function Landing(){

    const navigate = useNavigate();
    const handleImgClick = () => {
        navigate('/login');
    }

    return <>
        <CursorContextProvider>
        <Cursor />
        <div className="large-image-container">
            <img src={StoneSoupIcon} alt="Stone Soup" className="main-icon" onClick={handleImgClick}/>
        </div>
        </CursorContextProvider>
    </>;
}

export default Landing;