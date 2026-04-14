import React, { useCallback, useRef, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getTeamLogo } from "../utils/LeagueTeamLogos";
import { useNavigate } from "react-router-dom";
import { predictionApiFetch } from "../services/api";
import { FaYoutube, FaInstagram, FaTelegramPlane } from "react-icons/fa";
import "./Home.css";

function Home() {
  const [allMatches, setAllMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [activeTab, setActiveTab] = useState("TODAY");
  const [expandedLeagues, setExpandedLeagues] = useState({});
  const [selectedLeague, setSelectedLeague] = useState("");
  const [showLeagues, setShowLeagues] = useState(false);
  const [animatedToday, setAnimatedToday] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [counter, setCounter] = useState({
    todayCount: 0,
    totalCount: 0,
  });
  const progressRef = useRef(null);
  const hasAnimated = useRef(false);

  const SOCIAL_LINKS = {
    youtube: "https://www.youtube.com/@CricPrediction77",
    instagram:
      "https://www.instagram.com/cricprediction77?igsh=MW0ybXlnMzYydXR1Yw==",
    telegram: "https://t.me/CricPredictions77",
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://my-springboot-backend-7sdz.onrender.com/health")
      .then(() => console.log("Backend warmed up ✅"))
      .catch(() => console.log("Backend warmup failed ❌"));
  }, []);

  // ✅ Format date to DD-MM-YYYY
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  // ✅ Calculate countdown
  const getCountdown = (matchDate, startTime) => {
    if (!matchDate || !startTime) return null;

    const matchDateTime = new Date(`${matchDate}T${startTime}:00+05:30`);
    const now = new Date();
    const diff = matchDateTime - now;

    if (diff <= 0) return "Match Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const getTodayIST = () => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  };

  // ⏱ Refresh countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setFilteredMatches((prev) => [...prev]);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (hasFetched.current) return; // 🔥 prevents double call

    hasFetched.current = true;

    const fetchAllLeagueData = async () => {
      try {
        const [
          bplData,
          wplData,
          mensBblData,
          saT20Data,
          superSmashData,
          iplData,
          pslData,
          counterData,
        ] = await Promise.all([
          predictionApiFetch("/api/bpl/bpl-matches"),
          predictionApiFetch("/api/wpl/wpl-matches"),
          predictionApiFetch("/api/mens-bbl/bbl-matches"),
          predictionApiFetch("/api/sa-t20/sat20-matches"),
          predictionApiFetch("/api/super-smash/supersmash-matches"),
          predictionApiFetch("/api/ipl/ipl-matches"),
          predictionApiFetch("/api/psl/psl-matches"),
          predictionApiFetch("/api/counter"),
        ]);
        setCounter({
          todayCount: counterData?.todayCount || 0,
          totalCount: counterData?.totalCount || 0,
        });

        const combinedMatches = [
          ...(bplData?.matches || []),
          ...(wplData?.matches || []),
          ...(mensBblData?.matches || []),
          ...(saT20Data?.matches || []),
          ...(superSmashData?.matches || []),
          ...(iplData?.matches || []),
          ...(pslData?.matches || []),
        ];

        setAllMatches(combinedMatches);
        filterMatches("TODAY", combinedMatches, "");
        setSelectedLeague("");
      } catch (error) {
        console.error("Error fetching league data", error);
      }
    };

    fetchAllLeagueData();
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          // 🔥 RUN EVERY TIME YOU SCROLL TO IT

          const startValue = 0;
          const endValue = counter.totalCount;

          const duration = 2000; // 3 seconds
          let startTime = null;

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;

            const progress = timestamp - startTime;
            const t = Math.min(progress / duration, 1);

            // 🔥 easing (IMPORTANT)
            const eased = 1 - Math.pow(1 - t, 3);

            const value = Math.floor(
              startValue + (endValue - startValue) * eased,
            );

            setAnimatedTotal(value);

            if (t < 1) {
              requestAnimationFrame(animate);
            } else {
              setAnimatedTotal(endValue);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      {
        threshold: 0.5, // trigger when 50% visible
      },
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => {
      if (progressRef.current) {
        observer.unobserve(progressRef.current);
      }
    };
  }, [counter.totalCount]);

  const filterMatches = useCallback(
    (type, matches = allMatches, leagueFilter = selectedLeague) => {
      setActiveTab(type);
      const today = getTodayIST();
      let result = [];

      // ✅ If League selected (WPL / BBL / BPL / SAT20 / SUPERSMASH)
      // Always show ALL matches from that league only (no today/upcoming/completed logic)
      if (leagueFilter) {
        result = matches.filter((m) =>
          (m.leagueType || "")
            .toLowerCase()
            .includes(leagueFilter.toLowerCase()),
        );

        // ✅ sort by matchNumber
        result = result.sort(
          (a, b) => Number(a.matchNumber) - Number(b.matchNumber),
        );

        setFilteredMatches(result);
        return; // ✅ STOP here (important)
      }

      // ✅ Normal tab filtering (Only when no league selected)
      if (type === "TODAY") {
        result = matches.filter(
          (m) => m.matchDate === today && m.matchStatus === null,
        );
      }

      if (type === "UPCOMING") {
        result = matches.filter((m) => m.matchDate > today);
      }

      if (type === "COMPLETED") {
        result = matches
          .filter((m) =>
            ["COMPLETED", "ABANDONED", "POSTPONED", "CANCELLED"].includes(
              m.matchStatus,
            ),
          )
          .sort((a, b) => Number(b.matchNumber) - Number(a.matchNumber));
      }

      // ✅ sort
      result = result.sort((a, b) => {
        if (type === "COMPLETED") {
          return Number(b.matchNumber) - Number(a.matchNumber);
        }
        return Number(a.matchNumber) - Number(b.matchNumber);
      });

      setFilteredMatches(result);
    },
    [allMatches, selectedLeague],
  );

  const whatsappNumber = "917842435725";
  const whatsappMessage = encodeURIComponent(
    "Hi, I’m interested in your cricket analysis services.",
  );

  const openWhatsapp = () => {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
      "_blank",
    );
  };
  const isLeagueSelected = !!selectedLeague;

  const getLeaguePriority = (leagueName) => {
    const name = (leagueName || "").toLowerCase();

    if (name.includes("indian premier league")) return 1;
    if (name.includes("pakistan super league") || name.includes("psl"))
      return 2;

    return 3;
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          Cric<span onClick={() => navigate("/login")}>Prediction77</span>
        </div>

        {/* ✅ Social Icons */}
        <div className="social-icons">
          <FaYoutube
            className="icon youtube"
            onClick={() => window.open(SOCIAL_LINKS.youtube, "_blank")}
          />
          <FaInstagram
            className="icon instagram"
            onClick={() => window.open(SOCIAL_LINKS.instagram, "_blank")}
          />
          <FaTelegramPlane
            className="icon telegram"
            onClick={() => window.open(SOCIAL_LINKS.telegram, "_blank")}
          />
        </div>
      </nav>

      {/* Carousel */}
      <section className="hero-carousel">
        <Carousel showThumbs={false} autoPlay infiniteLoop showStatus={false}>
          <div className="slide-item">
            <img
              src="https://i.pinimg.com/originals/bf/97/ab/bf97ab38490d4be1ef4cd42aee1aa986.jpg"
              alt="IPL"
            />

            <div className="overlay">
              <h2>IPL Analysis & Insights</h2>
              <p>Indian Premier League</p>
            </div>

            {/* WhatsApp Icon */}
            <img
              src="https://dko97fmntp7zh.cloudfront.net/c9d8ec1c-6658-48a1-9c5f-2ec1f6eb4eb5_Media%20(5).jpg"
              alt="WhatsApp"
              className="carousel-whatsapp"
              onClick={openWhatsapp}
            />
          </div>

          <div className="slide-item">
            <img
              src="https://dko97fmntp7zh.cloudfront.net/e2deb1b3-5967-4e07-b5a6-5ea3e8b8b29b_Screenshot 2026-03-26 174253.png"
              alt="IPL"
            />

            <div className="overlay">
              <h2>PSL Analysis & Insights</h2>
              <p>Pakistan Super League</p>
            </div>

            {/* WhatsApp Icon */}
            <img
              src="https://dko97fmntp7zh.cloudfront.net/c9d8ec1c-6658-48a1-9c5f-2ec1f6eb4eb5_Media%20(5).jpg"
              alt="WhatsApp"
              className="carousel-whatsapp"
              onClick={openWhatsapp}
            />
          </div>

          <div className="slide-item">
            <img
              src="https://dko97fmntp7zh.cloudfront.net/02532756-d960-4b8a-a00f-b230bfe322d4_AA1R8jDz.jpg"
              alt="WPL"
            />

            <div className="overlay">
              <h2>WPL Analysis & Insights</h2>
              <p>Womens Premier League</p>
            </div>

            {/* WhatsApp Icon */}
            <img
              src="https://dko97fmntp7zh.cloudfront.net/c9d8ec1c-6658-48a1-9c5f-2ec1f6eb4eb5_Media%20(5).jpg"
              alt="WhatsApp"
              className="carousel-whatsapp"
              onClick={openWhatsapp}
            />
          </div>

          <div className="slide-item">
            <img src="https://dko97fmntp7zh.cloudfront.net/f16e7b83-780f-4da0-937e-2f6105ba0e14_bplcaptains.jpg" />

            <div className="overlay">
              <h2>BPL Analysis & Insights</h2>
              <p>Bangladesh Premier League</p>
            </div>

            {/* WhatsApp Icon */}
            <img
              src="https://dko97fmntp7zh.cloudfront.net/c9d8ec1c-6658-48a1-9c5f-2ec1f6eb4eb5_Media%20(5).jpg"
              alt="WhatsApp"
              className="carousel-whatsapp"
              onClick={openWhatsapp}
            />
          </div>

          <div className="slide-item">
            <img
              src="https://dko97fmntp7zh.cloudfront.net/4bd5ac7a-7617-4fd7-a5f3-0b8d61f9e8f6_bblcaptains.jpg"
              alt="BBL"
            />

            <div className="overlay">
              <h2>BBL Analysis & Insights</h2>
              <p>Big Bash League</p>
            </div>

            {/* WhatsApp Icon */}
            <img
              src="https://dko97fmntp7zh.cloudfront.net/c9d8ec1c-6658-48a1-9c5f-2ec1f6eb4eb5_Media%20(5).jpg"
              alt="WhatsApp"
              className="carousel-whatsapp"
              onClick={openWhatsapp}
            />
          </div>

          <div className="slide-item">
            <img
              src="https://dko97fmntp7zh.cloudfront.net/27af881a-a869-427f-a1bd-508243269057_sat20captains.jpg"
              alt="SAT20"
            />

            <div className="overlay">
              <h2>SA-T20 Analysis & Insights</h2>
              <p>South Africa T20 League</p>
            </div>

            {/* WhatsApp Icon */}
            <img
              src="https://dko97fmntp7zh.cloudfront.net/c9d8ec1c-6658-48a1-9c5f-2ec1f6eb4eb5_Media%20(5).jpg"
              alt="WhatsApp"
              className="carousel-whatsapp"
              onClick={openWhatsapp}
            />
          </div>
        </Carousel>
      </section>

      {/* Tabs */}

      {/* ✅ View All Leagues / View All Matches Toggle Button */}
      <div className="quick-actions">
        <button
          className={`action-card ${showLeagues ? "active" : ""}`}
          onClick={() => {
            setShowLeagues((prev) => {
              const newValue = !prev;

              // ✅ If switching back to matches view, make sure TODAY selected
              if (!newValue) {
                setSelectedLeague("");
                setActiveTab("TODAY");
                filterMatches("TODAY", allMatches, "");
              }

              return newValue;
            });
          }}
        >
          {showLeagues ? "View All Matches" : "View All Leagues"}
        </button>
      </div>

      {showLeagues && (
        <div className="quick-actions league-actions">
          {" "}
          {/* ✅ IPL */}
          <button
            className={`league-action-card ${
              selectedLeague === "ipl" ? "active" : ""
            }`}
            onClick={() => {
              if (selectedLeague === "ipl") {
                setSelectedLeague("");
                setActiveTab("TODAY");
                filterMatches("TODAY", allMatches, "");
              } else {
                setSelectedLeague("ipl");
                filterMatches(
                  "ALL_MATCHES",
                  allMatches,
                  "indian premier league",
                );
              }
            }}
          >
            IPL
          </button>
          {/* ✅ PSL */}
          <button
            className={`league-action-card ${
              selectedLeague === "psl" ? "active" : ""
            }`}
            onClick={() => {
              if (selectedLeague === "psl") {
                setSelectedLeague("");
                setActiveTab("TODAY");
                filterMatches("TODAY", allMatches, "");
              } else {
                setSelectedLeague("psl");
                filterMatches(
                  "ALL_MATCHES",
                  allMatches,
                  "pakistan super league",
                );
              }
            }}
          >
            PSL
          </button>
          <button
            className={`league-action-card ${
              selectedLeague === "wpl" ? "active" : ""
            }`}
            onClick={() => {
              if (selectedLeague === "wpl") {
                setSelectedLeague("");
                setActiveTab("TODAY");
                filterMatches("TODAY", allMatches, "");
              } else {
                setSelectedLeague("wpl");
                filterMatches(
                  "ALL_MATCHES",
                  allMatches,
                  "womens premier league",
                );
              }
            }}
          >
            WPL
          </button>
          {/* ✅ BBL */}
          <button
            className={`league-action-card ${
              selectedLeague === "bbl" ? "active" : ""
            }`}
            onClick={() => {
              if (selectedLeague === "bbl") {
                setSelectedLeague("");
                setActiveTab("TODAY");
                filterMatches("TODAY", allMatches, "");
              } else {
                setSelectedLeague("bbl");
                filterMatches("ALL_MATCHES", allMatches, "big bash league");
              }
            }}
          >
            BBL
          </button>
          {/* ✅ BPL */}
          <button
            className={`league-action-card ${
              selectedLeague === "bpl" ? "active" : ""
            }`}
            onClick={() => {
              if (selectedLeague === "bpl") {
                setSelectedLeague("");
                setActiveTab("TODAY");
                filterMatches("TODAY", allMatches, "");
              } else {
                setSelectedLeague("bpl");
                filterMatches("ALL_MATCHES", allMatches, "bpl");
              }
            }}
          >
            BPL
          </button>
          {/* ✅ SAT20 */}
          <button
            className={`league-action-card ${
              selectedLeague === "sat20" ? "active" : ""
            }`}
            onClick={() => {
              if (selectedLeague === "sat20") {
                setSelectedLeague("");
                setActiveTab("TODAY");
                filterMatches("TODAY", allMatches, "");
              } else {
                setSelectedLeague("sat20");
                filterMatches("ALL_MATCHES", allMatches, "sa t20");
              }
            }}
          >
            SAT20
          </button>
          {/* ✅ SUPERSMASH */}
          <button
            className={`league-action-card ${
              selectedLeague === "supersmash" ? "active" : ""
            }`}
            onClick={() => {
              if (selectedLeague === "supersmash") {
                setSelectedLeague("");
                setActiveTab("TODAY");
                filterMatches("TODAY", allMatches, "");
              } else {
                setSelectedLeague("supersmash");
                filterMatches("ALL_MATCHES", allMatches, "super smash");
              }
            }}
          >
            SUPERSMASH
          </button>
        </div>
      )}

      {/* ✅ Tabs */}
      {!showLeagues && !isLeagueSelected && (
        <div className="quick-actions match-tabs">
          <button
            className={`action-card ${activeTab === "TODAY" ? "active" : ""}`}
            onClick={() => filterMatches("TODAY")}
          >
            Today's Matches
          </button>

          <button
            className={`action-card ${
              activeTab === "UPCOMING" ? "active" : ""
            }`}
            onClick={() => filterMatches("UPCOMING")}
          >
            Upcoming Matches
          </button>

          <button
            className={`action-card ${
              activeTab === "COMPLETED" ? "active" : ""
            }`}
            onClick={() => filterMatches("COMPLETED")}
          >
            Completed Matches
          </button>
        </div>
      )}

      {/* Matches */}
      <main className="match-section">
        {filteredMatches.length === 0 ? (
          <p className="no-data">
            {activeTab === "TODAY"
              ? "No matches today"
              : "No matches available"}
          </p>
        ) : (
          Object.entries(
            filteredMatches.reduce((acc, match) => {
              const league = match.leagueType || "Other League";
              if (!acc[league]) acc[league] = [];
              acc[league].push(match);
              return acc;
            }, {}),
          )
            .sort((a, b) => getLeaguePriority(a[0]) - getLeaguePriority(b[0]))
            .map(([league, matches]) => {
              const isExpanded = expandedLeagues?.[league];
              const visibleMatches = isExpanded ? matches : matches.slice(0, 2);

              return (
                <div key={league} className="league-section">
                  {/* League Heading */}
                  <h2 className="league-heading">{league}</h2>

                  {/* Matches */}
                  {visibleMatches.map((match) => (
                    <div className="match-card" key={match.matchNumber}>
                      <div className="match-header">
                        <b className="match-date">
                          {formatDate(match.matchDate)} || Match No -{" "}
                          {match.matchNumber}
                        </b>
                      </div>

                      <div className="match-teams">
                        <div className="team">
                          <img
                            src={getTeamLogo(
                              match.leagueType,
                              match.teams.split(" vs ")[0],
                            )}
                            alt=""
                            className="team-logo"
                          />
                          {match.teams.split(" vs ")[0]}
                        </div>

                        <div className="vs">VS</div>

                        <div className="team">
                          <img
                            src={getTeamLogo(
                              match.leagueType,
                              match.teams.split(" vs ")[1],
                            )}
                            alt=""
                            className="team-logo"
                          />
                          {match.teams.split(" vs ")[1]}
                        </div>
                      </div>

                      {/* TODAY & UPCOMING */}
                      {match.matchStatus === null && (
                        <>
                          <div className="countdown-timer">
                            Starts in:{" "}
                            {getCountdown(
                              match.matchDate,
                              match.approxStartTime,
                            )}
                          </div>

                          <hr className="card-divider" />

                          <div className="buy-row">
                            <p className="buy-text">
                              Get detailed match analysis & insights
                            </p>

                            <button
                              className="buy-now-btn"
                              onClick={() =>
                                navigate("/buy-now", { state: { match } })
                              }
                            >
                              View Insights
                            </button>
                          </div>
                        </>
                      )}

                      {/* COMPLETED */}
                      {match.matchStatus !== null && (
                        <>
                          <hr className="card-divider" />

                          <div className="buy-row">
                            <p className="buy-text">
                              {match.matchStatus === "COMPLETED"
                                ? "View match analysis & insights"
                                : "Match Status"}
                            </p>

                            {match.matchStatus === "COMPLETED" ? (
                              <button
                                className="buy-now-btn finished"
                                onClick={() =>
                                  navigate("/view-prediction", {
                                    state: { match },
                                  })
                                }
                              >
                                View Details
                              </button>
                            ) : (
                              <button
                                className={`status-btn ${
                                  match.matchStatus === "CANCELLED"
                                    ? "status-cancelled"
                                    : match.matchStatus === "ABANDONED"
                                      ? "status-abandoned"
                                      : "status-postponed"
                                }`}
                                disabled
                              >
                                {match.matchStatus}
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {/* Show More / Less */}
                  {matches.length > 2 && (
                    <span
                      className="show-more"
                      onClick={() =>
                        setExpandedLeagues((prev) => ({
                          ...prev,
                          [league]: !prev?.[league],
                        }))
                      }
                    >
                      {isExpanded ? "Show less" : "Show more"}
                    </span>
                  )}
                </div>
              );
            })
        )}
      </main>
      <div className="progress-section" ref={progressRef}>
        {/* ✅ Today */}
        <div className="progress-item">
          <div className="progress-circle">
            <svg className="progress-svg" viewBox="0 0 120 120">
              <circle className="bg" cx="60" cy="60" r="52" />
              <circle
                className="progress"
                cx="60"
                cy="60"
                r="52"
                strokeDasharray="327"
                strokeDashoffset={0}
              />
            </svg>
            <div className="progress-text blink">{counter.todayCount}</div>
          </div>

          {/* ✅ BELOW circle */}
          <p className="progress-label">Today Visitors</p>
        </div>

        {/* ✅ Total */}
        <div className="progress-item">
          <div className="progress-circle">
            <svg className="progress-svg" viewBox="0 0 120 120">
              <circle className="bg" cx="60" cy="60" r="52" />
              <circle
                className="progress"
                cx="60"
                cy="60"
                r="52"
                strokeDasharray="327"
                strokeDashoffset={0}
              />
            </svg>
            <div className="progress-text">{animatedTotal}</div>
          </div>

          {/* ✅ BELOW circle */}
          <p className="progress-label">Total Visitors</p>
        </div>
      </div>

      {/* ✅ Trust + Disclaimer Section */}
      <section className="trust-section">
        <div className="trust-card">
          <h2 className="trust-title">📌 Important Notice & Disclaimer</h2>

          <p className="trust-text">
            CricPrediction77 provides cricket analysis, insights, and
            informational content only. We do not provide betting services, do
            not facilitate gambling, and do not guarantee any match outcomes.
            All content is intended for educational and entertainment purposes
            only. Users are solely responsible for how they use the information.
            We strongly discourage illegal betting activities. Please follow
            applicable laws in your jurisdiction, including Telangana state
            laws. CricPrediction77 is not liable for any financial loss or
            decisions made based on our content.
          </p>

          <div className="trust-grid">
            {/* Accuracy Card */}
            <div className="trust-box">
              <h3 className="trust-subtitle">✅ Our Track Record</h3>
              <ul className="trust-list">
                We provide data-driven insights. No guarantees.
              </ul>

              <p className="trust-note">
                * Accuracy is based on our internal analysis history and past
                match results. Outcomes may vary due to real match conditions.
              </p>
              <p className="trust-note">
                * Insights are based on analysis models and do not guarantee
                outcomes.
              </p>
            </div>

            {/* Legal Card */}
            <div className="trust-box">
              <h3 className="trust-subtitle">⚖️ Legal & Responsible Use</h3>
              <ul className="trust-list">
                <li>
                  Predictions are provided for{" "}
                  <b>learning & cricket analysis</b>.
                </li>
                <li>
                  We are <b>not responsible</b> for any financial loss or
                  decisions.
                </li>
                <li>
                  Please follow your local laws; betting may be illegal in some
                  areas.
                </li>
                <li>We do not guarantee winnings. Cricket is unpredictable.</li>
              </ul>
            </div>

            {/* WhatsApp Card */}
            <div className="trust-box trust-box-highlight">
              <h3 className="trust-subtitle">📲 Need More Matches?</h3>
              <p className="trust-text">
                If any match is <b>not uploaded on the website</b>, it will be
                available via WhatsApp.
              </p>

              <p className="trust-text">
                👉 Click the <b>WhatsApp icon</b> on the homepage to contact us
                directly.
              </p>

              <button className="trust-whatsapp-btn" onClick={openWhatsapp}>
                Contact on WhatsApp
              </button>

              <p className="trust-note">
                We reply fast and share match updates, schedule changes and
                analysis summaries, and support via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mobile-footer">
        <div
          className="footer-item"
          onClick={() => window.open(SOCIAL_LINKS.instagram, "_blank")}
        >
          <FaInstagram className="footer-icon instagram" />
          <span>Instagram</span>
        </div>

        <div
          className="footer-item"
          onClick={() => window.open(SOCIAL_LINKS.telegram, "_blank")}
        >
          <FaTelegramPlane className="footer-icon telegram" />
          <span>Telegram</span>
        </div>

        <div
          className="footer-item"
          onClick={() => window.open(SOCIAL_LINKS.youtube, "_blank")}
        >
          <FaYoutube className="footer-icon youtube" />
          <span>YouTube</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
