import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import LandingPage from './pages/LandingPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import PracticeYourself from './pages/PracticeYourself';
import { useLocation } from 'react-router-dom';
import './App.css'; 
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import LoginSignup from './pages/LoginSignup';
import RaceWithFriend from './pages/RaceWithFriend';
import FriendsList from './pages/FriendsList';
import Settings from './pages/Settings';
import { UserAvatarProvider } from './contexts/UserAvatarContext';
import ResultSolo from './pages/ResultSolo';
import ResultGame from './pages/ResultGame';

import Ranking from './pages/RankingPage';
import History from './pages/TypingHistory';


function ContentContainer({ children, theme, setTheme, email }) {
  useEffect(() => {
    // Perform actions when the prop changes
    console.log("Log::contentContainer::email changed:" + email);
  }, [email]);

  const location = useLocation();
  const pathsToShowHeader = [
        '/home', 
        '/practice-yourself', 
        '/race-with-friend',
        '/friends',
        '/settings',
      '/result-solo',
    '/result-game', 
    '/ranking', '/history', '/list'];
  const showHeader = pathsToShowHeader.includes(location.pathname);

  return (
      <div className="App">
          {showHeader && <Header theme={theme} setTheme={setTheme} email={email}/>}
          <div className="content-below-header">
              {location.pathname === '/home' && <SideMenu email={email}/>}
              <div className="ContentContainer">
                  {children}
              </div>
          </div>
      </div>
  );
}


function App() {
  const [email, setEmail] = useState(""); // session management
  // 在这里添加 console.log 语句
  console.log('API Key:', process.env.REACT_APP_OPENAI_API_KEY );
  // console.log('API Key:', process.env.REACT_APP_OPENAI_API_KEY || 'No API Key');

  const [theme, setTheme] = useState('PinkGradient'); // Manage the theme status

  const updateEmail = async (email) => {
    await setEmail(email);
  };
  useEffect(() => {
    // Perform actions when the prop changes
    console.log("Log::app::email changed:" + email);
  }, [email]);
  
return (
  <UserAvatarProvider> 
  <Router>
    <div className="App">
      <ContentContainer theme={theme} setTheme={setTheme} email={email}>
      {/* <Header theme={theme} setTheme={setTheme} />  */}
        <Routes>
          <Route path="/" element={<LoginSignup/>} />
          <Route path="/home" element={<LandingPage updateEmail={updateEmail}/>} />
          <Route path="/practice-yourself" element={<PracticeYourself theme={theme} />} /> {/* Pass theme to  PracticeYourself */}
          <Route path="/race-with-friend" element={<RaceWithFriend theme={theme} />} />
          {/* <Route path="/race-with-friend" element={<RaceWithFriend theme="blue" />} />
          <Route path="/race-with-friend" element={<RaceWithFriend />} /> */}
          <Route path="/friends" element={<FriendsList theme={theme}/>} />
          {/* <Route path="/friends" element={<FriendsList theme="pink" />} />
          <Route path="/friends" element={<FriendsList theme="blue" />} /> */}
          <Route path="/settings" element={<Settings theme={theme} />} />
          {/* <Route path="/settings" element={<Settings theme="blue" />} /> */}
          <Route path="/signin" element={<SignIn />} theme={theme}/>
          <Route path="/signup" element={<SignUp />} theme={theme}/>
          <Route path="/result-solo" element={<ResultSolo theme={theme}/>} />
          {/* <Route path="/result-solo" element={<ResultSolo theme="blue"/>} /> */}

          <Route path="/result-game" element={<ResultGame theme={theme}/>} />
          {/* <Route path="/result-game" element={<ResultGame theme="blue"/>} /> */}

          <Route path="/ranking" element={<Ranking theme={theme}/>} />
          <Route path="/history" element={<History theme={theme}/>} />
          {/* <Route path="/list" element={<FriendList />} /> */}
        </Routes>
      </ContentContainer>
    </div>
  </Router>
  </UserAvatarProvider>
);
}



export default App;