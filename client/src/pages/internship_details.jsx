// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { MapPin, Clock, DollarSign, Calendar, GraduationCap, ArrowLeft, Bookmark, CheckCircle, ClipboardCheck } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { Toaster } from '@/components/ui/sonner';
// import { useDropzone } from 'react-dropzone';
// import { jwtDecode } from 'jwt-decode';
// import { Badge } from '@/components/ui/badge';

// const InternshipDetails = () => {
//   const { id } = useParams();     //get internship id
//   const navigate = useNavigate();
//   const [internship, setInternship] = useState(null);   //state to store internship details
//   const [loading, setLoading] = useState(true);       //loading state
//   const [error, setError] = useState(null);      //error state
//   const [showForm, setShowForm] = useState(false);
//   const [isApplied, setIsApplied] = useState(false);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [cgpa, setCgpa] = useState("");
//   const [resume, setResume] = useState(null);
//   const [role, setRole] = useState("");
//   const [status, setStatus] = useState("");



//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if(token) {
//       try {
//         const decoded = jwtDecode(token);
//         setRole(decoded.role);
//       } catch (error) {
//         console.error("Invalid token", error);
//         localStorage.removeItem("authToken");
//         navigate("/register/login");
//         return;
//       }
//     }
//     else {
//       console.error("No token found");
//       navigate("/register/login");
//       return;
//     }
//     const fetchInternship = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/internships/internship/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setInternship(response.data);
//       } catch (err) {
//         setError("Failed to load internship details.");
//         console.error("Internship Details Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     const checkIfApplied = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/applications/applied/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setIsApplied(response.data.applied);
//         setStatus(response.data.status);
//         setShowForm(false);
//       }
//       catch (err) {
//         console.error("Error checking application status:", err);
//       }
//     };

//     fetchInternship();
//     checkIfApplied();
//   }, [id, navigate]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: {
//       'application/pdf': ['.pdf'],
//     },
//     maxFiles: 1,
//     onDrop: (acceptedFiles) => {
//       if (acceptedFiles.length > 0) {
//         setResume(acceptedFiles[0]);
//       }
//     },
//   });
  

//   const handleSave = () => {
//     // Implement save functionality
//     Toaster({
//       title: "Internship Saved",
//       description: "Internship has been saved to your list",
//       status: "success"
//     });
//   };

//   const handleApply = async () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       Toaster({
//         title: "Authentication Error",
//         description: "Please log in to apply for the internship.",
//         status: "error"
//       });
//       return;
//     }

//     if (!fullName || !email || !mobile || !cgpa || !resume) {
//       Toaster({
//         title: "Missing Information",
//         description: "Please fill in all fields and upload your resume.",
//         status: "error"
//       });
//       return;
//     }
    
  
//     const formData = new FormData();
//     formData.append("fullName", fullName.trim());
//     formData.append("email", email.trim());
//     formData.append("mobile", mobile.trim());
//     formData.append("cgpa", cgpa);
//     formData.append("resume", resume);
//     formData.append("internshipId", id);
  
//     try {
//       const res = await axios.post(`http://localhost:3000/applications/apply/${id}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });
  
//       if (res.status === 201) {
//         setIsApplied(true);
//         setShowForm(false); // Optional: close the form
//       }
//     } catch (err) {
//       console.error("Application failed:", err);
//       const message = err.response?.data?.message || "There was an error submitting your application.";
//       Toaster({
//         title: "Application Failed",
//         description: message,
//         status: "error"
//       });
//     }
//   };
  

//   if (loading) return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
//       <h1 className="text-4xl font-bold text-red-500 mb-4">Oops!</h1>
//       <p className="text-xl text-gray-600 mb-6">{error}</p>
//       <Button onClick={() => navigate(-1)}>Go Back</Button>
//     </div>
//   );

//   if (!internship) return null;

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-3xl">
//       {/* Top navigation */}
//       <div className="flex justify-between items-center mb-6">
//         <Button 
//           variant="ghost" 
//           className="flex items-center text-primary hover:bg-primary/10"
//           onClick={() => navigate(-1)}
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to listings
//         </Button>
//         <Button 
//           variant="outline" 
//           size="sm" 
//           onClick={handleSave}
//           className="flex items-center"
//         >
//           <Bookmark className="h-4 w-4 mr-2" />
//           Save
//         </Button>
//       </div>

