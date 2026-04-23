
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import InternshipCard from '@/components/ui/internship_card';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, CalendarClock, Plus, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getApiUrl } from '../config/api';
import './dashboard.css';

const Dashboard = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchInternships = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("authToken");
          navigate("/register/login");
          return;
        }
        setRole(decoded.role);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("authToken");
        navigate("/register/login");
        return;
      }
    } else {
      console.error("No token found");
      navigate("/register/login");
      return;
    }

    try {
      const response = await axios.get(getApiUrl("/internships"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const now = new Date();

      const filteredInternships = response.data.filter(internship => {
        const deadline = new Date(internship.deadline);
        return deadline >= now;
      });

      setInternships(filteredInternships);
    } catch (error) {
      console.error('Failed to fetch internships:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/register/login");
        return;
      }
      setError("Could not load internships. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  if (loading) {
    return (
      <div className="dashboard-shell dashboard-loading">
        <div className="loading-wrap">
          <div className="loading-ring" />
          <p>Loading internships...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-shell dashboard-loading">
        <div className="loading-wrap">
          <p>{error}</p>
          <Button onClick={fetchInternships} className="mt-2">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-noise" aria-hidden="true" />

      <section className="dashboard-head reveal delay-1">
        <div>
          <p className="head-kicker">
            <Sparkles size={15} />
            Internship Board
          </p>
          <h1>Explore active opportunities from top companies.</h1>
          <p>
            Track open roles, compare deadlines, and move quickly on the opportunities that match your goals.
          </p>
        </div>
        <div className="head-stats">
          <article>
            <BriefcaseBusiness size={16} />
            <span>{internships.length}</span>
            <p>Open internships</p>
          </article>
          <article>
            <CalendarClock size={16} />
            <span>{new Date().toLocaleDateString()}</span>
            <p>Updated today</p>
          </article>
        </div>
      </section>

      <div className="dashboard-grid-wrap reveal delay-2">
        {internships.length === 0 ? (
          <div className="empty-state">
            <p>No internships available right now.</p>
            <span>
              Check back later for new opportunities!
            </span>
          </div>
        ) : (
          <div className="internship-grid">
            {internships.map((internship, index) => (
              <InternshipCard key={index} {...internship} />
            ))}
          </div>
        )}
      </div>

      {role === "admin" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => navigate("/admin/add-internship")}
                className="add-fab"
              >
                <Plus className="w-7 h-7 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Internship</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default Dashboard;
