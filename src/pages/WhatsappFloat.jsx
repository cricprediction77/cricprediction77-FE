import React from "react";
import "./WhatsappFloat.css";

function WhatsappFloat() {
  const whatsappNumber = "917842435725"; // ✅ Your number
  const whatsappMessage = encodeURIComponent(
    "Hi, I want to buy report."
  );

  const openWhatsapp = () => {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
      "_blank"
    );
  };

  return (
    <div className="whatsapp-float" onClick={openWhatsapp} title="Chat on WhatsApp">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="whatsapp-icon"
      />
    </div>
  );
}

export default WhatsappFloat;
