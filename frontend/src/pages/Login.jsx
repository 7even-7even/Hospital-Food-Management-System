import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      // ✅ Get token and user from backend
      const token = res.data.token;
      const user = res.data.user;

      if (!token || !user) {
        throw new Error("Login response is missing token or user data.");
      }

      // ✅ Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Tell Navbar to update itself
      window.dispatchEvent(new Event("userLoggedIn"));

      alert("✅ Login successful!");

      // 🧭 Optional: Role-based navigation
      const role = user.role;
      if (role === "patient") navigate("/patient");
      else if (role === "dietitian") navigate("/dietitian/dashboard");
      else if (role === "management") navigate("/management/dashboard");
      else setError(err.response?.data?.message || "Login failed. Role Required");


    } catch (err) {
      console.error("❌ Login Error:", err);
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome!!!</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        <div className="auth-links">
          {/* <p><Link to="/forgot-password">Forgot Password?</Link></p> */}
          <p>Don’t have an account? <Link to="/register">Register</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
