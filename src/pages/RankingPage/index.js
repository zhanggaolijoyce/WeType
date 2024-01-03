import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import "./styles.css";

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

const Ranking = ( {theme} ) => {
  const email = useLocation().state.email;

  const [rankings, setRankings] = useState([]);
  const [worldRanking, setWorldRanking] = useState([]);
  const [showFriendsRanking, setShowFriendsRanking] = useState(true);
  const navigate = useNavigate();
  const backButtonColor = theme === 'PinkGradient'  ? '#e27396' : '#007bff'; //Set the return key color according to the theme

  useEffect(() => {
    const handleWorldRankingQuery = async () => {
      const worldRankingQuery = `
        query worldRanking{
          worldRanking { 
            profile{
              name,
              total_practice_time
            }
          }
        }
      `;

      let response = 0;
      try{
          response = await graphQLFetch(worldRankingQuery);
          response = response.worldRanking;

          if(!response){
            console.log("Error::ranking::fetch world ranking unsuccessfully.");
            return;
          }

          console.log("Log::ranking::successfully fetch world ranking info.");
          response.sort((a, b) => b.profile.total_practice_time - a.profile.total_practice_time);
          response = response.slice(0, 3);
          setWorldRanking(response);
      } catch(error){
          console.log('Error::home::', error);
          return 0;
      }
    }
    handleWorldRankingQuery();
  }, []);

  useEffect(() => {
    console.log(worldRanking);
    let sampleWorldRankings = [];
    for(let i = 0; i < worldRanking.length; i++){
      sampleWorldRankings.push({
        rank: i + 1,
        username: worldRanking[i].profile.name,
        score: worldRanking[i].profile.total_practice_time
      })
    };
    console.log(sampleWorldRankings);

    // 模拟从后端获取排名数据的效果，实际中可能会使用异步请求
    const sampleFriendsRankings = [
      { rank: 1, username: "Friend1", score: 1200 },
      { rank: 2, username: "Friend2", score: 1100 },
      { rank: 3, username: "Friend3", score: 1050 },
      // ... 可以添加更多的好友排名数据
    ];

    // const sampleWorldRankings = [
    //   { rank: 1, username: "User1", score: 1000 },
    //   { rank: 2, username: "User2", score: 950 },
    //   { rank: 3, username: "User3", score: 900 },
    //   // ... 可以添加更多的全球排名数据
    // ];

    setRankings(
      showFriendsRanking ? sampleFriendsRankings : sampleWorldRankings
    );
  }, [showFriendsRanking]);

  const handleShowFriendsRanking = () => {
    setShowFriendsRanking(true);
  };

  const handleShowWorldRanking = () => {
    setShowFriendsRanking(false);
  };

  const handleGoBack = () => {
    navigate("/home", { state: { email: email } }); // Navigate with the function
  };

  return (
    <div className="overall-container">
      <div className="back-header">
        <Tooltip title="Back">
          <Button
            startIcon={
              <ArrowCircleLeftIcon
                style={{ color: backButtonColor , fontSize: "2rem" }}
              />
            }
            onClick={handleGoBack}
            className="arrow-left-icon"
          ></Button>
        </Tooltip>
        <h2 className="back-title">Ranking</h2>
      </div>
      <div className="ranking-container">
        <h1>👑</h1>
        <h1 className="rank-title">Ranking</h1>
        <div>
          <button className="rank-button" onClick={handleShowFriendsRanking}>Friends Ranking</button>
          <button className="rank-button" onClick={handleShowWorldRanking}>World Ranking</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Practice Time (seconds)</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((user, index) => (
              <tr key={index}>
                <td>{user.rank}</td>
                <td>{user.username}</td>
                <td>{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ranking;
