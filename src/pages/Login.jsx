import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictionApiFetch } from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // predictionApiFetch already returns parsed JSON
      const data = await predictionApiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (!data) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }

      // Store admin data
      localStorage.setItem(
        "admin",
        JSON.stringify({
          id: 1,
          username: "AjayReddy",
          role: "SUPER_ADMIN",
        })
      );

      // Navigate to admin page
      navigate("/admin");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;
