import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate 钩子
import "./styles.css";
import { Link } from 'react-router-dom';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import GroupIcon from "@mui/icons-material/Group";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import Divider from "@mui/material/Divider";
import TypingAnimation from '../../assets/images/typing.gif';
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

  const avatars = {
    '1': avatar1,
    '2': avatar2,
    '3': avatar3,
    '4': avatar4,
    '5': avatar5,
    '6': avatar6,
    '7': avatar7,
    '8': avatar8,
    '9': avatar9,
  };

function SideMenu({email}) {
  useEffect(() => {
    console.log("Log::sidemenu::email changed:" + email);
  }, [email]);

  const [activePage, setActivePage] = useState("");

  const [profile, setProfile] = useState({});
  const navigate = useNavigate(); // 创建 navigate 实例

  useEffect(() => {
    const handleFetchUserInfo = async () => {
      if(!email){
        console.log("Error::sidemenu::invalid account.");
      }

      const fetchQuery = `
        query fetchUserInfo($email: String!) {
          fetchUserInfo(email: $email) { 
            name,
            avatar,
            preferred_style,
            history{
              key,
              value
            },
            total_practice_time,
            total_practice_words,
            friends,
          }
        }
      `;

      const variables = {
        email: email
      };

      let response = 0;
      try{
          response = await graphQLFetch(fetchQuery, variables);
          response = response.fetchUserInfo;

          if(!response){
            console.log("Error::sidemenu::fetch account info unsuccessfully, please re-login.");
            return 0;
          }

          console.log("Log::sidemenu::successfully fetch account info.");
          setProfile(response);
      } catch(error){
          console.log('Error::sidemenu::', error);
          return 0;
      }
    };
    handleFetchUserInfo();
  }, [email]);

    
    const handleClick = (page) => {
        setActivePage(page);
        if (page === 'Friend List') {
            navigate('/friends', { state: { email: email } }); // 跳转到 Friend List 组件
        }
    };


  // todo: 根据profile.avatar设置头像
  return (
    <div className="sidemenu">
      {/* <div className="avatar" style={{ backgroundImage: `url(${profile.avatar ? `../../assets/images/avatar_${profile.avatar}.png` : defaultAvatar})` }}></div> */}
      <div className="avatar" style={{ backgroundImage: `url(${profile.avatar ? avatars[profile.avatar] : avatars['1']})` }}></div>

      <List>
        <ListItem component={Link} to="/history" className="custom-link" state={{email: email}}>
          <ListItemIcon className="icon-padding">
            <KeyboardIcon />
          </ListItemIcon>
          <ListItemText primary="Typing History" />
        </ListItem>
        <Divider style={{ borderWidth: "1px", borderColor: "#aaa" }}/>
        <ListItem component={Link} to="/friends" className="custom-link"  state={{email: email}}>
          <ListItemIcon className="icon-padding">
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Friend List" />
        </ListItem>
        <Divider style={{ borderWidth: "1px", borderColor: "#aaa" }}/>
        <ListItem component={Link} to="/ranking" className="custom-link"  state={{email: email}}>
          <ListItemIcon className="icon-padding">
            <MilitaryTechIcon />
          </ListItemIcon>
          <ListItemText primary="Ranking" />
        </ListItem>
      </List>
      <div className="typing-gif-container">
        <img src={TypingAnimation} alt="Typing Animation" />
      </div>

    </div>
  );
}

export default SideMenu;
