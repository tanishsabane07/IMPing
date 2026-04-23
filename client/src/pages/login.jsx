import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Eye, EyeOff, KeyRound, MoveRight, ShieldCheck, Sparkles } from 'lucide-react';
import axios from "axios";
import { getApiUrl } from '../config/api';
import './login.css';

const LoginPage = () => {
  const [regId, setRegId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(getApiUrl("/register/login"), {
        regId,
        password,
      });
      
      console.log("Login Successful:", response.data);
      localStorage.setItem("authToken", response.data.token);
      navigate("/internships");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-noise" aria-hidden="true" />

      <section className="login-hero reveal delay-1">
        <Link to="/" className="login-brand">
          <span className="brand-mark" />
          <span>IMPing</span>
        </Link>

        <p className="hero-kicker">
          <Sparkles size={16} />
          Welcome Back
        </p>

        <h1>Sign in and continue managing internships with clarity.</h1>
        <p className="hero-copy">
          One place for publishing opportunities, tracking applications, and helping students move faster.
        </p>

        <div className="hero-points">
          <article>
            <ShieldCheck size={16} />
            Role-aware access and secure session handling
          </article>
          <article>
            <KeyRound size={16} />
            Admin and student login in the same streamlined flow
          </article>
        </div>
      </section>

      <section className="login-panel reveal delay-2">
        <div className="panel-head">
          <h2>Login</h2>
          <p>Use your registration ID and password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <Label htmlFor="regId">Registration ID</Label>
            <Input
              id="regId"
              type="text"
              placeholder="eg. C2K230000"
              value={regId}
              onChange={(e) => setRegId(e.target.value)}
              required
              className="login-input"
            />
          </div>

          <div className="field-group">
            <Label htmlFor="password">Password</Label>
            <div className="password-wrap">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input with-action"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="error-slot">
            {error && <p className="form-error">{error}</p>}
          </div>

          <Button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <MoveRight size={16} />}
          </Button>
        </form>

        <div className="panel-footer">
          <p>
            New here? <button type="button" onClick={() => navigate("/register/signup")}>Create account</button>
          </p>
          <Link to="/">Back to Home</Link>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;