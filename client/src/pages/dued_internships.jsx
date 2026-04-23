import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InternshipCard from '@/components/ui/internship_card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarX2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getApiUrl } from '../config/api';
import './dued_internships.css';

const DuedInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchInternships = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {

        console.error("Invalid token");
        localStorage.removeItem("authToken");
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
        return deadline < now;
      });

      setInternships(filteredInternships);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch internships:', error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  if (loading) {
    return (
      <div className="dued-shell dued-loading">
        <div className="dued-loader" />
        <p>Loading internships...</p>
      </div>
    );
  }

  return (
    <div className="dued-shell">
      <div className="dued-noise" aria-hidden="true" />
      <div className="dued-container">
        <div className="dued-topbar reveal delay-1">
          <Button variant="ghost" className="dued-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="dued-head reveal delay-1">
          <div>
            <p className="dued-kicker">
              <Sparkles size={15} />
              Admin Tracking
            </p>
            <h1>Due Internships</h1>
            <p>Review expired listings and clean up completed opportunities from the active board.</p>
          </div>
          <article className="dued-stat">
            <CalendarX2 size={16} />
            <span>{internships.length}</span>
            <small>Expired listings</small>
          </article>
        </div>

        {internships.length === 0 ? (
            <div className="dued-empty reveal delay-2">
              <p>No expired internships found.</p>
              <span>All good for now. Check again later.</span>
            </div>
        ) : (
            <div className="dued-grid reveal delay-2">
                {internships.map((internship, index) => (
                <InternshipCard key={index} {...internship} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default DuedInternships;
