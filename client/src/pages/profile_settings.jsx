
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from '@/config/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import './profile_settings.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/register/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(getApiUrl("/profile"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/register/login");
          return;
        }
        setError("Failed to load user profile. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="profile-shell">
      <div className="profile-noise" aria-hidden="true" />
      <div className="profile-container">
        <div className="profile-topbar reveal delay-1">
          <Button variant="ghost" className="profile-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card className="profile-card reveal delay-2">
        <CardHeader className="text-center profile-header">
          <p className="profile-kicker">
            <Sparkles size={15} />
            Account Profile
          </p>
          <Avatar className="h-24 w-24 mx-auto profile-avatar">
            <AvatarImage src={user?.avatar || "/placeholder.png"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl mt-3 profile-name">{user?.name || "User"}</CardTitle>
          <p className="profile-role">{user?.role}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && user && (
            <div className="profile-fields">
              <div className="profile-row">
                <span className="profile-label"><UserRound size={14} /> Registration ID</span>
                <span>{user.regId}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label"><UserRound size={14} /> Name</span>
                <span>{user.name}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label"><ShieldCheck size={14} /> Department</span>
                <span>{user.dept}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label"><Mail size={14} /> Email</span>
                <span>{user.email}</span>
              </div>

            </div>
          )}

          {!loading && !error && (
            <div className="text-center mt-4">
              <Button onClick={() => navigate("/internships")} className="profile-action-btn">Go to Dashboard</Button>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Profile;