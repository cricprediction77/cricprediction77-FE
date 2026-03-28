import { useLocation, useNavigate } from "react-router-dom";
import { getTeamLogo } from "../utils/LeagueTeamLogos";
import React, { useRef, useState } from "react";
import { predictionApiFetch } from "../services/api";
import "./BookingPage.css";

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showPayment, setShowPayment] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("");
  const paymentRef = useRef(null);
  const [utrError, setUtrError] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const termsRef = useRef(null);

  const whatsappNumber = "917842435725"; // 🔁 replace with your number
  const whatsappMessage = encodeURIComponent(
    "Hi, I have subscribed for premium cricket analysis. Please share access.",
  );

  const goToPaymentSection = (amount) => {
    setSelectedAmount(amount);
    setShowTerms(true);

    // 🔥 SCROLL AFTER RENDER
    setTimeout(() => {
      termsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const upiId = "cricprediction77@ibl";
  const [copied, setCopied] = useState(false);

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      // fallback for some browsers
      const textArea = document.createElement("textarea");
      textArea.value = upiId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };
  React.useEffect(() => {
    if (showPayment) {
      setTimeout(() => {
        paymentRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [showPayment]);

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
          title="Premium Match Insights"
          price="INR 4000"
          features={[
            "Toss Insights Report",
            "Match Insights Report",
            "Performance-based probability insights",
            "Advanced Stats & Patterns",
          ]}
          goToPaymentSection={goToPaymentSection}
        />

        <PackageCard
          title="Session Insights Report"
          price="INR 2000"
          features={["Advanced Stats & Patterns"]}
          disabled={[
            // "Winner Prediction",
            "Match Insights Report",
            "Toss Trend Analysis",
          ]}
          goToPaymentSection={goToPaymentSection}
        />

        <PackageCard
          title="Toss Trend Analysis"
          price="INR 1000"
          features={["Toss Trend Analysis"]}
          disabled={[
            "Advanced Stats & Patterns",
            // "Winner Prediction",
            "Match Insights Report",
          ]}
          goToPaymentSection={goToPaymentSection}
        />

        <PackageCard
          title="Match Insights Report"
          price="INR 2000"
          features={["Team Performance Insights"]}
          disabled={["Toss Trend Analysis", "Advanced Stats & Patterns"]}
          goToPaymentSection={goToPaymentSection}
        />

        <PackageCard
          title="Toss + Match Insights Report"
          price="INR 2500"
          features={["Toss & Match Insights"]}
          disabled={["Advanced Stats & Patterns"]}
          goToPaymentSection={goToPaymentSection}
        />
      </div>
      {showTerms && !showPayment && (
        <div className="terms-section" ref={termsRef}>
          <h2>Terms & Conditions</h2>

          <div className="terms-box">
            <p>
              1. This platform provides cricket analysis, insights, and reports
              based on data.
            </p>
            <p>2. We do NOT guarantee any match results or outcomes.</p>
            <p>
              3. This service is strictly for informational and educational
              purposes only.
            </p>
            <p>
              4. We do NOT promote betting, gambling, or illegal activities.
            </p>
            <p>
              5. Users are solely responsible for how they use the information.
            </p>
            <p>
              6. CricPrediction77 is not liable for any financial loss or
              decisions made.
            </p>
            <p>
              7. No refunds will be provided once the report/service is
              delivered.
            </p>
            <p>8. Sharing or reselling reports is strictly prohibited.</p>
            <p>
              9. Any misuse of the platform may result in access restriction.
            </p>
            <p>
              10. By proceeding, you confirm that you understand and accept all
              risks.
            </p>
          </div>

          <div className="terms-checkbox">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <label>I have read and agree to the Terms & Conditions</label>
          </div>

          <button
            className="payment-done-btn"
            disabled={!accepted}
            onClick={() => setShowPayment(true)}
            style={{
              opacity: accepted ? 1 : 0.5,
              cursor: accepted ? "pointer" : "not-allowed",
            }}
          >
            Continue to Payment
          </button>
        </div>
      )}
      {showPayment && !submitted && (
        <div className="payment-section" ref={paymentRef}>
          <h3>
            This subscription gives access to cricket insights and analysis
            reports.{" "}
            <span style={{ color: "red", fontWeight: "bold" }}>
              {selectedAmount}
            </span>
          </h3>

          <p className="mini-disclaimer">
            Subscription provides access to analysis content and insights, not
            guaranteed outcomes for any specific match.
          </p>

          <img
            src="https://dko97fmntp7zh.cloudfront.net/84da7064-346c-463b-9975-7831267528aa_paymentQr.png"
            alt="UPI QR"
            className="upi-qr"
          />

          <p
            className="upi-id"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>UPI ID: {upiId}</span>

            <button
              type="button"
              onClick={copyUpiId}
              title="Copy UPI ID"
              style={{
                background: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {copied ? "✅" : "⧉"}
            </button>
          </p>

          {!showForm ? (
            <button
              className="payment-done-btn"
              onClick={() => setShowForm(true)}
            >
              Submit Subscription Details
            </button>
          ) : (
            <form
              className="payment-form"
              onSubmit={async (e) => {
                e.preventDefault();

                const formData = {
                  name: e.target[0].value,
                  utrId: e.target[1].value,
                  amount: e.target[2].value,
                  matchName: match.teams,
                  matchDate: match.matchDate,
                  termsAccepted: accepted, // 🔥 IMPORTANT
                };

                try {
                  const res = await predictionApiFetch("/api/payments", {
                    method: "POST",
                    body: JSON.stringify(formData),
                  });

                  // ✅ success
                  setUtrError("");
                  setSubmitted(true);
                } catch (error) {
                  console.error("Payment submit error:", error);

                  if (typeof error === "string" && error.includes("TERMS")) {
                    alert("Please accept Terms & Conditions ❗");
                  }

                  // 🔥 HANDLE DUPLICATE UTR
                  if (typeof error === "string" && error.includes("UTR")) {
                    setUtrError(error);
                  } else {
                    setUtrError("Something went wrong ❌");
                  }
                }
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
              {utrError && <div className="utr-error">{utrError}</div>}

              <input placeholder="Amount Paid" required />

              <button type="submit">Submit</button>
            </form>
          )}
        </div>
      )}
      {submitted && (
        <div className="whatsapp-section">
          <p>
            After subscribing,
            <br />
            our team will contact you with access details.
          </p>

          <img
            src="https://dko97fmntp7zh.cloudfront.net/c9d8ec1c-6658-48a1-9c5f-2ec1f6eb4eb5_Media%20(5).jpg"
            alt="WhatsApp"
            className="whatsapp-icon"
            onClick={() =>
              window.open(
                `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
                "_blank",
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
  goToPaymentSection,
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

      <button
        className="package-buy-btn"
        onClick={() => goToPaymentSection(price)}
      >
        Get Detailed Analysis
      </button>
    </div>
  );
}

export default BookingPage;
