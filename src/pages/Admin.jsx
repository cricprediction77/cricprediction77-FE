import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeamLogo } from "../utils/LeagueTeamLogos";
import { predictionApiFetch } from "../services/api";

import "./Admin.css";

function Admin() {
  const navigate = useNavigate();

  const [matchesByLeague, setMatchesByLeague] = useState({});
  const [expandedLeagues, setExpandedLeagues] = useState({});
  const [selections, setSelections] = useState({});

  // 🔐 Admin authentication
  useEffect(() => {
    const adminStr = localStorage.getItem("admin");

    if (!adminStr) {
      navigate("/login");
      return;
    }

    const admin = JSON.parse(adminStr);

    if (admin.role !== "SUPER_ADMIN") {
      navigate("/login");
    }
  }, [navigate]);

  // 📡 Fetch all leagues (future-proof)
  useEffect(() => {
    fetchAllLeagueData();
  }, []);

  const fetchAllLeagueData = async () => {
    try {
      // 🔹 Fetch all leagues in parallel
      const [bplData, wplData, mensBblData, saT20Data] = await Promise.all([
        predictionApiFetch("/api/bpl/bpl-matches"),
        predictionApiFetch("/api/wpl/wpl-matches"),
        predictionApiFetch("/api/mens-bbl/matches"),
        predictionApiFetch("/api/sa-t20/matches"),
      ]);

      // 🔹 Merge all league matches
      const today = new Date().toISOString().split("T")[0];

      const allMatches = [
        ...(bplData?.matches || []),
        ...(wplData?.matches || []),
        ...(mensBblData?.matches || []),
        ...(saT20Data?.matches || []),
      ].filter(
        (match) => match.matchStatus !== "COMPLETED" && match.matchDate <= today
      );

      // ✅ ADD THIS BLOCK
      const groupedByLeague = allMatches.reduce((acc, match) => {
        const league = match.leagueType || "Other League";
        if (!acc[league]) acc[league] = [];
        acc[league].push(match);
        return acc;
      }, {});

      // ✅ STORE IN STATE
      setMatchesByLeague(groupedByLeague);

      // 🔹 ADMIN PAGE
      // filterAdminMatches(allMatches);

      // 🔹 HOME PAGE
      // filterMatches("TODAY", allMatches);
    } catch (error) {
      console.error("Error fetching league data:", error);
      return [];
    }
  };

  const handleInputChange = (matchNumber, field, value) => {
    setSelections((prev) => ({
      ...prev,
      [matchNumber]: {
        ...prev[matchNumber],
        [field]: value,
      },
    }));
  };

  const getSubmitApiByLeague = (leagueType) => {
    if (!leagueType) return "/api/bpl/details";

    if (leagueType.includes("Bangladesh")) return "/api/bpl/details";
    if (leagueType.includes("WPL")) return "/api/wpl/details";
    if (leagueType.includes("Big Bash")) return "/api/mens-bbl/details";
    if (leagueType.includes("SA T20")) return "/api/sa-t20/details";

    throw new Error("Unknown league type: " + leagueType);
  };

  const handleSubmit = async (match) => {
    const data = selections[match.matchNumber];

    const payload = {
      matchNumber: match.matchNumber,
      tossWinner: data.tossWinner,
      matchWinner: data.matchWinner,
      team1Score: data.team1Score,
      team2Score: data.team2Score,
      sessionDetails: data.sessionDetails,
      matchStatus: "COMPLETED",
    };

    try {
      const apiUrl = getSubmitApiByLeague(match.leagueType);

      await predictionApiFetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("Match updated successfully");

      alert("Match details submitted successfully ✅");

      // ✅ CLEAR ONLY THIS MATCH FORM
      setSelections((prev) => {
        const updated = { ...prev };
        delete updated[match.matchNumber];
        return updated;
      });

      // ✅ REFRESH DATA WITHOUT RELOAD
      fetchAllLeagueData();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error while submitting match details ❌");
    }
  };

  const toggleLeague = (league) => {
    setExpandedLeagues((prev) => ({
      ...prev,
      [league]: !prev[league],
    }));
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };
  const getTeamsFromMatch = (teamsStr) => {
    if (!teamsStr || !teamsStr.includes(" vs ")) return [];
    return teamsStr.split(" vs ");
  };

  const handleSelectChange = (matchNumber, type, value) => {
    setSelections((prev) => ({
      ...prev,
      [matchNumber]: {
        ...prev[matchNumber],
        [type]: value,
      },
    }));
  };
  const isFormComplete = (matchNumber) => {
    const data = selections[matchNumber];

    return (
      data?.tossWinner &&
      data?.matchWinner &&
      data?.team1Score &&
      data?.team2Score &&
      data?.sessionDetails
    );
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {Object.keys(matchesByLeague).length === 0 ? (
        <p className="no-data">No pending matches</p>
      ) : (
        Object.entries(matchesByLeague).map(([league, matches]) => {
          const isExpanded = expandedLeagues[league];
          const visibleMatches = isExpanded ? matches : matches.slice(0, 2);

          return (
            <div key={league} className="league-block">
              {/* League Banner */}
              <div className="league-banner">{league}</div>

              {/* Matches */}
              {visibleMatches.map((match) => {
                // ✅ ADD THIS LINE HERE
                const teamsList = getTeamsFromMatch(match.teams);

                return (
                  <div className="admin-match-card" key={match.matchNumber}>
                    <div className="match-header">
                      {formatDate(match.matchDate)} | Match No -{" "}
                      {match.matchNumber}
                    </div>

                    <div className="teams-row">
                      {/* LEFT SIDE */}
                      <div className="left-section">
                        <div className="team">
                          <img
                            src={getTeamLogo(match.leagueType, teamsList[0])}
                            alt=""
                          />
                          <span>{teamsList[0]}</span>
                        </div>
                      </div>

                      {/* VS */}
                      <div className="vs">VS</div>

                      {/* RIGHT SIDE */}
                      <div className="team">
                        {teamsList[1] && (
                          <>
                            <img
                              src={getTeamLogo(match.leagueType, teamsList[1])}
                              alt=""
                            />
                            <span>{teamsList[1]}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Dropdowns */}
                    <div className="dropdown-group">
                      <label>Toss Winner</label>
                      <select
                        disabled={teamsList.length !== 2}
                        value={selections[match.matchNumber]?.tossWinner || ""}
                        onChange={(e) =>
                          handleSelectChange(
                            match.matchNumber,
                            "tossWinner",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select</option>
                        {teamsList.map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                        ))}
                      </select>
                      <label>Match Winner</label>
                      <select
                        disabled={teamsList.length !== 2}
                        value={selections[match.matchNumber]?.matchWinner || ""}
                        onChange={(e) =>
                          handleSelectChange(
                            match.matchNumber,
                            "matchWinner",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select</option>
                        {teamsList.map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Extra Fields */}
                    {/* Extra Fields */}
                    <div className="extra-fields">
                      <label>
                        {teamsList[0]
                          ? `${teamsList[0]} Score`
                          : "Team 1 Score"}
                      </label>
                      <input
                        type="text"
                        placeholder="Score"
                        value={selections[match.matchNumber]?.team1Score || ""}
                        onChange={(e) =>
                          handleInputChange(
                            match.matchNumber,
                            "team1Score",
                            e.target.value
                          )
                        }
                      />

                      <label>
                        {teamsList[1]
                          ? `${teamsList[1]} Score`
                          : "Team 2 Score"}
                      </label>
                      <input
                        type="text"
                        placeholder="Score"
                        value={selections[match.matchNumber]?.team2Score || ""}
                        onChange={(e) =>
                          handleInputChange(
                            match.matchNumber,
                            "team2Score",
                            e.target.value
                          )
                        }
                      />

                      <label>Session Details</label>
                      <textarea
                        rows={3}
                        placeholder="Enter session details"
                        value={
                          selections[match.matchNumber]?.sessionDetails || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            match.matchNumber,
                            "sessionDetails",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Submit Button */}
                    {isFormComplete(match.matchNumber) && (
                      <div className="submit-wrapper">
                        <button
                          className="submit-btn"
                          onClick={() => handleSubmit(match)}
                        >
                          Submit
                        </button>
                      </div>
                    )}

                    {/* <div className="status-text">Status: Pending / Live</div> */}
                  </div>
                );
              })}

              {/* Show More / Less */}
              {matches.length > 2 && (
                <div
                  className="show-toggle"
                  onClick={() => toggleLeague(league)}
                >
                  {isExpanded ? "Show Less ▲" : "Show More ▼"}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Admin;