//       {/* Company and position header */}
//       <div className="flex items-center m-1">
//         {internship.image && (
//           <img
//           src={internship.image ? `http://localhost:3000${internship.image}` : "/google_logo.png"}
//             alt="Company Logo"
//             className="w-20 h-20 object-contain rounded-lg"
//           />
//         )}
//         <div>
//           <h1 className="text-2xl font-bold m-3">{internship.company}</h1>
//         </div>
//         {isApplied && (
//           <Badge className="bg-lime-500" variant="outline">{status}</Badge>
//         )}
//       </div>

//       <Separator className="my-6" />

//       {/* Key details section */}
//       <div className="space-y-4 mb-8">
//         <div className="flex items-center">
//           <MapPin className="h-5 w-5 text-primary mr-3" />
//           <span className="text-muted-foreground">Location:</span>
//           <span className="ml-2 font-medium">{internship.location}</span>
//         </div>
        
//         <div className="flex items-center">
//           <Clock className="h-5 w-5 text-primary mr-3" />
//           <span className="text-muted-foreground">Duration:</span>
//           <span className="ml-2 font-medium">{internship.duration}</span>
//         </div>
        
//         <div className="flex items-center">
//           <DollarSign className="h-5 w-5 text-primary mr-3" />
//           <span className="text-muted-foreground">Stipend:</span>
//           <span className="ml-2 font-medium">{internship.stipend ? `₹${internship.stipend}` : "Unpaid"}</span>
//         </div>
        
//         <div className="flex items-center">
//           <Calendar className="h-5 w-5 text-primary mr-3" />
//           <span className="text-muted-foreground">Application Deadline:</span>
//           <span className="ml-2 font-medium">
//             {new Date(internship.deadline).toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </span>
//         </div>
//       </div>

//       <Separator className="my-6" />

//       {/* Description section */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-4">About the Internship</h2>
//         <p className="text-muted-foreground leading-relaxed">{internship.description}</p>
//       </div>

//       <Separator className="my-6" />

//       <div className="mb-8">
//       <h2 className="text-xl font-semibold mb-4">Eligibility</h2>
//         <p className="text-accent-foreground leading-relaxed">{internship.eligibility}</p>
//       </div>

//       <Separator className="my-6" />

//       {/* Application section at the bottom */}
//       <div className="mb-8">
//       {isApplied ? (
//         <Button  className="w-full h-12 text-l bg-lime-500 hover:bg-lime-500 text-black text-xl font-semibold cursor-not-allowed border border-emerald-600 shadow-lg"><ClipboardCheck size={1}/>Applied
// </Button>

//         ) : showForm ? (
//           <Card className="p-4">
//             <div className="flex flex-col md:flex-row gap-8">
//               {/* Left Side - Fields */}
//               <div className="flex-1 space-y-4">
//                 <div>
//                   <label className="block mb-1 font-medium text-sm text-gray-700">Full Name</label>
//                   <input
//                     type="text"
//                     className="w-full border rounded px-3 py-2"
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-1 font-medium text-sm text-gray-700">Email</label>
//                   <input
//                     type="email"
//                     className="w-full border rounded px-3 py-2"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-1 font-medium text-sm text-gray-700">Mobile Number</label>
//                   <input
//                     type="tel"
//                     className="w-full border rounded px-3 py-2"
//                     value={mobile}
//                     onChange={(e) => setMobile(e.target.value)}
//                     pattern="[0-9]{10}"
//                   />
//                 </div>

//                 <div>
//                   <label className="block mb-1 font-medium text-sm text-gray-700">CGPA</label>
//                   <input
//                     type="number"
//                     className="w-full border rounded px-3 py-2"
//                     value={cgpa}
//                     onChange={(e) => setCgpa(e.target.value)}
//                     step="0.01"
//                   />
//                 </div>
//               </div>

