import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { apiConfig, API_ENDPOINTS } from "../config/api";

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
      const response = await axios.post(`${apiConfig.baseURL}${API_ENDPOINTS.register}/signup`, formData);
      
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label>Registration ID</Label>
              <Input
                type="text"
                name="regId"
                placeholder="eg. C2K230000"
                value={formData.regId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Name Surname"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                name="password2"
                placeholder="Re-enter your password"
                value={formData.password2}
                onChange={handleChange}
                required
              />
            </div>
            <div className='h-5'>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm">Already have an account?
                <Button variant="link" size="sm" onClick={() => navigate("/register/login")}>
                    Login
                </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;