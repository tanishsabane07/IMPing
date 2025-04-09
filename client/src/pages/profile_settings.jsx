// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Profile = () => {
//     const [user, setUser] = useState(null);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             const token = localStorage.getItem('authToken');
//             if (!token) {
//                 setError('Unauthorized: Please log in');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const response = await axios.get("http://localhost:3000/profile", {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setUser(response.data);
//                 setError(null);
//             } catch (err) {
//                 setError('Failed to load user profile. Please try again later.');
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUserData();
//     }, []);

//     return (
//         <div className='mt-12'>
//             <h1 className="text-2xl font-bold">Profile Settings</h1>

//             {loading && <p>Loading profile...</p>}

//             {error && <p className="text-red-500">{error}</p>}

//             {user && !loading && (
//                 <div className="mt-4">
//                     <p><strong>Registration ID:</strong> {user.regId}</p>
//                     <p><strong>Name:</strong> {user.name}</p>
//                     <p><strong>Department:</strong> {user.dept}</p>
//                     <p><strong>Email:</strong> {user.email}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Profile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Unauthorized: Please log in");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load user profile. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <Avatar className="h-24 w-24 mx-auto">
            <AvatarImage src={user?.avatar || "/placeholder.png"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl mt-3">{user?.name || "User"}</CardTitle>
          <p className="text-sm text-gray-500">{user?.role}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && user && (
            <div className="text-gray-700 space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Registration ID:</span>
                <span>{user.regId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Department:</span>
                <span>{user.dept}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="text-center mt-4">
              <Button onClick={() => {Navigate("/profile/settings")}}>Edit Profile</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;