//               {/* Right Side - Resume Upload */}
//               <div className="flex-1">
//                 <label className="block mb-1 font-medium text-sm text-gray-700">Upload Resume (PDF only)</label>
//                 <div
//                   {...getRootProps()}
//                   className={`border-2 rounded-md transition-colors duration-200 px-4 py-10 text-center cursor-pointer ${
//                     isDragActive
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50'
//                   }`}
//                 >
//                   <input {...getInputProps()} />
//                   {isDragActive ? (
//                     <p className="text-blue-600 font-medium">Drop your resume here...</p>
//                   ) : resume ? (
//                     <div className="text-green-700 font-medium">
//                       <CheckCircle className="inline-block w-5 h-5 mr-2" />
//                       {resume.name}
//                     </div>
//                   ) : (
//                     <>
//                       <p className="text-gray-600">
//                         Drag & drop your resume here, or <span className="text-blue-600 underline">click to browse</span>
//                       </p>
//                       <p className="text-sm text-gray-400 mt-2">Only PDF files are accepted</p>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="mt-6">
//               <Button
//                 disabled={!fullName || !email || !mobile || !cgpa || !resume}
//                 onClick={handleApply}
//                 className="w-full h-12 text-lg"
//               >
//                 Submit Application
//               </Button>
//             </div>
//           </Card>
//         ) : (
//           <Button
//             onClick={() => setShowForm(true)}
//             className="w-full h-12 text-lg"
//           >
//             Apply Now
//           </Button>
//         )}

//       </div>
//     </div>
//   );
// };

