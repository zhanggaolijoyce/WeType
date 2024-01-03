import React, { useState, useEffect } from 'react';
import './styles.css';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

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

function LandingPage(props) {
  const email = useLocation().state.email;
  console.log("Log::home::account logged in: " + email);
  props.updateEmail(email);

  const [profile, setProfile] = useState(0);

  useEffect(() => {
    const handleFetchUserInfo = async () => {
      if(!email){
        console.log("Error::home::invalid account.");
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
            console.log("Error::home::fetch account info unsuccessfully, please re-login.");
            return 0;
          }

          console.log("Log::home::successfully fetch account info.");
          setProfile(response);
      } catch(error){
          console.log('Error::home::', error);
          return 0;
      }
    };
    handleFetchUserInfo();
  }, []);

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="main-content">
          <h2 id="slogan">Type Faster, work smarter</h2>
          <div className="practice-info">
            <span className="icon"><HourglassTopIcon fontSize="inherit" /></span>
            <span className="text">In total, you have practiced:</span>
          </div>
          <p className="duration"> {profile == 0 ? '0' : profile.total_practice_time.toString()} seconds</p>
          <div className="buttons">
            <Link to="/practice-yourself" className="large-button"  state={{ email: email }}>Practice Solo</Link>
            <Link to="/race-with-friend" className="large-button" state={{ email: email }}>Race with Friend</Link>
          </div>
          <div className="copyright">
            copyright @WeType 
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

