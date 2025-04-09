import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, AlertTriangle, XCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

const InternshipCard = ({ _id, company, stipend, deadline, image, location, duration, onDelete }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Error notification state
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === "admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleEdit = () => {
    navigate(`/admin/update-internship/${_id}`);
  };

  const confirmDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setErrorDialogOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:3000/admin/delete-internship/${_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        params: {
          id: _id,
        },
      });
      
      // If parent component provided onDelete callback, call it first
      if (onDelete) {
        onDelete(_id);
      }
      
      // Directly navigate to internships page
      navigate("/internships", { replace: true });
      
    } catch (err) {
      console.error("Error deleting internship:", err);
      showError(err.response?.data?.message || "Failed to delete internship");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-[450px] shadow-lg hover:shadow-xl transition-shadow duration-300 z-10 h-[350px] flex flex-col justify-between relative">
        <CardHeader className="pb-2 flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <img
              src={image ? `http://localhost:3000${image}` : '/google_logo.png'}
              alt={`${company} Logo`}
              className="w-20 h-20 object-contain rounded-lg"
            />
            <div>
              <CardTitle className="text-xl font-bold">{company}</CardTitle>
            </div>
          </div>

          {/* Admin Only Options */}
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={confirmDelete} className="text-red-500">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>

        <CardContent className="pt-4 space-y-2">
          <div className="flex space-x-2">
          {/* <p className="text-sm text-muted-foreground">Software Engineering Intern 2025</p> */}
            <Badge variant="secondary">{location || 'Remote'}</Badge>
            <Badge variant="outline">{duration || 'N/A'}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Stipend: {stipend ? `₹${stipend}` : 'Unpaid'}</p>
            <p>Deadline: {deadline ? new Date(deadline).toLocaleDateString() : 'N/A'}</p>
            <p>Duration: {duration || 'Not specified'}</p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button className="w-full" onClick={() => navigate(`/internships/internship/${_id}`)}>
            View Details
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the internship opportunity at <span className="font-bold">{company}</span>? 
              This action cannot be undone and will permanently remove this internship from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Internship"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog - Only shown if deletion fails */}
      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
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
    </>
  );
};

export default InternshipCard;