// export default InternshipDetails;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Clock, DollarSign, Calendar, GraduationCap, ArrowLeft, 
  Bookmark, CheckCircle, ClipboardCheck, Users, Mail, UserCheck, UserX 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { jwtDecode } from 'jwt-decode';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [resume, setResume] = useState(null);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [applications, setApplications] = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/register/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("authToken");
      navigate("/register/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch internship details
        const internshipRes = await axios.get(`http://localhost:3000/internships/internship/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInternship(internshipRes.data);

        // If admin, fetch applications
        if (role === 'admin') {
          const appsRes = await axios.get(`http://localhost:3000/applications/internship/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setApplications(appsRes.data);
        }

        // If student, check if applied
        if (role === 'student') {
          const appliedRes = await axios.get(`http://localhost:3000/applications/applied/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsApplied(appliedRes.data.applied);
          setStatus(appliedRes.data.status);
        }
      } catch (err) {
        setError("Failed to load data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const handleSelectApplicant = (applicationId) => {
      setSelectedApplicants((prev) => 
        prev.includes(applicationId) 
          ? prev.filter((id) => id !== applicationId) 
          : [...prev, applicationId]
      );
    }

    fetchData();
  }, [id, navigate, role]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) setResume(acceptedFiles[0]);
    },
  });

  const handleSave = () => {
    toast.success("Internship saved to your list");
  };

  const handleApply = async () => {
    const token = localStorage.getItem('authToken');
    if (!fullName || !email || !mobile || !cgpa || !resume) {
      toast.error("Please fill all fields and upload resume");
      return;
    } 

    const formData = new FormData();
    formData.append("fullName", fullName.trim());
    formData.append("email", email.trim());
    formData.append("mobile", mobile.trim());
    formData.append("cgpa", cgpa);
    formData.append("resume", resume);
    formData.append("internshipId", id);

    try {
      const res = await axios.post(`http://localhost:3000/applications/apply/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        setIsApplied(true);
        setShowForm(false);
        toast.success("Application submitted successfully!");
      }
    } catch (err) {
      console.error("Application failed:", err);
      toast.error(err.response?.data?.message || "Application failed");
    }
  };

  const handleSelectApplicant = (applicationId) => {
    setSelectedApplicants(prev => 
      prev.includes(applicationId) 
        ? prev.filter(id => id !== applicationId) 
        : [...prev, applicationId]
    );
  };

  const handleBulkStatusChange = async () => {
    if (!bulkStatus || selectedApplicants.length === 0) {
      toast.warning("Please select status and at least one applicant");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(`http://localhost:3000/applications/update-status`, {
        applicationIds: selectedApplicants,
        status: bulkStatus
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state
      setApplications(prev => prev.map(app => 
        selectedApplicants.includes(app._id) 
          ? { ...app, status: bulkStatus } 
          : app
      ));
      setSelectedApplicants([]);
      setBulkStatus("");
      toast.success(`Status updated to ${bulkStatus} for selected applicants`);
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update status");
    }
  };

  const handleSendEmails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`http://localhost:3000/applications/send-emails`, {
        internshipId: id,
        status: bulkStatus
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Emails sent to all ${bulkStatus.toLowerCase()} applicants`);
    } catch (err) {
      console.error("Email sending failed:", err);
      toast.error("Failed to send emails");
    }
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Top navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center text-primary hover:bg-primary/10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {role === 'student' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            className="flex items-center"
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Save
          </Button>
        )}
      </div>

      {/* Company and position header */}
      <div className="flex items-center gap-4 mb-6">
        {internship.image && (
          <img
            src={internship.image ? `http://localhost:3000${internship.image}` : "/default-company.png"}
            alt="Company Logo"
            className="w-20 h-20 object-contain rounded-lg"
          />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{internship.company}</h1>
          <p className="text-lg text-muted-foreground">{internship.title}</p>
        </div>
        {role === 'student' && isApplied && (
          <Badge className="bg-lime-500 hover:bg-lime-500/80">
            {status}
          </Badge>
        )}
      </div>

      <Separator className="my-6" />

      {/* Key details section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-primary mr-3" />
          <div>
            <p className="text-muted-foreground text-sm">Location</p>
            <p className="font-medium">{internship.location}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-primary mr-3" />
          <div>
            <p className="text-muted-foreground text-sm">Duration</p>
            <p className="font-medium">{internship.duration}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-primary mr-3" />
          <div>
            <p className="text-muted-foreground text-sm">Stipend</p>
            <p className="font-medium">
              {internship.stipend ? `₹${internship.stipend}` : "Unpaid"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-primary mr-3" />
          <div>
            <p className="text-muted-foreground text-sm">Deadline</p>
            <p className="font-medium">
              {new Date(internship.deadline).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Description section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">About the Internship</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {internship.description}
        </p>
      </div>

      <Separator className="my-6" />

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Eligibility</h2>
        <p className="text-accent-foreground leading-relaxed whitespace-pre-line">
          {internship.eligibility}
        </p>
      </div>

      <Separator className="my-6" />

      {/* Student View - Application Form */}
      {role === 'student' && (
        <div className="mb-8">
          {isApplied ? (
            <Button className="w-full h-12 text-lg bg-lime-500 hover:bg-lime-500/90">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Applied ({status})
            </Button>
          ) : showForm ? (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Application Form</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cgpa">CGPA</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Resume Upload (PDF only)</Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 rounded-md px-4 py-10 text-center cursor-pointer mt-1 ${
                      isDragActive ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {resume ? (
                      <div className="text-green-700 font-medium">
                        <CheckCircle className="inline-block w-5 h-5 mr-2" />
                        {resume.name}
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        Drag & drop your resume here, or click to browse
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApply}
                  disabled={!fullName || !email || !mobile || !cgpa || !resume}
                  className="flex-1"
                >
                  Submit Application
                </Button>
              </div>
            </Card>
          ) : (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full h-12 text-lg"
            >
              Apply Now
            </Button>
          )}
        </div>
      )}

      {/* Admin View - Applications Management */}
      {role === 'admin' && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Applications ({applications.length})
            </h2>
            <div className="flex gap-2">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="">Select Status</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkStatusChange}
                disabled={!bulkStatus || selectedApplicants.length === 0}
              >
                Update Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendEmails}
                disabled={!bulkStatus}
              >
                <Mail className="h-4 w-4 mr-2" />
                Notify All
              </Button>
            </div>
          </div>

          {applications.length > 0 ? (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Select</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>CGPA</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app._id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedApplicants.includes(app._id)}
                          onChange={() => handleSelectApplicant(app._id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{app.name}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{app.cgpa}</TableCell>
                      <TableCell>
                        <a 
                          href={`http://localhost:3000/${app.resume}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            app.status === 'Selected' ? 'bg-green-100 text-green-800' :
                            app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {app.status || 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setApplications(prev => prev.map(a => 
                              a._id === app._id ? { ...a, status: 'Selected' } : a
                            ));
                          }}
                        >
                          <UserCheck className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setApplications(prev => prev.map(a => 
                              a._id === app._id ? { ...a, status: 'Rejected' } : a
                            ));
                          }}
                        >
                          <UserX className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No applications received yet</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default InternshipDetails;