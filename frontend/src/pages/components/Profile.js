import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ProfileIconMenu from "./ProfileIconMenu";

const images = [require("../../icons/003-carrot.png"),
                require("../../icons/001-broccoli.png"),
                require("../../icons/002-cabbage.png"),
                require("../../icons/004-eggplant.png"),
                require("../../icons/005-corn.png"),
                require("../../icons/006-pumpkin.png"),
                require("../../icons/007-onion.png"),
                require("../../icons/008-bell-pepper.png"),
                require("../../icons/009-potato.png"),
                require("../../icons/010-tomato.png")
];

function Profile({ userData, setUserData }){
    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [calories, setCalories] = useState(userData.cal_goal);
    const [carbs, setCarbs] = useState(userData.carb_goal);
    const [protein, setProtein] = useState(userData.protein_goal);
    const [fat, setFat] = useState(userData.fat_goal);

    const [edit, setEdit] = useState(false);
    const [editIcon, setEditIcon] = useState(false);

    const [pic, setPic] = useState(userData.icon_id ? userData.icon_id : 0)

    const handleSave = async () => { 
        // Update User Info in database
        let data = {
            'username': name,
            'email' : email,
            'password': userData.password,
            'cal_goal': calories,
            'carb_goal': carbs,
            'protein_goal': protein,
            'fat_goal': fat
        }
        
        const res = await fetch('/api/update/user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // Display Error Messages
        if(!res.ok && res.status !== 404){
            const res_json = await res.json();
            alert(res_json.message);

        // Success
        } else {
            // Update User Info on front-end
            setUserData({
                ...userData,
                'username': name,
                'email' : email,
                'password': userData.password,
                'cal_goal': calories,
                'carb_goal': carbs,
                'protein_goal': protein,
                'fat_goal': fat
            })

            // End Editing
            setEdit(false)
        }
    };

    return (
        <div className="profile-bar">
            <ProfileIconMenu userData={userData} setUserData={setUserData} setPic={setPic} trigger={editIcon} setTrigger={setEditIcon}>
                
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
            <h3>{userData.name ? userData.name : "Username"}</h3>
            <IconButton style={ {position : "absolute" , right : "3%" , top: "29%", display: !edit ? 'block' : 'None'}} onClick={() => setEdit(true)} aria-label="edit">
                    <EditIcon />
            </IconButton>
            <div className="hr-text">
                <h3>Info</h3>   
                <hr></hr>
            </div>
            <div className="profile-attribute profile">
                <label htmlFor="name">Username</label>
                <input disabled={!edit} type="text" id="name" placeholder={userData.name ? userData.name : "Username"} style={{ border: edit ? '1px solid black' : 'None', color: '#e87b35' }} onChange={(e) => setName(e.target.value)}></input>
                <label htmlFor="email">Email</label>
                <input disabled={!edit} type="text" id="email" placeholder={userData.email ? userData.email : "Email"} style={{ border: edit ? '1px solid black' : 'None', color: '#e87b35' }} onChange={(e) => setEmail(e.target.value)}></input>
            </div>
            <div className="hr-text">
                <h3>Daily Goals</h3>      
                <hr></hr>
            </div>
            <div className="profile-attribute profile">
                <label htmlFor="cals">Calories</label>
                <input disabled={!edit} type="text" id="cals" placeholder={userData.cal_goal ? userData.cal_goal : "Calories"} style={{ border: edit ? '1px solid black' : 'None', color: '#e87b35' }} onChange={(e) => setCalories(e.target.value)}></input>
                <label htmlFor="carbs">Carbs (g)</label>
                <input disabled={!edit} type="text" id="carbs" placeholder={userData.carb_goal ? userData.carb_goal : "Carbs"} style={{ border: edit ? '1px solid black' : 'None', color: '#e87b35' }} onChange={(e) => setCarbs(e.target.value)}></input>
                <label htmlFor="proteins">Protein (g)</label>
                <input disabled={!edit} type="text" id="proteins" placeholder={userData.protein_goal ? userData.protein_goal : "Protein"} style={{ border: edit ? '1px solid black' : 'None', color: '#e87b35' }} onChange={(e) => setProtein(e.target.value)}></input>
                <label htmlFor="fats">Fats (g)</label>
                <input disabled={!edit} type="text" id="fats" placeholder={userData.fat_goal ? userData.fat_goal : "Fats"} style={{ border: edit ? '1px solid black' : 'None', color: '#e87b35' }} onChange={(e) => setFat(e.target.value)}></input>
            </div>
            <div className="profile-btns">
                <IconButton style={ {display: edit ? 'block' : 'None'}} onClick={handleSave} aria-label="save">
                    <SaveIcon />
                </IconButton>
            </div>
        </div>
    );
}

export default Profile; 