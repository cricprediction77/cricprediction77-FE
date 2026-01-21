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

  // ✅ Get today's date in IST (YYYY-MM-DD)
  const getTodayIST = React.useCallback(() => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  }, []);

  // 📡 Fetch all leagues
  useEffect(() => {
    fetchAllLeagueData();
  }, []);

  const fetchAllLeagueData = async () => {
    try {
      const [bplData, wplData, mensBblData, saT20Data, superSmashData] =
        await Promise.all([
          predictionApiFetch("/api/bpl/bpl-matches"),
          predictionApiFetch("/api/wpl/wpl-matches"),
          predictionApiFetch("/api/mens-bbl/bbl-matches"),
          predictionApiFetch("/api/sa-t20/sat20-matches"),
          predictionApiFetch("/api/super-smash/supersmash-matches"),
        ]);

      const today = getTodayIST();

      const allMatches = [
        ...(bplData?.matches || []),
        ...(wplData?.matches || []),
        ...(mensBblData?.matches || []),
        ...(saT20Data?.matches || []),
        ...(superSmashData?.matches || []),
      ].filter(
        (match) => match.matchStatus === null && match.matchDate <= today,
      );

      const groupedByLeague = allMatches.reduce((acc, match) => {
        const league = match.leagueType || "Other League";
        if (!acc[league]) acc[league] = [];
        acc[league].push(match);
        return acc;
      }, {});

      setMatchesByLeague(groupedByLeague);
    } catch (error) {
      console.error("Error fetching league data:", error);
    }
  };

  // ✅ Unique selection key (IMPORTANT FIX)
  const getMatchKey = (match) => `${match.leagueType}-${match.matchNumber}`;

  const handleInputChange = (matchKey, field, value) => {
    setSelections((prev) => ({
      ...prev,
      [matchKey]: {
        ...prev[matchKey],
        [field]: value,
      },
    }));
  };

  const getSubmitApiByLeague = (leagueType) => {
    if (!leagueType) return "/api/bpl/details";

    const lt = leagueType.toLowerCase();

    // ✅ BPL
    if (lt.includes("bpl")) return "/api/bpl/details";

    // ✅ WPL (FULL NAME SAFE)
    if (lt.includes("womens premier league") || lt.includes("wpl"))
      return "/api/wpl/details";

    // ✅ BIG BASH (FULL NAME SAFE)
    if (
      lt.includes("big bash league 2025-2026") ||
      lt.includes("big bash") ||
      lt.includes("bbl")
    )
      return "/api/mens-bbl/details";

    // ✅ SA T20 (FULL NAME SAFE)
    if (
      lt.includes("sa t20 2026") ||
      lt.includes("sa t20") ||
      lt.includes("sat20")
    )
      return "/api/sa-t20/details";

    // ✅ SUPER SMASH (FULL NAME SAFE)
    if (
      lt.includes("men's super smash 2025-2026") ||
      lt.includes("super smash")
    )
      return "/api/super-smash/details";

    // fallback
    return "/api/bpl/details";
  };

  const handleSubmit = async (match) => {
    const matchKey = getMatchKey(match);
    const data = selections[matchKey];

    const status = data?.matchStatus;

    // ✅ If cancelled/abandoned/postponed → send null for all details
    const payload =
      status === "CANCELLED" || status === "ABANDONED" || status === "POSTPONED"
        ? {
            matchNumber: match.matchNumber,
            tossWinner: null,
            matchWinner: null,
            team1Score: null,
            team2Score: null,
            sessionDetails: null,
            matchStatus: status,
          }
        : {
            matchNumber: match.matchNumber,
            tossWinner: data.tossWinner,
            matchWinner: data.matchWinner,
            team1Score: data.team1Score,
            team2Score: data.team2Score,
            sessionDetails: data.sessionDetails,
            matchStatus: status, // COMPLETED
          };

    try {
      const apiUrl = getSubmitApiByLeague(match.leagueType);

      await predictionApiFetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      alert("Match details submitted successfully ✅");

      setSelections((prev) => {
        const updated = { ...prev };
        delete updated[matchKey];
        return updated;
      });

      fetchAllLeagueData();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error while submitting match details ❌");
    }
  };
  const handleGenerateReport = (match) => {
    const matchKey = getMatchKey(match);
    const data = selections[matchKey];

    if (!data?.tossWinner || !data?.matchWinner) {
      alert(
        "Please select Toss Winner and Match Winner before generating report ❌",
      );
      return;
    }

    // ✅ Navigate to report page with selected values
    navigate("/report-generate", {
      state: {
        match,
        reportData: {
          tossWinner: data.tossWinner,
          matchWinner: data.matchWinner,
        },
      },
    });
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
      d.getMonth() + 1,
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const getTeamsFromMatch = (teamsStr) => {
    if (!teamsStr || !teamsStr.includes(" vs ")) return [];
    return teamsStr.split(" vs ");
  };

  const handleSelectChange = (matchKey, type, value) => {
    setSelections((prev) => ({
      ...prev,
      [matchKey]: {
        ...prev[matchKey],
        [type]: value,
      },
    }));
  };

  const isFormComplete = (matchKey) => {
    const data = selections[matchKey];
    const status = data?.matchStatus;

    // ✅ If match is cancelled/abandoned/postponed → allow submit directly
    if (
      status === "CANCELLED" ||
      status === "ABANDONED" ||
      status === "POSTPONED"
    ) {
      return true;
    }

    // ✅ If COMPLETED → old behavior (all fields required)
    return (
      data?.tossWinner &&
      data?.matchWinner &&
      data?.team1Score &&
      data?.team2Score &&
      data?.sessionDetails &&
      status === "COMPLETED"
    );
  };
  // ✅ Only Toss + Match winner required for report
  const isReportReady = (matchKey) => {
    const data = selections[matchKey];
    return Boolean(data?.tossWinner && data?.matchWinner);
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
              <div className="league-banner">{league}</div>

              {visibleMatches.map((match) => {
                const teamsList = getTeamsFromMatch(match.teams);
                const matchKey = getMatchKey(match);

                return (
                  <div className="admin-match-card" key={matchKey}>
                    <div className="match-header">
                      {formatDate(match.matchDate)} | Match No -{" "}
                      {match.matchNumber}
                    </div>

                    <div className="teams-row">
                      <div className="left-section">
                        <div className="team">
                          <img
                            src={getTeamLogo(match.leagueType, teamsList[0])}
                            alt=""
                          />
                          <span>{teamsList[0]}</span>
                        </div>
                      </div>

                      <div className="vs">VS</div>

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
                        value={selections[matchKey]?.tossWinner || ""}
                        onChange={(e) =>
                          handleSelectChange(
                            matchKey,
                            "tossWinner",
                            e.target.value,
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
                        value={selections[matchKey]?.matchWinner || ""}
                        onChange={(e) =>
                          handleSelectChange(
                            matchKey,
                            "matchWinner",
                            e.target.value,
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
                    <div className="extra-fields">
                      <label>
                        {teamsList[0]
                          ? `${teamsList[0]} Score`
                          : "Team 1 Score"}
                      </label>
                      <input
                        type="text"
                        placeholder="Score"
                        value={selections[matchKey]?.team1Score || ""}
                        onChange={(e) =>
                          handleInputChange(
                            matchKey,
                            "team1Score",
                            e.target.value,
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
                        value={selections[matchKey]?.team2Score || ""}
                        onChange={(e) =>
                          handleInputChange(
                            matchKey,
                            "team2Score",
                            e.target.value,
                          )
                        }
                      />

                      <label>Session Details</label>
                      <textarea
                        rows={3}
                        placeholder="Enter session details"
                        value={selections[matchKey]?.sessionDetails || ""}
                        onChange={(e) =>
                          handleInputChange(
                            matchKey,
                            "sessionDetails",
                            e.target.value,
                          )
                        }
                      />
                      <label>Match Status</label>
                      <select
                        value={selections[matchKey]?.matchStatus || ""}
                        onChange={(e) =>
                          handleSelectChange(
                            matchKey,
                            "matchStatus",
                            e.target.value,
                          )
                        }
                      >
                        <option value="">Select Match Status</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="ABANDONED">ABANDONED</option>
                        <option value="POSTPONED">POSTPONED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    {/* ✅ Buttons */}
                    {isFormComplete(matchKey) ? (
                      // ✅ If all fields completed → show Submit
                      <div className="submit-wrapper">
                        <button
                          className="submit-btn"
                          onClick={() => handleSubmit(match)}
                        >
                          Submit
                        </button>
                      </div>
                    ) : isReportReady(matchKey) ? (
                      // ✅ If only toss+match winner selected → show Generate Report
                      <div className="submit-wrapper">
                        <button
                          className="submit-btn"
                          onClick={() => handleGenerateReport(match)}
                        >
                          Generate Report
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}

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
