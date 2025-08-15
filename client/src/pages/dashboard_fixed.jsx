import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import InternshipCard from '@/components/ui/internship_card';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { API_ENDPOINTS, apiConfig } from '../config/api';

const Dashboard = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const fetchInternships = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Invalid token");
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
      const response = await axios.get(`${apiConfig.baseURL}${API_ENDPOINTS.internships}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const now = new Date();
      
      // Ensure response.data is an array
      const data = Array.isArray(response.data) ? response.data : [];

      const filteredInternships = data.filter(internship => {
        const deadline = new Date(internship.deadline);
        return deadline >= now;
      });

      setInternships(filteredInternships);
    } catch (error) {
      console.error('Failed to fetch internships:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/register/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  const handleAddInternship = () => {
    navigate('/add-internship');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading internships...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Available Internships</h1>
        {role === "admin" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleAddInternship}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Internship
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new internship opportunity</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {internships.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600 mb-4">No internships available</h2>
          <p className="text-gray-500">Check back later for new opportunities!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship) => (
            <InternshipCard 
              key={internship._id} 
              {...internship} 
              onDelete={fetchInternships}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
