import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useUserAvatar } from '../../contexts/UserAvatarContext';
import './styles.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import avatar1 from '../../assets/images/avatar_1.png'; 
import avatar2 from '../../assets/images/avatar_2.png';
import avatar3 from '../../assets/images/avatar_3.png';
import avatar4 from '../../assets/images/avatar_4.png';
import avatar5 from '../../assets/images/avatar_5.png';
import avatar6 from '../../assets/images/avatar_6.png';
import avatar7 from '../../assets/images/avatar_7.png';
import avatar8 from '../../assets/images/avatar_8.png';
import avatar9 from '../../assets/images/avatar_9.png';

const api_url = "http://localhost:3000/graphql";

async function graphQLFetch(query, variables = {}) {
    try {
      const response = await fetch(api_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
      });
      const body = await response.text();
      if(body == null)
        return null;
      const result = JSON.parse(body);
      /*
      Check for errors in the GraphQL response
      */
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

const availableAvatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
];

function Setting({theme}) {
  const email = useLocation().state.email;
  const { setUserAvatar } = useUserAvatar();
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [textType, setTextType] = useState('News');
  const backButtonColor = theme === 'PinkGradient'  ? '#e27396' : '#007bff'; // Set the return key color according to the theme
  const [showSuccessDialog, setShowSuccessDialog] = useState(false); // New status to control pop-up display


  const handleGoBack = () => {
    navigate('/home', { state: { email: email } });
  };

  const selectAvatar = (avatar) => {
    console.log(avatar.slice(-5, -4));
    setUserAvatar(avatar);
    setSelectedAvatar(avatar);
  };

  const handleEditAvatar = async (avatarId) =>{
    const query = `
        mutation editProfile($email: String!, $name: String, $preferred_style: Int, $avatar: Int) {
          editProfile(email: $email, name: $name, preferred_style: $preferred_style, avatar: $avatar) 
        }
    `; 

    const variables = {
      email: email,
      name: null,
      avatar: avatarId,
      preferred_style: null
    };

    let response = 0;

    try{
        response = await graphQLFetch(query, variables);
        response = response.editProfile;
    } catch(error){
        console.log('Error::editProfileAvatar::', error);
        return;
    }

    if(response == 1){
        // success
        console.log("Log::editProfileAvatar::editted successfully.");
    }
    else if(response == -1){
        console.log("Error::editProfileAvatar::user not found.");
        return;
    }
    else if(response == 2){
      console.log("Log::editProfileAvatar::nothing changed.");
      return;
    }
    else{
        console.log("Error::editProfileAvatar::edit unsuccessfully.");
        return;
    }
  }

  const saveSettings = async () => {
    // Save the text type selected by the user in the local storage
    localStorage.setItem('textType', textType);
    console.log('Settings saved:', { textType });
  
    // If the user selects the avatar, save the avatar settings.
    if (selectedAvatar != null) {
      const avatarId = parseInt(selectedAvatar.slice(-5, -4));
      await handleEditAvatar(avatarId);
    }
  
    // Display the pop-up window
    setShowSuccessDialog(true);
  };
  

  // The function of closing the pop-up window
    const handleCloseSuccessDialog = () => {
        setShowSuccessDialog(false);
    };


  return (
    <div className="practice-container">
      <header>
        <Tooltip title="Back">
          <Button
            startIcon={<ArrowCircleLeftIcon style={{ color: backButtonColor, fontSize: '2rem' }} />}
            onClick={handleGoBack}
            className="arrow-left-icon"
          />
        </Tooltip>
        <h1 className="practice-title">Settings</h1>
      </header>
      <div className="content">
        <div className="avatar-selection">
          <p>Choose Avatar:</p>
          {availableAvatars.map(avatar => (
            <img
              key={avatar}
              src={avatar}
              alt="Avatar"
              onClick={() => selectAvatar(avatar)}
              className={`selectable-avatar ${avatar === selectedAvatar ? 'selected-avatar' : ''}`}
            />
          ))}
        </div>
        <div className="setting-section">
          <label>Text Type:</label>
          <select
            value={textType}
            onChange={(e) => setTextType(e.target.value)}
            className="styled-select"
          >
            <option value="News">News</option>
            <option value="Story">Story</option>
            <option value="Poetry">Poetry</option>
            <option value="Travel Guides">Travel Guides</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Movie Scripts">Movie Scripts</option>
          </select>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={saveSettings}
        >
          Save Settings
        </Button>
      </div>
        {/* Successfully save the pop-up window */}
            <Dialog open={showSuccessDialog} onClose={handleCloseSuccessDialog}>
                <DialogTitle>Settings Updated</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your settings have been successfully updated.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSuccessDialog}>OK</Button>
                </DialogActions>
          </Dialog>
    </div>
  );
}

export default Setting;

