import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  GraduationCap, 
  ArrowLeft, 
  Bookmark, 
  CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [fullName, setFullName] = useState("");
  const [cgpa, setCgpa] = useState(0.0);
  const [resume, setResume] = useState(null);


  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/internships/internship/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setInternship(response.data);
      } catch (err) {
        setError("Failed to load internship details.");
        console.error("Internship Details Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  const handleSave = () => {
    // Implement save functionality
    Toaster({
      title: "Internship Saved",
      description: "Internship has been saved to your list",
      status: "success"
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Oops!</h1>
      <p className="text-xl text-gray-600 mb-6">{error}</p>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );

  if (!internship) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Top navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center text-primary hover:bg-primary/10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to listings
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSave}
          className="flex items-center"
        >
          <Bookmark className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>

      {/* Company and position header */}
      <div className="flex items-center m-1">
        {internship.image && (
          <img
          src={internship.image ? `http://localhost:3000${internship.image}` : "/google_logo.png"}
            alt="Company Logo"
            className="w-20 h-20 object-contain rounded-lg"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold m-3">{internship.company}</h1>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Key details section */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-primary mr-3" />
          <span className="text-muted-foreground">Location:</span>
          <span className="ml-2 font-medium">{internship.location}</span>
        </div>
        
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-primary mr-3" />
          <span className="text-muted-foreground">Duration:</span>
          <span className="ml-2 font-medium">{internship.duration}</span>
        </div>
        
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-primary mr-3" />
          <span className="text-muted-foreground">Stipend:</span>
          <span className="ml-2 font-medium">{internship.stipend ? `₹${internship.stipend}` : "Unpaid"}</span>
        </div>
        
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-primary mr-3" />
          <span className="text-muted-foreground">Application Deadline:</span>
          <span className="ml-2 font-medium">
            {new Date(internship.deadline).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Description section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">About the Internship</h2>
        <p className="text-muted-foreground leading-relaxed">{internship.description}</p>
      </div>

      <Separator className="my-6" />

      <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Eligibility</h2>
        <p className="text-accent-foreground leading-relaxed">{internship.eligibility}</p>
      </div>

      <Separator className="my-6" />

      {/* Application section at the bottom */}
      <div className="mb-8">
        {isApplied ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-green-800">Your application has been submitted</p>
              <p className="text-sm text-green-700">We'll notify you when there's an update</p>
            </div>
          </div>
        ) : (
          <Card className="p-4 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">CGPA</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                step="0.01"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Upload Resume (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResume(e.target.files[0])}
                className="w-full"
              />
            </div>

            <Button
              disabled={!fullName || !cgpa || !resume}
              onClick={async () => {
                const token = localStorage.getItem('authToken');
                const formData = new FormData();
                formData.append("fullName", fullName);
                formData.append("cgpa", cgpa);
                formData.append("resume", resume);
                formData.append("internshipId", id);

                try {
                  const res = await axios.post(`http://localhost:3000/student/apply`, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${token}`,
                    },
                  });

                  setIsApplied(true);
                } catch (err) {
                  console.error("Application failed:", err);
                  alert("Error: " + (err.response?.data?.message || "Application failed"));
                }
              }}
              className="w-full h-12 text-lg"
            >
              Apply Now
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InternshipDetails;
