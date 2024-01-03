import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import './styles.css'; 
import avatar1 from '../../assets/images/avatar_1.png'; // 为了展示，后端弄好以后就可以删掉
import avatar2 from '../../assets/images/avatar_2.png'; // 为了展示，后端弄好以后就可以删掉
import winnerImage from '../../assets/images/winner.png'; 
import confettiAnimation from '../../assets/images/confetti_animation.gif';


function ResultGame() {
    const userEmail = useLocation().state.email;
    const navigate = useNavigate();

    // Hypothetical user data and results
    const users = [
        { id: 1, name: 'Alice', speed: 27, correctWords: 25, wrongWords: 5, accuracy: 80.61, avatar: avatar1 },
        { id: 2, name: 'Bob', speed: 30, correctWords: 28, wrongWords: 3, accuracy: 85, avatar: avatar2 }
    ];

    // Calculate the winner
    const winnerIndex = users[0].accuracy > users[1].accuracy ? 0 : 1;
    const winnerName = users[winnerIndex].name; // Get the winner's name

    const handleGoBack = () => {
        navigate('/home', { state: {email: userEmail } }); 
    };

    return (
        <div className="practice-container">
            <div className="confetti-container">
                <img src={confettiAnimation} alt="Confetti" className="confetti-animation" />
            </div>
            <header>
                <Tooltip title="Back">
                    <Button
                        startIcon={<ArrowCircleLeftIcon style={{ color: '#e27396', fontSize: '2rem' }} />}  
                        onClick={handleGoBack}
                        className="arrow-left-icon"
                    >
                    </Button>
                </Tooltip>
                <h1 className="practice-title">Race with Friend</h1>
            </header>
            <div className="content result-game-content">
                <div className="user-results">
                    {users.map((user, index) => (
                        <div key={index} className="user-result">
                            <img src={user.avatar} alt={`Avatar of ${user.name}`} className="user-avatar" />
                            {index === winnerIndex && <span className="winner-crown">👑</span>}
                            <Typography variant="h6">{user.name}</Typography>
                            <Typography variant="body2">Speed: {user.speed} WPM</Typography>
                            <Typography variant="body2">Correct Words: {user.correctWords}</Typography>
                            <Typography variant="body2">Wrong Words: {user.wrongWords}</Typography>
                            <Typography variant="body2">Accuracy: {user.accuracy}%</Typography>
                        </div>
                    ))}
                </div>
                {/* Winner information display section */}
                <div className="winner-section">
                    <img src={winnerImage} alt="Winner" className="winner-image" />
                    <div className="winner-name">
                        <Typography variant="h4">
                            {winnerName} <span className="emoji">🎉🎉</span>
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultGame;
