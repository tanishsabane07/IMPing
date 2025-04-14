import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InternshipCard from '@/components/ui/internship_card';
import { useNavigate } from 'react-router-dom';

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
      const response = await axios.get("http://localhost:3000/internships", {
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
      <div className="min-h-screen w-full bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-medium">Loading Internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white overflow-hidden">
        <div className="mt-24 px-4 z-[1] min-h-[calc(100vh-6rem)] w-full flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dued Internships</h1>

            {internships.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-600 overflow-hidden">
                <div className="text-center">
                <p className="text-2xl font-semibold">No internships available.</p>
                <p className="text-md text-gray-400 mt-2">
                    Check back later for new opportunities!
                </p>
                </div>
            </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-grow w-full">
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
