import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './styles.css';
// import backgroundImage from '../../assets/images/backgroundpicture-modified.jpg';
import backgroundImage from '../../assets/images/backgroundpicture_new.jpg';

function LoginSignup() {
    const navigate = useNavigate();

    const handleSignInClick = () => {
        navigate('/signin');
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    const divStyle = {
        backgroundImage: `url(${backgroundImage})`,
      };

    return (
        <div className="loginSignup-container" style={divStyle}>
            <div className="logo">WeType</div>
            <div className="slogan">
                Type Faster, Work Smarter!
            </div>
            <div className="buttons-container">
                <Button variant="contained" sx={{ backgroundColor: '#9bc6e2', boxShadow: 'none'}} onClick={handleSignInClick}> 
                    Sign In
                </Button>
                <Button id="signupBtn" variant="contained" sx={{ backgroundColor: '#f8acca', boxShadow: 'none'}} onClick={handleSignUpClick}> 
                    Sign Up
                </Button>
            </div>
        </div>
    );
}

export default LoginSignup;



