import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ProfileIconMenu from "./ProfileIconMenu";

const images = {
    carrot: require("../../icons/003-carrot.png"),
    broccoli: require("../../icons/001-broccoli.png"),
    cabbage: require("../../icons/002-cabbage.png"),
    eggplant: require("../../icons/004-eggplant.png"),
    corn: require("../../icons/005-corn.png"),
    pumpkin: require("../../icons/006-pumpkin.png"),
    onion: require("../../icons/007-onion.png"),
    bellPepper: require("../../icons/008-bell-pepper.png"),
    potato: require("../../icons/009-potato.png"),
    tomato: require("../../icons/010-tomato.png"),
  };

function Profile(){

    const [edit, setEdit] = useState(false);
    const [editIcon, setEditIcon] = useState(false);

    const pic = "carrot";

    return (
        <div className="profile-bar">
            <ProfileIconMenu trigger={editIcon} setTrigger={setEditIcon}>
                
            </ProfileIconMenu>
            <div className="icon-wrapper">
                <div className="profile-icon-container">
                    <img src={images[pic]} alt="icon"></img>
                </div>
                <div className="icon-edit-circle">
                    <IconButton size="small" style={ {width: "32px", height: "32px"}} onClick={() => setEditIcon(true)} aria-label="edit">
                        <EditIcon />
                    </IconButton>
                </div>
            </div>
            <h3>Username</h3>
            <IconButton style={ {position : "absolute" , right : "3%" , top: "29%", display: !edit ? 'block' : 'None'}} onClick={() => setEdit(true)} aria-label="edit">
                    <EditIcon />
            </IconButton>
            <div className="hr-text">
                <h3>Info</h3>   
                <hr></hr>
            </div>
            <div className="profile-attribute">
                <label htmlFor="name">Name</label>
                <input disabled={!edit} type="text" id="name" placeholder="Username" style={{ border: edit ? '1px solid black' : 'None' }}></input>
                <label htmlFor="email">Email</label>
                <input disabled={!edit} type="text" id="email" placeholder="Email" style={{ border: edit ? '1px solid black' : 'None' }}></input>
            </div>
            <div className="hr-text">
                <h3>Goals</h3>      
                <hr></hr>
            </div>
            <div className="profile-attribute">
                <label htmlFor="cals">Calories</label>
                <input disabled={!edit} type="text" id="cals" placeholder="Calores" style={{ border: edit ? '1px solid black' : 'None' }}></input>
                <label htmlFor="carbs">Carbs</label>
                <input disabled={!edit} type="text" id="carbs" placeholder="Carbs" style={{ border: edit ? '1px solid black' : 'None' }}></input>
                <label htmlFor="proteins">Proteins</label>
                <input disabled={!edit} type="text" id="proteins" placeholder="Protens" style={{ border: edit ? '1px solid black' : 'None' }}></input>
                <label htmlFor="fats">Fats</label>
                <input disabled={!edit} type="text" id="fats" placeholder="Fats" style={{ border: edit ? '1px solid black' : 'None' }}  ></input>
            </div>
            <div className="profile-btns">
                <IconButton style={ {display: edit ? 'block' : 'None'}} onClick={() => setEdit(false)} aria-label="save">
                    <SaveIcon />
                </IconButton>
            </div>
        </div>
    );
}

export default Profile; 