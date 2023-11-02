import carrot from "../../icons/003-carrot.png";
import broccoli from "../../icons/001-broccoli.png";
import cabbage from "../../icons/002-cabbage.png";
import eggplant from "../../icons/004-eggplant.png";
import corn from "../../icons/005-corn.png";
import pumpkin from "../../icons/006-pumpkin.png";
import onion from "../../icons/007-onion.png";
import bellPepper from "../../icons/008-bell-pepper.png";
import potato from "../../icons/009-potato.png";
import tomato from "../../icons/010-tomato.png";

import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';

function ProfileIconMenu(props){

    const [selectedImage, setSelectedImage] = useState(props.userData.icon_id ? props.userData.icon_id : null);

    const images = [carrot, broccoli, cabbage, eggplant, corn, pumpkin, onion, bellPepper, potato, tomato];

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleWindowClose = () => {
        setSelectedImage(null);
        props.setTrigger(false);
    };

    const handleSave = async () => {
        if (!selectedImage) {return;}
        
        // Update icon_id in database
        let data = {
            'username': props.userData ? props.userData.name : '',
            'email' : props.userData ? props.userData.email : '',
            'password': props.userData ? props.userData.password : '',
            'icon_id': selectedImage
        }
        
        const res = await fetch('/api/update/user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // Display Error Messages
        if(!res.ok && res.status != 404){
            const res_json = await res.json();
            alert(res_json.message);

        // Success
        } else {
            // Update Icon on front-end
            props.setUserData({...props.userData, icon_id: selectedImage}); // set user data on frontend
            props.setPic(selectedImage); // update displayed photo - may not be needed because of above.

            // Close Profile Icon Menu
            setSelectedImage(null);
            props.setTrigger(false);
        }
    };

    return (props.trigger) ? (
        <div className="icon-popup">
            <div className="icon-popup-inner">
                <IconButton style={ {display: selectedImage !== null ? 'block' : 'None', right: "16px", top: "16px", position: "absolute"}} onClick={handleSave} aria-label="save">
                    <SaveIcon />
                </IconButton>
                <IconButton  className="popup-close-btn" onClick={handleWindowClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
                <div className="image-grid">
                    {images.map((image, index) => (
                        <div key={index} className="grid-item">
                            <img
                                className={selectedImage === index ? 'selected' : ''}
                                src={image}
                                alt={index}
                                onClick={() => handleImageClick(index)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ) : "";
}

export default ProfileIconMenu;