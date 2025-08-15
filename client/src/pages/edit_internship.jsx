import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AlertTriangle, Save, ArrowLeft } from 'lucide-react';
import { getApiUrl } from '../config/api';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const EditInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    company: "",
    description: "",
    stipend: "",
    deadline: "",
    image: "",
    location: "",
    eligibility: "",
    duration: "",
  });
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === "admin") {
          setIsAdmin(true);
        } else {
          // Redirect non-admin users
          navigate("/internships");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/register/login");
      }
    } else {
      navigate("/register/login");
    }
  }, [navigate]);
  
  // Fetch internship data
  useEffect(() => {
    const fetchInternship = async () => {
      if (!isAdmin) return;
      
      try {
        const response = await axios.get(getApiUrl(`/internships/internship/${id}`), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          }
        });
        
        const internship = response.data;
        
        // Format the date for the input field (YYYY-MM-DD)
        let formattedDate = "";
        if (internship.deadline) {
          const date = new Date(internship.deadline);
          formattedDate = date.toISOString().split('T')[0];
        }
        
        setFormData({
          company: internship.company || "",
          description: internship.description || "",
          stipend: internship.stipend || "",
          deadline: formattedDate,
          image: internship.image || "",
          location: internship.location || "",
          eligibility: internship.eligibility || "",
          duration: internship.duration || "",
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching internship:", error);
        showError("Failed to fetch internship details. Please try again.");
        setLoading(false);
      }
    };
    
    if (isAdmin) {
      fetchInternship();
    }
  }, [id, isAdmin, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }
    
    // Number validation
    if (formData.stipend && isNaN(Number(formData.stipend))) {
      newErrors.stipend = "Stipend must be a number";
    }
    
    // Date validation
    if (formData.deadline) {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(formData.deadline)) {
        newErrors.deadline = "Date must be in YYYY-MM-DD format";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const showError = (message) => {
    setErrorMessage(message);
    setErrorDialogOpen(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      stipend: formData.stipend ? Number(formData.stipend) : undefined,
    };

    if (formData.imageFile) {
      // If a file is uploaded, send the file
      formData.append("image", formData.imageFile);
    }
    
    try {
      await axios.put(getApiUrl(`/admin/update-internship/${id}`), submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      
      // Navigate to homepage after successful update
      navigate("/internships", { replace: true });
    } catch (error) {
      console.error("Error updating internship:", error);
      showError(error.response?.data?.message || "Failed to update internship. Please try again.");
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading internship details...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Internship</CardTitle>
          <CardDescription>
            Update the internship details below
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={errors.company ? "border-red-500" : ""}
                required
              />
              {errors.company && (
                <p className="text-red-500 text-sm">{errors.company}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stipend">Stipend (₹)</Label>
                <Input
                  id="stipend"
                  name="stipend"
                  type="number"
                  value={formData.stipend}
                  onChange={handleChange}
                  className={errors.stipend ? "border-red-500" : ""}
                />
                {errors.stipend && (
                  <p className="text-red-500 text-sm">{errors.stipend}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={errors.deadline ? "border-red-500" : ""}
                />
                {errors.deadline && (
                  <p className="text-red-500 text-sm">{errors.deadline}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUpload">Upload New Image</Label>
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
              />
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eligibility">Eligibility</Label>
              <Textarea
                id="eligibility"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="mt-5"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting}
              className="mt-5"
            >
              {submitting ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Error Dialog */}
      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Error
            </AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditInternship;