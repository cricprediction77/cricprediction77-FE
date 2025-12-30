import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";
import ViewPrediction from "./pages/ViewPrediction";
import Login from "./pages/Login";
import Admin from "./pages/Admin"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy-now" element={<BookingPage />} />
        <Route path="/view-prediction" element={<ViewPrediction />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
