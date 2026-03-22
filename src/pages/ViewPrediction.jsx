import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { getTeamLogo, getLeagueLogo } from "../utils/LeagueTeamLogos";
import html2canvas from "html2canvas";
import "./ViewPrediction.css";

function ViewPrediction() {
  const { state } = useLocation();

  // ✅ Separate refs for downloads
  const tossMatchRef = useRef(null);
  const sessionRef = useRef(null);

  // Build teamName -> shortName map
  const teamShortNameMap = {
    "Sylhet Titans": "ST",
    "Rajshahi Warriors": "RW",
    "Noakhali Express": "NE",
    "Chattogram Royals": "CR",
    "Dhaka Capitals": "DC",
    "Rangpur Riders": "RR",
    "Mumbai Indians": "MI",
    "Royal Challengers Bengaluru": "RCB",
    "Sunrisers Hyderabad":"SRH",
    "Kolkata Knight Riders":"KKR",
    "Rajasthan Royals":"RR",
    "Chennai Super Kings":"CSK",
    "Punjab Kings":"PBKS",
    "Gujarat Titans":"GT",
    "Lucknow Super Giants":"LSG",
    "UP Warriorz": "UPW",
    "Gujarat Giants": "GG",
    "Delhi Capitals": "DCW",
    "Perth Scorchers": "PS",
    "Sydney Sixers": "SS",
    "Melbourne Renegades": "MR",
    "Brisbane Heat": "BH",
    "Hobart Hurricanes": "HH",
    "Sydney Thunder": "STH",
    "Adelaide Strikers": "AS",
    "Melbourne Stars": "MS",
    "MI Cape Town": "MICT",
    "Durban's Super Giants": "DSG",
    "Pretoria Capitals": "PC",
    "Joburg Super Kings": "JSK",
    "Paarl Royals": "PR",
    "Sunrisers Eastern Cape": "SEC",
    "Auckland Aces": "AUCK",
    "Canterbury Kings": "CANT",
    "Central Stags": "CS",
    "Northern Brave": "NB",
    "Otago Volts": "OTG",
    "Wellington Firebirds": "WEL",
  };

  const getShortName = (teamName) => teamShortNameMap[teamName] || teamName;

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

  // Add 2h 35m
  const addTwoHoursThirtyFiveMins = (timeStr) => {
    if (!timeStr) return "To Be Updated";
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes - 155);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  // Add 2h 43m
  const addTwoHoursFortyThreeMins = (timeStr) => {
    if (!timeStr) return "To Be Updated";
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes - 163);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  // ✅ Common download function
  const downloadByRef = async (ref, fileName) => {
    try {
      const element = ref.current;

      if (!element) {
        alert("Report not found ❌");
        return;
      }

      // export mode for fixed width
      element.classList.add("pdf-mode");

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#121417",
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imgData;
      link.download = fileName;
      link.click();

      element.classList.remove("pdf-mode");
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download report ❌");
    }
  };

  // ✅ Dot-1 (Toss + Match Winner)
  const downloadTossMatchReport = () => {
    downloadByRef(
      tossMatchRef,
      `Toss_Match_Report_${match.leagueType}_Match_${match.matchNumber}.png`
    );
  };

  // ✅ Dot-2 (Session)
  const downloadSessionReport = () => {
    downloadByRef(
      sessionRef,
      `Session_Report_${match.leagueType}_Match_${match.matchNumber}.png`
    );
  };

  return (
    <div className="card-wrapper">
      {/* Prediction Info */}
      <div className="match-card">
        {/* ✅ Green Dot will download this FULL section */}
        <div ref={tossMatchRef} className="pdf-print-area">
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

          {/* ✅ Toss + Match Winner cards */}
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
                  {getLeagueLogo(match.leagueType) && (
                    <img
                      src="https://dko97fmntp7zh.cloudfront.net/3b413458-b112-40e6-89a2-88f4c256d940_1000653499.png"
                      alt="App Logo"
                      className="app-logo"
                    />
                  )}

                  <img
                    src={getTeamLogo(match.leagueType, match.matchWinner)}
                    alt={match.matchWinner}
                    className="winner-shield"
                  />

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
          </div>
        </div>

        {/* ✅ Session separate ref only */}
        <div ref={sessionRef} className="pdf-print-area">
          <div className="prediction-info">
            <div className="session-lambi-card">
              <h3 className="session-lambi-title">SESSION</h3>
              <div className="session-lambi-divider"></div>

              {Array.isArray(match.sessionDetails) &&
              match.sessionDetails.length > 0 ? (
                match.sessionDetails.map((item, i) => (
                  <div className="session-item" key={i}>
                    <p className="session-text">• {item.sessionText}</p>
                    {item.updatedAt && (
                      <p className="session-updated">{item.updatedAt}</p>
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
        </div>

        {/* ✅ Two dots */}
        <div className="action-btn-row">
          <span
            className="view-download-btn toss-dot"
            onClick={downloadTossMatchReport}
            title="Download Full Toss + Match Report"
          >
            •
          </span>

          <span
            className="view-download-btn session-dot"
            onClick={downloadSessionReport}
            title="Download Session Report"
          >
            •
          </span>
        </div>
      </div>
    </div>
  );
}

export default ViewPrediction;
