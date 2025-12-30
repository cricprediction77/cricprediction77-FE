import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getTeamLogo,
  getLeagueLogo,
  getLeagueCup,
} from "../utils/LeagueTeamLogos";
import "./ViewPrediction.css";

function ViewPrediction() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Build teamName -> shortName map
  const teamShortNameMap = {
    "Sylhet Titans": "ST",
    "Rajshahi Warriors": "RW",
    "Noakhali Express": "NE",
    "Chattogram Royals": "CR",
    "Dhaka Capitals": "DC",
    "Rangpur Riders": "RR",
  };

  // Helper to get short name safely
  const getShortName = (teamName) => {
    return teamShortNameMap[teamName] || teamName;
  };

  const match = state?.match;

  if (!match) {
    return <p style={{ textAlign: "center" }}>No prediction data found</p>;
  }

  const [team1, team2] = match.teams?.includes(" vs ")
    ? match.teams.split(" vs ")
    : [match.teams, ""];
  // Format date to DD-MM-YYYY
  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };
  // Add 2 hours 35 minutes to a time (HH:mm)
  const addTwoHoursThirtyFiveMins = (timeStr) => {
    if (!timeStr) return "To Be Updated";

    const [hours, minutes] = timeStr.split(":").map(Number);

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + 155); // 2 hours 35 mins = 155 minutes

    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");

    return `${hh}:${mm}`;
  };
  // Add 2 hours 43 minutes to a time (HH:mm)
  const addTwoHoursFortyThreeMins = (timeStr) => {
    if (!timeStr) return "To Be Updated";

    const [hours, minutes] = timeStr.split(":").map(Number);

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + 163); // 2h 43m = 163 minutes

    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");

    return `${hh}:${mm}`;
  };

  return (
    <div className="card-wrapper">
      <div className="match-card">
        {/* League Header */}
        <div className="match-header">
          {match.leagueType} <br /> Match {match.matchNumber}
        </div>

        {/* Match Content */}
        <div className="match-frame">
          <div className="match-content">
            {/* Team 1 */}
            <div className="team-section">
              <div className="logo-glow">
                <img
                  src={getTeamLogo(match.leagueType, team1)}
                  alt={team1}
                  className="team-logo"
                />
              </div>
              <h2 className="team-title">{getShortName(team1)}</h2>
              <p className="team-score">{match.team1Score || "-- / --"}</p>
            </div>

            {/* VS Section */}
            <div className="vs-section">
              <h1 className="vs-text">VS</h1>
              <b className="match-time">
                {formatDateDDMMYYYY(match.matchDate)} <br />
                {match.approxStartTime}
              </b>
            </div>

            {/* Team 2 */}
            {team2 && (
              <div className="team-section">
                <div className="logo-glow">
                  <img
                    src={getTeamLogo(match.leagueType, team2)}
                    alt={team2}
                    className="team-logo"
                  />
                </div>
                <h2 className="team-title">{getShortName(team2)}</h2>
                <p className="team-score">{match.team2Score || "-- / --"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Prediction Info */}
        <div className="prediction-info">
          <div className="toss-card">
            <h3 className="toss-title">Toss Winner</h3>

            <p className="toss-updated">
              Last Updated On : {formatDateDDMMYYYY(match.matchDate)} | |{" "}
              {match.tossUpdatedAt
                ? match.tossUpdatedAt
                : addTwoHoursThirtyFiveMins(match.approxStartTime)}
              :00
            </p>

            <div className="toss-divider"></div>

            <div className="toss-logo-wrapper">
              <img
                src={getTeamLogo(match.leagueType, match.tossWinner)}
                alt={match.tossWinner}
                className="toss-logo"
              />
            </div>

            <p className="toss-result">
              <span>{match.tossWinner || "TBD"}</span> WILL WIN THE TOSS.
            </p>
          </div>

          <div className="match-winner-card">
            <h3 className="match-winner-title">Match Winner</h3>

            <p className="match-winner-updated">
              Last Updated On : {formatDateDDMMYYYY(match.matchDate)} | |{" "}
              {match.matchWinnerUpdatedAt
                ? match.matchWinnerUpdatedAt
                : addTwoHoursFortyThreeMins(match.approxStartTime)}
              :00
            </p>

            <div className="match-winner-divider"></div>

            <div className="winner-section">
              <div className="winner-logo-wrapper">
                {/* League logo – RIGHT of winner shield */}
                {getLeagueLogo(match.leagueType) && (
                  <img
                    src="https://dko97fmntp7zh.cloudfront.net/7a60c04b-3492-4997-a1b8-78d80dbc9fe8_1000644918.png"
                    alt="App Logo"
                    className="app-logo"
                  />
                )}

                {/* Winner logo – center */}
                <img
                  src={getTeamLogo(match.leagueType, match.matchWinner)}
                  alt={match.matchWinner}
                  className="winner-shield"
                />

                {/* App logo – LEFT of winner shield */}

                <img
                  src={getLeagueLogo(match.leagueType)}
                  alt="League Logo"
                  className="league-logo"
                />
              </div>
            </div>

            <p className="match-winner-result">
              <span>{match.matchWinner || "TBD"}</span> WILL WIN THE MATCH.
            </p>
          </div>

          <div className="session-lambi-card">
  <h3 className="session-lambi-title">SESSION & LAMBI</h3>

  <div className="session-lambi-divider"></div>

  {Array.isArray(match.sessionDetails) &&
  match.sessionDetails.length > 0 ? (
    match.sessionDetails.map((item, i) => (
      <div className="session-item" key={i}>
        <p className="session-text">
          • {item.sessionText}
        </p>

        {item.updatedAt && (
          <p className="session-updated">
            {item.updatedAt}
          </p>
        )}
      </div>
    ))
  ) : (
    <div className="session-item">
      <p className="session-text">
        Session details will be updated soon
      </p>
    </div>
  )}
</div>

        </div>

        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
}

export default ViewPrediction;
