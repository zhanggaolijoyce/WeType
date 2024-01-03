import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate, useLocation } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import yellowCarImage from '../../assets/images/yellow_car.png';
import pinkCarImage from '../../assets/images/pink_car.png';

import './styles.css';

function RaceProgress() {

    // 示例数据，您可以根据需要调整
    const racers = [
        {name: 'Maddie', carType: 'friend-car'},
        {name: 'Joyce', carType: 'my-car'}
    ];

    const getCarImage = (carType) => {
        return carType === 'friend-car' ? yellowCarImage : pinkCarImage;
    };

    return (
        <div className="race-progress">
            {racers.map((racer, index) => (
                <Box key={index} display="flex" alignItems="center" mb={1}>
                    <div className="user-name">{racer.name}</div>
                    <div style={{ backgroundImage: `url(${getCarImage(racer.carType)})`, width: '50px', height: '40px', backgroundSize: 'cover'  }}></div>
                </Box>
            ))}
        </div>
    );
}

function RaceWithFriends({theme}) {

    const userEmail = useLocation().state.email;

    const navigate = useNavigate();
    const [open, setOpen] = useState(true); // Control the pop-up display
    const [email, setEmail] = useState(''); // Store the input email
    const [emailError, setEmailError] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);  // Close the confirmation information pop-up window
    const backButtonColor = theme === 'PinkGradient' ? '#e27396' : '#007bff';

    

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleEmailSubmit = () => {
        if (isValidEmail(email)) {
            setEmailError(false);
            setOpen(false);
            setConfirmationOpen(true); // Open the confirmation pop-up window
            // TODO: 在这里添加后端通信代码 (记得做验证，如果好友列表没有这号人，提示没有添加这个人为好友)
        } else {
            setEmailError(true);  // Set the email error status
        }
    };

    const handleConfirmationClose = () => {
        setConfirmationOpen(false);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        if (emailError) setEmailError(false);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleGoBack = () => {
        navigate('/home', { state: {email: userEmail } });  // Navigate with the function
    }

    const generateColoredText = (text) => {
        const colors = ['#ffccd5', '#a6d7a1'];
        return text.split('').map((char, index) => (
            <span key={index} style={{ backgroundColor: index < 5 ? '#ffccd5' : index === 5 ? '#a6d7a1' : 'transparent', }}>{char}</span>
        ));
    };

    
     // 添加的跳转函数，为了展示result
    const navigateToResult = () => {
            navigate('/result-game',  { state: {email: userEmail } }); 
    };


    return (
        <div className="practice-container">
            {/* Pop-up window components */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Invite a Friend</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the email of the friend you wish to race with:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={handleEmailChange}
                        error={emailError} // Set the error according to the mailbox error status
                        helperText={emailError ? "Please enter a valid email format" : ""} // Display error message
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleEmailSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>

            {/* 确认信息的弹窗 */}
            <Dialog open={confirmationOpen} onClose={handleConfirmationClose}>
                <DialogTitle>Invitation Sent</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The invitation has been sent to your friend!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmationClose}>OK</Button>
                </DialogActions>
            </Dialog>

            <header>
            <Tooltip title="Back">
                <Button
                    startIcon={<ArrowCircleLeftIcon style={{ color: backButtonColor, fontSize: '2rem' }} />}  
                    onClick={handleGoBack}
                    className="arrow-left-icon"
                >
                </Button>
            </Tooltip>

                <h1 className="practice-title">Race with Friend</h1>
            </header>
            <div className="content">
                <div className="timer-container race-timer-container">
                    <RaceProgress />
                </div>
                <div className="text-sample">
                    <div>
                    {generateColoredText('The sun casts long shadows over the quiet town.')}
                    </div>
                    <div>Birds sing melodies as children play below.</div>
                    <div>A gentle breeze rustles through the autumn leaves.</div>
                    <div>Near the river, a cat watches a fish swim by.</div>
                    <div>Time seems to pause, capturing this peaceful.</div>
                </div>
                <div className="textarea-wrapper">
                    <textarea placeholder="Enter the text here...."></textarea>
                </div>

                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={navigateToResult}
                    style={{ marginTop: '20px' }} // 可以调整样式
                >
                    View the Result
                </Button>
            </div>
        </div>
    );
}

export default RaceWithFriends;

