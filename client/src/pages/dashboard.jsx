// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import {jwtDecode} from 'jwt-decode';
// import InternshipCard from '@/components/ui/internship_card';
// import { useNavigate } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


// const Dashboard = () => {
//   const [internships, setInternships] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [role, setRole] = useState("");

//   const navigate = useNavigate();

//   const fetchInternships = useCallback(async () => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
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
//     else
//     {
//       console.error("No token found");
//       navigate("/register/login");
//       return;
//     }
    
//     try {
//       const response = await axios.get("http://localhost:3000/internships", {
//         headers: {
//           Authorization: `Bearer ${token}`,  // Add token in headers
//         },
//       });
//       setInternships(response.data);
//       console.log("Internship Data:", response.data);
//       setLoading(false);
//     }
//     catch (error)
//     {
      
//       console.error('Failed to fetch internships:', error);
//     }
//   }, [navigate]); // ✅ `navigate` is now a dependency

//   useEffect(() => {
//     fetchInternships();
//   }, [fetchInternships]); // ✅ Prevents infinite re-renders

//   if (loading) {
//     return (
//       <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
//           <p className="text-gray-600 text-lg font-medium">Loading Internships...</p>
//         </div>
//       </div>
//     );
    
//   }

//   return (
//     <div className="min-h-screen w-full bg-white">
//       <div className="mt-24 px-4 z-[1] min-h-screen w-full flex flex-col">
//         {internships.length === 0 ? (
//           <div className="flex flex-col items-center justify-center flex-grow text-gray-600">
//             <p className="text-2xl font-semibold">No internships available.</p>
//             <p className="text-md text-gray-400 mt-2">
//               Check back later for new opportunities!
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-grow w-full">
//             {internships.map((internship, index) => (
//               <InternshipCard key={index} {...internship} />
//             ))}
//           </div>
//         )}
//       </div>
      
//       {role === "admin" && (
//       <TooltipProvider>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//             onClick={() => navigate("/admin/add-internship")}
//             className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 bg-gray-700 hover:bg-gray-800 shadow-lg transition-all duration-300 flex items-center justify-center"
//             >
//               <Plus className="w-10 h-10 text-white" />
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>
//             <p>Add Internship</p>
//           </TooltipContent>
//         </Tooltip>
//       </TooltipProvider>)}
//     </div>
//   );
  
// };

// export default Dashboard;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import InternshipCard from '@/components/ui/internship_card';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      const response = await axios.get("http://localhost:3000/internships", {
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
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center">
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
        {internships.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow text-gray-600">
            <p className="text-2xl font-semibold">No internships available.</p>
            <p className="text-md text-gray-400 mt-2">
              Check back later for new opportunities!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-grow w-full">
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
                className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 bg-gray-700 hover:bg-gray-800 shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                <Plus className="w-10 h-10 text-white" />
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
