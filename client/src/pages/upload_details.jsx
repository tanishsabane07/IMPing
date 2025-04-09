import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { Toaster } from '@/components/ui/sonner';

const ApplyInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cgpa: '',
    name: '',
    email: '',
    mobile: '',
    resume: null,
    tenthMarks: '',
    twelfthMarks: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    try {
      await axios.post(`http://localhost:3000/student/apply/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Toaster({
        title: "Application Submitted",
        description: "You have successfully applied for this internship!",
        status: "success",
      });
      navigate(`/student/internship/${id}`);
    } catch (err) {
      Toaster({
        title: "Application Error",
        description: "Failed to submit application. Please try again.",
        status: "error",
      });
      console.error("Application Error:", err);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Apply for Internship</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="cgpa">CGPA</Label>
          <Input id="cgpa" name="cgpa" value={formData.cgpa} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="resume">Resume</Label>
          <Input id="resume" name="resume" type="file" onChange={handleFileChange} required />
        </div>
        <div>
          <Label htmlFor="tenthMarks">10th Marks (Optional)</Label>
          <Input id="tenthMarks" name="tenthMarks" value={formData.tenthMarks} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="twelfthMarks">12th Marks (Optional)</Label>
          <Input id="twelfthMarks" name="twelfthMarks" value={formData.twelfthMarks} onChange={handleChange} />
        </div>
        <Button type="submit" className="w-full">Submit Application</Button>
      </form>
    </Card>
  );
};

export default ApplyInternship;