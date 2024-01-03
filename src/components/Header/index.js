import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate 钩子
import './styles.css';
import Dropdown from 'react-bootstrap/Dropdown';

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

function Header({theme, setTheme, email}) {
  const [profile, setProfile] = useState({});
  const navigate = useNavigate(); // Create a navigate instance

  const handleLogout = () => {
    // Redirect to the homepage
    navigate('/');
  }

  useEffect(() => {
    const handleFetchUserInfo = async () => {
      if(!email){
        console.log("Error::header::invalid account.");
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
            console.log("Error::header::fetch account info unsuccessfully, please re-login.");
            return 0;
          }

          console.log("Log::header::successfully fetch account info.");
          console.log(response);
          setProfile(response);
          if(response.preferred_style == 1){
            handleThemeChange('blueGradient');
          }
      } catch(error){
          console.log('Error::header::', error);
          return 0;
      }
    };
    // Perform actions when the prop changes
    console.log("Log::header::email changed:" + email);
    handleFetchUserInfo();
  }, [email]);

  


  useEffect(() => {
    if (theme === 'blueGradient') {
      document.body.style.background = 'linear-gradient(#87CEEB, #E0F7FF)';
    } else if (theme === 'PinkGradient') {
      document.body.style.background = 'linear-gradient(to bottom, #eacbcd 0%, #eacbcd 70%, rgba(234, 203, 189, 0.3) 100%)';
    }
    document.documentElement.setAttribute('data-theme', theme); 
  }, [theme]);

  const handleEditPreferredStyle = async (style) =>{
    const query = `
        mutation editProfile($email: String!, $name: String, $preferred_style: Int, $avatar: Int) {
          editProfile(email: $email, name: $name, preferred_style: $preferred_style, avatar: $avatar) 
        }
    `; 

    const variables = {
      email: email,
      name: null,
      avatar: null,
      preferred_style: style
    };

    let response = 0;

    try{
        response = await graphQLFetch(query, variables);
        response = response.editProfile;
    } catch(error){
        console.log('Error::editProfilePreferredStyle::', error);
        return;
    }

    if(response == 1){
        // success
        console.log("Log::editProfilePreferredStyle::editted successfully.");
    }
    else if(response == -1){
        console.log("Error::editProfilePreferredStyle::user not found.");
        return;
    }
    else if(response == 2){
      console.log("Log::editProfilePreferredStyle::nothing changed.");
      return;
    }
    else{
        console.log("Error::editProfilePreferredStyle::edit unsuccessfully.");
        return;
    }
  }

  const handleThemeChange = async (selectedTheme) => {
    profile.preferred_style = selectedTheme == "PinkGradient" ? 0 : 1;
    setTheme(selectedTheme);
  }

  const handleFullStackThemeChange = async(selectedTheme)=>{
    handleThemeChange(selectedTheme);
    handleEditPreferredStyle(selectedTheme == "PinkGradient" ? 0 : 1);
  }

  const handleSettingsClick = () => {
    navigate('/settings', { state: { email: email } }); // 跳转到 Settings 组件
  };

  return (
    <div className="header" role="banner">
      <div className="logo-section">
        <h1 className="website-name">WeType</h1>
      </div>

      <div className="controls">
        <div className="custom-dropdown theme-dropdown">
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="themebutton">
              Theme
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFullStackThemeChange('blueGradient')}>
                💙 Blue
              </Dropdown.Item>

              <Dropdown.Item onClick={() => handleFullStackThemeChange('PinkGradient')}>
                💖 Pink
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="custom-dropdown user-dropdown">
          <Dropdown className="user-dropdown">
            <Dropdown.Toggle variant="secondary" id="user-dropdown-basic" className="userbutton">
              {profile.name}
            </Dropdown.Toggle>

            <Dropdown.Menu id="user-dropdown-menu">
              <Dropdown.Item onClick={handleSettingsClick}>⚙️ Setting</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>🔚 Log out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default Header;