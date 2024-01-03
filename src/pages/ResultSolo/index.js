import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import './styles.css'; // 使用相同的样式文件
import goodJobImage from '../../assets/images/goodjob.gif';


function ResultSolo() {
    const email = useLocation().state.email;
    const time = useLocation().state.time;
    const correctChars = useLocation().state.correctChars;
    const totalChars = useLocation().state.totalChars;
    const navigate = useNavigate();

    // 计算结果
    const cps = time > 0 ? parseInt(correctChars / time, 10) : 0;  // Number of characters per second
    const accuracy = totalChars > 0 ? ((correctChars / totalChars) * 100).toFixed(2) + '%' : '0%';  // Accuracy
    
    console.log(email);
    console.log(time);
    console.log(correctChars);
    console.log(totalChars);

    // 假设这些数据将从后端获取
    const resultData = {
        cps:  cps,  // char per second
        time: time.toString() + " seconds",  // time
        correctCharacters: correctChars,  // number of correct characters
        totalCharacters: totalChars,  // number of total characters
        accuracy: accuracy, // accuracy
    };

    const handleGoBack = () => {
        navigate('/home', { state: { email: email } });  // 返回到练习界面
    };

    return (
        <div className="practice-container">
            <header>
                <Tooltip title="Back">
                    <Button
                        startIcon={<ArrowCircleLeftIcon style={{ color: '#e27396', fontSize: '2rem' }} />}  
                        onClick={handleGoBack}
                        className="arrow-left-icon"
                    >
                    </Button>
                </Tooltip>
                <h1 className="practice-title">Practice Solo</h1>
            </header>
            <div className="image-container"> 
                <img src={goodJobImage} alt="Good Job" />
            </div>
            <div className="content result-content">
                <Typography variant="h4" style={{ color: 'green', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
                    {resultData.cps} CPS
                </Typography>
                <Typography variant="body1" style={{ color: 'grey', textAlign: 'center' }}>
                    (characters per second)
                </Typography>
                <Typography variant="body2" style={{ textAlign: 'center', marginTop: '20px' }}>
                    Time: {resultData.time}
                </Typography>
                <Typography variant="body2" style={{ textAlign: 'center' }}>
                    Correct Characters: {resultData.correctCharacters}
                </Typography>
                <Typography variant="body2" style={{ textAlign: 'center' }}>
                    Total Characters: {resultData.totalCharacters}
                </Typography>
                <Typography variant="body2" style={{ textAlign: 'center' }}>
                    Accuracy: {resultData.accuracy}
                </Typography>
            </div>
        </div>
    );
}

export default ResultSolo;
