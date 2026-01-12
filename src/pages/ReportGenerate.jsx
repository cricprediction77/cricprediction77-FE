import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTeamLogo, getLeagueLogo } from "../utils/LeagueTeamLogos";
import html2canvas from "html2canvas";
import "./ViewPrediction.css";

function ReportGenerate() {
  const location = useLocation();
  const navigate = useNavigate();

  const match = location.state?.match;
  const reportData = location.state?.reportData;

  // ✅ FULL default
  const [activeTemplate, setActiveTemplate] = useState("FULL");

  // ✅ PDF refs
  const fullRef = useRef(null);
  const tossRef = useRef(null);
  const matchRef = useRef(null);

  useEffect(() => {
    if (!match || !reportData) {
      navigate("/");
    }
  }, [match, reportData, navigate]);

  if (!match || !reportData) return null;

  const [team1, team2] = match.teams?.includes(" vs ")
    ? match.teams.split(" vs ")
    : [match.teams, ""];
  const tossWinnerSelected = reportData?.tossWinner;
  const matchWinnerSelected = reportData?.matchWinner;

  // ✅ same helpers from ViewPrediction
  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

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

  // ✅ show logic
  const showToss = activeTemplate === "FULL" || activeTemplate === "TOSS";
  const showMatch = activeTemplate === "FULL" || activeTemplate === "MATCH";

  const getActiveRef = () => {
    if (activeTemplate === "FULL") return fullRef;
    if (activeTemplate === "TOSS") return tossRef;
    if (activeTemplate === "MATCH") return matchRef;
    return fullRef;
  };

  const downloadPNG = async () => {
    try {
      const ref = getActiveRef();
      const element = ref.current;

      if (!element) {
        alert("Report not found ❌");
        return;
      }

      // ✅ add export mode class only for export
      element.classList.add("pdf-mode");

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#121417",
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const fileName =
        activeTemplate === "FULL"
          ? `Full_Report_${match.matchNumber}.png`
          : activeTemplate === "TOSS"
          ? `Toss_Report_${match.matchNumber}.png`
          : `Match_Report_${match.matchNumber}.png`;

      // ✅ Download image
      const link = document.createElement("a");
      link.href = imgData;
      link.download = fileName;
      link.click();

      // ✅ remove export mode
      element.classList.remove("pdf-mode");
    } catch (err) {
      console.error("PNG download error:", err);
      alert("Failed to download report ❌");
    }
  };

  // ✅ Reusable JSX
  const MatchTopCard = () => (
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
          <h2 className="team-title">{team1}</h2>

          {/* ✅ DON’T SHOW SCORE */}
          {/* <p className="team-score">{match.team1Score || "-- / --"}</p> */}
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
            <h2 className="team-title">{team2}</h2>

            {/* ✅ DON’T SHOW SCORE */}
            {/* <p className="team-score">{match.team2Score || "-- / --"}</p> */}
          </div>
        )}
      </div>
    </div>
  );

  const TossCard = () => (
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
          src={getTeamLogo(match.leagueType, tossWinnerSelected || team1)}
          alt={tossWinnerSelected || "TBD"}
          className="toss-logo"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getTeamLogo(match.leagueType, team1);
          }}
        />
      </div>

      <p className="toss-result">
        <span>{tossWinnerSelected || "TBD"}</span>
        WILL WIN THE TOSS.
      </p>
    </div>
  );

  const MatchWinnerCard = () => (
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
          {/* App logo */}
          <img
            src="https://dko97fmntp7zh.cloudfront.net/3b413458-b112-40e6-89a2-88f4c256d940_1000653499.png"
            alt="App Logo"
            className="app-logo"
          />

          {/* Winner logo */}
          <img
            src={getTeamLogo(match.leagueType, matchWinnerSelected || team2)}
            alt={matchWinnerSelected || "TBD"}
            className="winner-shield"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getTeamLogo(match.leagueType, team2);
            }}
          />

          {/* League logo */}
          <img
            src={getLeagueLogo(match.leagueType)}
            alt="League Logo"
            className="league-logo"
          />
        </div>
      </div>

      <p className="match-winner-result">
        <span>{matchWinnerSelected || "TBD"}</span>
        WILL WIN THE MATCH.
      </p>
    </div>
  );

  // ✅ choose ref wrapper based on template
  const getRefWrapper = (children) => {
    if (activeTemplate === "FULL")
      return (
        <div ref={fullRef} className="pdf-print-area">
          {children}
        </div>
      );

    if (activeTemplate === "TOSS")
      return (
        <div ref={tossRef} className="pdf-print-area">
          {children}
        </div>
      );

    return (
      <div ref={matchRef} className="pdf-print-area">
        {children}
      </div>
    );
  };

  return (
    <div className="card-wrapper">
      <div className="match-card">
        {/* Header */}

        {/* ✅ Download button (top) */}

        {/* ✅ BIG VIEW (Exactly like ViewPrediction) */}
        {getRefWrapper(
          <>
            <div className="match-header">
              {match.leagueType} <br /> Match - {match.matchNumber}
            </div>
            <MatchTopCard />

            <div className="prediction-info">
              {showToss && <TossCard />}
              {showMatch && <MatchWinnerCard />}

              {/* ✅ Notice text instead of session/score */}
            </div>
          </>
        )}

        {/* ✅ Template Switcher (2 small templates only) */}
        <div style={{ padding: "0 20px 20px" }}>
          <h3
            style={{
              textAlign: "center",
              color: "#fff",
              margin: "20px 0 12px",
            }}
          >
            Select Report Template
          </h3>

          <div className="report-preview-row">
            <div
              className={`report-preview-card ${
                activeTemplate === "FULL" ? "active-preview" : ""
              }`}
              onClick={() => setActiveTemplate("FULL")}
            >
              <h4>Full Report</h4>
              <p>
                Toss Winner: <b>{tossWinnerSelected}</b>
              </p>
              <p>
                Match Winner: <b>{matchWinnerSelected}</b>
              </p>
            </div>

            <div
              className={`report-preview-card ${
                activeTemplate === "TOSS" ? "active-preview" : ""
              }`}
              onClick={() => setActiveTemplate("TOSS")}
            >
              <h4>Toss Report</h4>
              <p>
                Toss Winner: <b>{tossWinnerSelected}</b>
              </p>
            </div>

            <div
              className={`report-preview-card ${
                activeTemplate === "MATCH" ? "active-preview" : ""
              }`}
              onClick={() => setActiveTemplate("MATCH")}
            >
              <h4>Match Report</h4>
              <p>
                Match Winner: <b>{matchWinnerSelected}</b>
              </p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <button className="download-btn" onClick={downloadPNG}>
            ⬇ Download {activeTemplate} Report
          </button>
        </div>

        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
}

export default ReportGenerate;
