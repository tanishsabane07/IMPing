import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/config/api';
import { ArrowLeft, Sparkles, UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import './student_list.css';

const StudentsPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const fetchStudents = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(getApiUrl("/admin/students"), {
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
      await axios.delete(getApiUrl(`/admin/students/${selectedStudentId}`), {
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
      <div className="students-shell students-loading">
        <div className="students-loader" />
      </div>
    );
  }

  return (
    <div className="students-shell">
      <div className="students-noise" aria-hidden="true" />
      <div className="students-container">
      <div className="students-topbar reveal delay-1">
        <Button variant="ghost" className="students-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="students-head reveal delay-1">
        <div>
          <p className="students-kicker">
            <Sparkles size={15} />
            Admin Panel
          </p>
          <h1>All Students</h1>
          <p>Manage student accounts and keep your internship management workspace tidy.</p>
        </div>
        <article className="students-stat">
          <UsersRound size={16} />
          <span>{students.length}</span>
          <small>Registered students</small>
        </article>
      </div>

      {students.length === 0 ? (
        <div className="students-empty reveal delay-2">
          <p>No students found.</p>
        </div>
      ) : (
        <div className="students-table-wrap reveal delay-2">
          <Table className="min-w-full border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="students-th">#</TableHead>
                <TableHead className="students-th">RegID</TableHead>
                <TableHead className="students-th">Name</TableHead>
                <TableHead className="students-th">Email</TableHead>
                <TableHead className="students-th">Role</TableHead>
                <TableHead className="students-th">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={student._id || index} className="students-row">
                  <TableCell className="students-td">{index + 1}</TableCell>
                  <TableCell className="students-td">{student.regId}</TableCell>
                  <TableCell className="students-td">{student.name}</TableCell>
                  <TableCell className="students-td">{student.email}</TableCell>
                  <TableCell className="students-td students-role-cell">
                    <span className="students-role-pill">{student.role}</span>
                  </TableCell>
                  <TableCell className="students-td">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="students-delete-btn"
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
    </div>
  );
};

export default StudentsPage;
