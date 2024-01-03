import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./styles.css";

const api_url = "http://localhost:3000/graphql";

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch(api_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    const body = await response.text();
    if (body == null) return null;
    const result = JSON.parse(body);
    /*
    Check for errors in the GraphQL response
    */
    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == "BAD_USER_INPUT") {
        const details = error.extensions.exception.errors.join("\n ");
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

const History = ({ theme }) => {
  const email = useLocation().state.email;

  const [historyData, setHistoryData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const backButtonColor = theme === "PinkGradient" ? "#e27396" : "#007bff"; //Set the return key color according to the theme

  useEffect(() => {
    const handleFetchUserInfo = async () => {
      if (!email) {
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
        email: email,
      };

      let response = 0;
      try {
        response = await graphQLFetch(fetchQuery, variables);
        response = response.fetchUserInfo;

        if (!response) {
          console.log(
            "Error::history::fetch account info unsuccessfully, please re-login."
          );
          return 0;
        }

        console.log("Log::history::successfully fetch account info.");
        setProfile(response);
      } catch (error) {
        console.log("Error::history::", error);
        return 0;
      }
    };
    handleFetchUserInfo();
  }, []);

  const handleGoBack = () => {
    navigate("/home", { state: { email: email } });
  };

  // Calculate the total exercise count for the past three months
  const currentDate = new Date();
  const threeMonthsAgo = new Date(currentDate);
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

  const totalExerciseCount = historyData.reduce((acc, entry) => {
    const entryDate = new Date(entry.date);
    if (entryDate >= threeMonthsAgo && entryDate <= currentDate) {
      return acc + entry.count;
    }
    return acc;
  }, 0);

  useEffect(() => {
    const h = profile.history;
    if (!h) return;

    let dummyData = [];
    for (let i = 0; i < h.key.length; i++) {
      dummyData.push({
        date: h.key[i],
        count: h.value[i],
      });
    }
    console.log(dummyData);
    // const dummyData = [
    //   { date: "2023-9-30", count: 2 },
    //   { date: "2023-11-20", count: 3 },
    //   { date: "2023-11-21", count: 5 },
    //   { date: "2023-11-22", count: 2 },
    //   // ... more data
    // ];
    setHistoryData(dummyData);
  }, [profile]);

  

  return (
    <div className="overall-container">
      <div className="back-header">
        <Tooltip title="Back">
          <Button
            startIcon={
              <ArrowCircleLeftIcon
                style={{ color: backButtonColor, fontSize: "2rem" }}
              />
            }
            onClick={handleGoBack}
            className="arrow-left-icon"
          ></Button>
        </Tooltip>
        <h2 className="back-title">Typing History</h2>
      </div>
      <div className="history-container">
        <p className="good-job">👍 Good Job!</p>
        <p className="history-text">
          Your Total Exercise Count for the Past Three Months:{" "}
          {totalExerciseCount}
        </p>
        <div
          onMouseOut={() => {
            setTooltipContent(null);
          }}
        >
          <CalendarHeatmap
            startDate={threeMonthsAgo}
            endDate={currentDate}
            values={historyData.map((day) => ({
              date: new Date(day.date),
              count: day.count,
            }))}
            classForValue={(value) => {
              if (!value) {
                return "color-empty";
              }
              return `color-github-${value.count}`;
            }}
            onMouseOver={(event, value) => {
              if (value) {
                setTooltipContent(
                  `Date: ${value.date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}  ${value.date.toLocaleDateString("en-US", {
                    weekday: "long",
                  })}, Exercise Count: ${value.count}`
                );
              }
            }}
            onMouseOut={() => {
              setTooltipContent(null);
            }}
          />
          {tooltipContent && (
            <Tooltip title={tooltipContent}>
              <div>
                <p>{tooltipContent}</p>
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
