import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, MoveRight, Sparkles, UserPlus, Users } from 'lucide-react';
import axios from "axios";
import { getApiUrl } from '../config/api';
import './signup.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    regId: "",
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Form Data Before API Call:", formData);

    try {
      const response = await axios.post(getApiUrl("/register/signup"), formData);
      
      console.log("Signup Successful:", response.data);
      navigate("/internships"); // Redirect to dashboard after signup
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed!");
      console.log("Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-shell">
      <div className="signup-noise" aria-hidden="true" />

      <section className="signup-panel reveal delay-1">
        <Link to="/" className="signup-brand">
          <span className="brand-mark" />
          <span>IMPing</span>
        </Link>

        <div className="panel-head">
          <p className="panel-kicker">
            <Sparkles size={16} />
            Create Account
          </p>
          <h2>Start your internship journey with a better system.</h2>
          <p>Register with your academic details and move from discovery to applications faster.</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="field-group">
            <Label htmlFor="regId">Registration ID</Label>
            <Input
              id="regId"
              type="text"
              name="regId"
              placeholder="eg. C2K230000"
              value={formData.regId}
              onChange={handleChange}
              required
              className="signup-input"
            />
          </div>

          <div className="field-group two-col">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Name Surname"
                value={formData.name}
                onChange={handleChange}
                required
                className="signup-input"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="signup-input"
              />
            </div>
          </div>

          <div className="field-group two-col">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="signup-input"
              />
            </div>
            <div>
              <Label htmlFor="password2">Confirm Password</Label>
              <Input
                id="password2"
                type="password"
                name="password2"
                placeholder="Re-enter password"
                value={formData.password2}
                onChange={handleChange}
                required
                className="signup-input"
              />
            </div>
          </div>

          <div className="error-slot">
            {error && <p className="form-error">{error}</p>}
          </div>

          <Button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Signing Up..." : "Create Account"}
            {!loading && <MoveRight size={16} />}
          </Button>
        </form>

        <div className="panel-footer">
          <p>
            Already have an account? <button type="button" onClick={() => navigate("/register/login")}>Login</button>
          </p>
          <Link to="/">Back to Home</Link>
        </div>
      </section>

      <section className="signup-side reveal delay-2">
        <h3>Built for both students and placement teams.</h3>
        <p>IMPing creates one reliable workflow for campus opportunities, updates, and outcomes.</p>

        <div className="side-points">
          <article>
            <UserPlus size={17} />
            Fast onboarding for new students
          </article>
          <article>
            <GraduationCap size={17} />
            Internship-focused data capture
          </article>
          <article>
            <Users size={17} />
            Role-aware experience for admin and student users
          </article>
        </div>
      </section>
    </div>
  );
};

export default SignupPage;