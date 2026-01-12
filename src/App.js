import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";
import ViewPrediction from "./pages/ViewPrediction";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ReportGenerate from "./pages/ReportGenerate";

// ✅ ADD THIS IMPORT
import WhatsappFloat from "./pages/WhatsappFloat";

function App() {
  return (
    <BrowserRouter>
      {/* ✅ global whatsapp icon */}
      <WhatsappFloat />

      <Routes>
        <Route path="/index.html" element={<Navigate to="/" replace />} />

        <Route path="/" element={<Home />} />
        <Route path="/buy-now" element={<BookingPage />} />
        <Route path="/view-prediction" element={<ViewPrediction />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/report-generate" element={<ReportGenerate />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
