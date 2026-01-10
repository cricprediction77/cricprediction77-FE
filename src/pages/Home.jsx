import React, { useCallback, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getTeamLogo } from "../utils/LeagueTeamLogos";
import { useNavigate } from "react-router-dom";
import { predictionApiFetch } from "../services/api";
import "./Home.css";

function Home() {
  const [allMatches, setAllMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [activeTab, setActiveTab] = useState("TODAY");
  const [expandedLeagues, setExpandedLeagues] = useState({});

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

    const matchDateTime = new Date(`${matchDate}T${startTime}:00`);
    const now = new Date();
    const diff = matchDateTime - now;

    if (diff <= 0) return "Match Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // ⏱ Refresh countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setFilteredMatches((prev) => [...prev]);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAllLeagueData = async () => {
      try {
        const [bplData, wplData, mensBblData, saT20Data, superSmashData] =
          await Promise.all([
            predictionApiFetch("/api/bpl/bpl-matches"),
            predictionApiFetch("/api/wpl/wpl-matches"),
            predictionApiFetch("/api/mens-bbl/bbl-matches"),
            predictionApiFetch("/api/sa-t20/sat20-matches"),
            predictionApiFetch("/api/super-smash/supersmash-matches"), // ✅ NEW
          ]);

        const combinedMatches = [
          ...(bplData?.matches || []),
          ...(wplData?.matches || []),
          ...(mensBblData?.matches || []),
          ...(saT20Data?.matches || []),
          ...(superSmashData?.matches || []), // ✅ NEW
        ];

        setAllMatches(combinedMatches);
        filterMatches("TODAY", combinedMatches);
      } catch (error) {
        console.error("Error fetching league data", error);
      }
    };

    fetchAllLeagueData();
  }, []);

  const filterMatches = useCallback(
    (type, matches = allMatches) => {
      setActiveTab(type);

      const today = new Date().toISOString().split("T")[0];
      let result = [];

      if (type === "TODAY") {
        result = matches.filter(
          (m) => m.matchDate === today && m.matchStatus === null
        );
      }

      if (type === "UPCOMING") {
        result = matches.filter((m) => m.matchDate > today);
      }

      if (type === "COMPLETED") {
        result = matches
          .filter((m) =>
            ["COMPLETED", "ABANDONED", "POSTPONED", "CANCELLED"].includes(
              m.matchStatus
            )
          )
          .sort((a, b) => Number(b.matchNumber) - Number(a.matchNumber)); // ✅ DESC
      }

      setFilteredMatches(result);
    },
    [allMatches]
  );

  const whatsappNumber = "917842435725";
  const whatsappMessage = encodeURIComponent(
    "Hi, I would like to know more about your match predictions."
  );

  const openWhatsapp = () => {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
      "_blank"
    );
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          Cric<span>Prediction77</span>
        </div>
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
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
              <h2>IPL Predictions</h2>
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
              src="https://dko97fmntp7zh.cloudfront.net/02532756-d960-4b8a-a00f-b230bfe322d4_AA1R8jDz.jpg"
              alt="WPL"
            />

            <div className="overlay">
              <h2>WPL Predictions</h2>
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
              <h2>BPL Predictions</h2>
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
              <h2>BBL Predictions</h2>
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
              <h2>SA-T20 Predictions</h2>
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
      <div className="quick-actions">
        <button
          className={`action-card ${activeTab === "TODAY" ? "active" : ""}`}
          onClick={() => filterMatches("TODAY")}
        >
          Today's Matches
        </button>

        <button
          className={`action-card ${activeTab === "UPCOMING" ? "active" : ""}`}
          onClick={() => filterMatches("UPCOMING")}
        >
          Upcoming Matches
        </button>

        <button
          className={`action-card ${activeTab === "COMPLETED" ? "active" : ""}`}
          onClick={() => filterMatches("COMPLETED")}
        >
          Completed Matches
        </button>
      </div>

      {/* Matches */}
      <main className="match-section">
        <h3 className="section-title">{activeTab} Matches</h3>

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
            }, {})
          ).map(([league, matches]) => {
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
                            match.teams.split(" vs ")[0]
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
                            match.teams.split(" vs ")[1]
                          )}
                          alt=""
                          className="team-logo"
                        />
                        {match.teams.split(" vs ")[1]}
                      </div>
                    </div>

                    {/* TODAY & UPCOMING */}
                    {activeTab !== "COMPLETED" && (
                      <>
                        <div className="countdown-timer">
                          Starts in:{" "}
                          {getCountdown(match.matchDate, match.approxStartTime)}
                        </div>

                        <hr className="card-divider" />

                        <div className="buy-row">
                          <p className="buy-text">
                            Get Expert prediction for this match
                          </p>

                          <button
                            className="buy-now-btn"
                            onClick={() =>
                              navigate("/buy-now", { state: { match } })
                            }
                          >
                            Buy Now
                          </button>
                        </div>
                      </>
                    )}

                    {/* COMPLETED */}
                    {activeTab === "COMPLETED" && (
                      <>
                        <hr className="card-divider" />

                        <div className="buy-row">
                          <p className="buy-text">
                            {match.matchStatus === "COMPLETED"
                              ? "Check expert prediction for this match"
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
                              View Prediction
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

      {/* ✅ Trust + Disclaimer Section */}
      <section className="trust-section">
        <div className="trust-card">
          <h2 className="trust-title">📌 Important Notice & Disclaimer</h2>

          <p className="trust-text">
            CricPrediction77 provides match analysis and prediction content{" "}
            <b>only for educational and informational purposes</b>. We do{" "}
            <b>not promote betting, gambling, or any illegal activity</b>.
          </p>

          <div className="trust-grid">
            {/* Accuracy Card */}
            <div className="trust-box">
              <h3 className="trust-subtitle">✅ Our Track Record</h3>
              <ul className="trust-list">
                <li>
                  <b>IPL:</b> 98% Accuracy
                </li>
                <li>
                  <b>WPL:</b> 99% Accuracy
                </li>
                <li>
                  <b>BPL:</b> 96% Accuracy
                </li>
                <li>
                  <b>BBL:</b> 95% Accuracy
                </li>
                <li>
                  <b>SA-T20:</b> 94% Accuracy
                </li>
                <li>
                  <b>Super Smash:</b> 92% Accuracy
                </li>
              </ul>

              <p className="trust-note">
                * Accuracy is based on our internal analysis history and past
                match results. Outcomes may vary due to real match conditions.
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
                additional predictions through WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <div className="mobile-footer">
        <div className="footer-item active">Home</div>
        <div className="footer-item">Matches</div>
        <div className="footer-item">Predict</div>
        <div className="footer-item">Profile</div>
      </div> */}
    </div>
  );
}

export default Home;
