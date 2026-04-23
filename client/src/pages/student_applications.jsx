
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/config/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, ExternalLink, ArrowLeft, Sparkles, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import './student_applications.css';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [companyQuery, setCompanyQuery] = useState('');
  const navigate = useNavigate();

  const fetchApplications = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("You must be logged in");
      navigate("/register/login");
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(getApiUrl("/student/my-applications"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(response.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/register/login");
        return;
      }
      setError("Failed to load your applications.");
      toast.error("Failed to load your applications.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Selected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const filteredApplications = useMemo(() => {
    let result = [...applications];

    if (statusFilter !== 'All') {
      result = result.filter((app) => (app.status || 'Pending') === statusFilter);
    }

    if (companyQuery.trim()) {
      const q = companyQuery.toLowerCase();
      result = result.filter((app) => (app.internshipId?.company || '').toLowerCase().includes(q));
    }

    return result;
  }, [applications, statusFilter, companyQuery]);

  const statusCounts = useMemo(() => {
    const counts = { All: applications.length, Pending: 0, Selected: 0, Rejected: 0 };
    applications.forEach((app) => {
      const key = app.status || 'Pending';
      if (counts[key] !== undefined) counts[key] += 1;
    });
    return counts;
  }, [applications]);

  if (loading) {
    return (
      <div className="apps-shell apps-loading">
        <div className="apps-loader" />
        <p>Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="apps-shell">
      <div className="apps-noise" aria-hidden="true" />
      <div className="apps-container">
        <div className="apps-topbar reveal delay-1">
          <Button variant="ghost" className="apps-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="apps-head reveal delay-1">
          <div>
            <p className="apps-kicker">
              <Sparkles size={15} />
              Student Workspace
            </p>
            <h1>My Internship Applications</h1>
            <p>Track all applications in one place and monitor status changes quickly.</p>
          </div>
          <div className="apps-stats">
            <article><span>{statusCounts.All}</span><small>Total</small></article>
            <article><span>{statusCounts.Pending}</span><small>Pending</small></article>
            <article><span>{statusCounts.Selected}</span><small>Selected</small></article>
          </div>
        </div>

        <div className="apps-controls reveal delay-2">
          <div className="apps-search-wrap">
            <Search size={14} className="apps-search-icon" />
            <input
              type="text"
              value={companyQuery}
              onChange={(e) => setCompanyQuery(e.target.value)}
              placeholder="Search by company"
            />
          </div>

          <div className="apps-filter-chips">
            {['All', 'Pending', 'Selected', 'Rejected'].map((status) => (
              <button
                key={status}
                type="button"
                className={statusFilter === status ? 'active' : ''}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="apps-empty reveal delay-2">
            <p>{error}</p>
            <Button onClick={fetchApplications}>Retry</Button>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="apps-empty reveal delay-2">
            <p>{applications.length === 0 ? "You haven't applied to any internships yet." : "No applications match your filter."}</p>
            <Button onClick={() => navigate('/internships')}>Browse Internships</Button>
          </div>
        ) : (
          <div className="apps-list reveal delay-2">
          {filteredApplications.map((app) => (
            <Card key={app._id} className="apps-card">
              <div className="apps-card-grid">
                <div>
                  <h2 className="apps-company">{app.internshipId?.company || "Unknown Company"}</h2>

                  <div className="apps-meta-grid">
                    <div>
                      <p className="apps-meta-label">Applied as</p>
                      <p className="apps-meta-value">{app.name}</p>
                    </div>
                    <div>
                      <p className="apps-meta-label">CGPA</p>
                      <p className="apps-meta-value">{app.cgpa}</p>
                    </div>
                    <div>
                      <p className="apps-meta-label">Email</p>
                      <p className="apps-meta-value">{app.email}</p>
                    </div>
                    <div>
                      <p className="apps-meta-label">Mobile</p>
                      <p className="apps-meta-value">{app.mobile}</p>
                    </div>
                  </div>
                </div>

                <div className="apps-status-col">
                  <div className="apps-status-line">
                    {getStatusIcon(app.status)}
                    <span className={`apps-status-text ${
                      app.status === 'Selected' ? 'selected' :
                      app.status === 'Rejected' ? 'rejected' : 'pending'
                    }`}>
                      {app.status || 'Pending'}
                    </span>
                  </div>

                  <div className="apps-actions">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/internships/internship/${app.internshipId?._id}`)}
                    >
                      View Internship Details
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full flex items-center gap-2"
                      onClick={() => window.open(app.resume, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Resume
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default StudentApplications;



