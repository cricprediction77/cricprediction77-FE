import { useLocation, useNavigate } from "react-router-dom";
import { getTeamLogo } from "../utils/LeagueTeamLogos";
import React, { useState } from "react";
import "./BookingPage.css";

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showPayment, setShowPayment] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const whatsappNumber = "917842435725"; // 🔁 replace with your number
  const whatsappMessage = encodeURIComponent(
    "Hi, I have completed the payment for match prediction. Please find the receipt."
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const { match } = location.state || {};

  if (!match) {
    return <p>No match selected</p>;
  }

  return (
    <div className="booking-container">
      <h2 className="league-title">{match.leagueType}</h2>
      <h3 className="match-title">{match.teams}</h3>

      <div className="match-preview-card">
        <p className="match-preview-date">
          {formatDate(match.matchDate)} || Match No - {match.matchNumber}
        </p>

        <div className="team-preview">
          <img
            src={getTeamLogo(match.leagueType, match.teams.split(" vs ")[0])}
            alt=""
          />
          <span>{match.teams.split(" vs ")[0]}</span>
        </div>

        <span className="vs-text">VS</span>

        <div className="team-preview">
          <img
            src={getTeamLogo(match.leagueType, match.teams.split(" vs ")[1])}
            alt=""
          />
          <span>{match.teams.split(" vs ")[1]}</span>
        </div>
      </div>

      <div className="package-grid">
        <PackageCard
          title="Full Prediction"
          price="INR 4000"
          features={[
            "Toss Prediction",
            "Match Prediction",
            "Winner Prediction",
            "All Fancy Prediction",
          ]}
          setShowPayment={setShowPayment}
        />

        <PackageCard
          title="Session Prediction"
          price="INR 2000"
          features={["All Fancy Prediction"]}
          disabled={[
            // "Winner Prediction",
            "Match Prediction",
            "Toss Prediction",
          ]}
          setShowPayment={setShowPayment}
        />

        <PackageCard
          title="Toss Prediction"
          price="INR 1000"
          features={["Toss Winner Prediction"]}
          disabled={[
            "All Fancy Prediction",
            // "Winner Prediction",
            "Match Prediction",
          ]}
          setShowPayment={setShowPayment}
        />

        <PackageCard
          title="Match Prediction"
          price="INR 2000"
          features={[" Match Winner Prediction"]}
          disabled={[
            // "Match Prediction",
            "Toss Prediction",
            "All Fancy Prediction",
          ]}
          setShowPayment={setShowPayment}
        />

        <PackageCard
          title="Toss + Match Prediction"
          price="INR 2500"
          features={[" Toss and Match Winner Prediction"]}
          disabled={[
            // "Match Prediction",
            // "Toss Prediction",
            "All Fancy Prediction",
          ]}
          setShowPayment={setShowPayment}
        />
      </div>

      {showPayment && !submitted && (
        <div className="payment-section">
          <h3>Scan & Pay</h3>

          <img
            src="https://dko97fmntp7zh.cloudfront.net/91256485-3de8-4879-b00d-c0b909c4efeb_images.png" // 🔁 place QR image in public folder
            alt="UPI QR"
            className="upi-qr"
          />

          <p className="upi-id">Banking Name: Baddam Ajay</p>

          <p className="upi-id">UPI ID: crictpredict@upi</p>

          {!showForm ? (
            <button
              className="payment-done-btn"
              onClick={() => setShowForm(true)}
            >
              Payment Completed
            </button>
          ) : (
            <form
              className="payment-form"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <input placeholder="Account Holder Name" required />
              <input
                type="text"
                placeholder="UTR ID (12 digits)"
                maxLength={12}
                pattern="\d{12}"
                inputMode="numeric"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
                required
              />

              <input placeholder="Amount Paid" required />

              <button type="submit" style={{ background: "green" }}>
                Submit
              </button>
            </form>
          )}
        </div>
      )}
      {submitted && (
        <div className="whatsapp-section">
          <p>
            For faster report delivery,
            <br />
            please share your payment receipt via WhatsApp.
          </p>

          <img
            src="https://dko97fmntp7zh.cloudfront.net/c9d8ec1c-6658-48a1-9c5f-2ec1f6eb4eb5_Media%20(5).jpg"
            alt="WhatsApp"
            className="whatsapp-icon"
            onClick={() =>
              window.open(
                `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
                "_blank"
              )
            }
          />
        </div>
      )}

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
}

function PackageCard({
  title,
  price,
  features = [],
  disabled = [],
  setShowPayment,
}) {
  return (
    <div className="package-card">
      <h3>{title}</h3>
      <h2>{price}</h2>

      <ul>
        {features.map((item, i) => (
          <li key={i} className="active-feature">
            {item}
          </li>
        ))}
        {disabled.map((item, i) => (
          <li key={i} className="disabled-feature">
            {item}
          </li>
        ))}
      </ul>

      <button className="package-buy-btn" onClick={() => setShowPayment(true)}>
        Buy Now
      </button>
    </div>
  );
}

export default BookingPage;
