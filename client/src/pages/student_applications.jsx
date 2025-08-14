import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("You must be logged in");
      navigate("/register/login");
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.myApplications, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        toast.error("Failed to load your applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">My Internship Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven't applied to any internships yet.</p>
          <Button onClick={() => navigate('/internships')}>Browse Internships</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app._id} className="p-6 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Internship Details */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold">
                    {app.internshipId?.company || "Unknown Company"}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Applied as</p>
                      <p className="font-medium">{app.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CGPA</p>
                      <p className="font-medium">{app.cgpa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{app.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mobile</p>
                      <p className="font-medium">{app.mobile}</p>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-4">
                    {getStatusIcon(app.status)}
                    <span className={`font-medium ${
                      app.status === 'Selected' ? 'text-green-500' :
                      app.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="space-y-2">
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
                      onClick={() => window.open(API_ENDPOINTS.getResumeUrl(app.resume), '_blank')}
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

      <Separator className="my-8" />
    </div>
  );
};

export default StudentApplications;



