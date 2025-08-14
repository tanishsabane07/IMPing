import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const fetchStudents = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(API_ENDPOINTS.adminStudents, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, []);

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(API_ENDPOINTS.deleteStudent(selectedStudentId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedStudentId(null); // Clear selected student
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Students</h1>
      {students.length === 0 ? (
        <p className="text-gray-500">No students found.</p>
      ) : (
        <div className="rounded-lg border shadow overflow-x-auto">
          <Table className="min-w-full border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="border px-4 py-2 text-left">#</TableHead>
                <TableHead className="border px-4 py-2 text-left">RegID</TableHead>
                <TableHead className="border px-4 py-2 text-left">Name</TableHead>
                <TableHead className="border px-4 py-2 text-left">Email</TableHead>
                <TableHead className="border px-4 py-2 text-left">Role</TableHead>
                <TableHead className="border px-4 py-2 text-left">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={student._id || index} className="hover:bg-gray-50">
                  <TableCell className="border px-4 py-2">{index + 1}</TableCell>
                  <TableCell className="border px-4 py-2">{student.regId}</TableCell>
                  <TableCell className="border px-4 py-2">{student.name}</TableCell>
                  <TableCell className="border px-4 py-2">{student.email}</TableCell>
                  <TableCell className="border px-4 py-2">{student.role}</TableCell>
                  <TableCell className="border px-4 py-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setSelectedStudentId(student._id)}
                        >
                          Delete
                        </Button >
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this student from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
