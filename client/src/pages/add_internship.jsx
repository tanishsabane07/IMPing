
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from '../config/api';
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarClock,
  Image as ImageIcon,
  Sparkles,
  MapPin,
  Landmark,
  ShieldCheck,
  Timer,
  Wallet,
}
from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import './add_internship.css';

export default function AddInternship() {
  const form = useForm({
    defaultValues: {
      company: "",
      description: "",
      location: "Remote",
      eligibility: "",
      duration: "",
      stipend: 0,
      deadline: new Date().toISOString().split("T")[0],
      image: null,
    },
  });

  const [isRemote, setIsRemote] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  if (!token) {
    navigate("/register/login");
    return;
  }

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("company", data.company);
    formData.append("description", data.description);
    formData.append("location", isRemote ? "Remote" : data.location);
    formData.append("eligibility", data.eligibility);
    formData.append("duration", data.duration);
    formData.append("stipend", data.stipend);
    formData.append("deadline", data.deadline);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await axios.post(
        getApiUrl("/admin/add-internship"),
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);
      setSuccessMessage("Internship added successfully!");
      setIsSuccess(true);
      setOpenDialog(true);

      setTimeout(() => {
        navigate("/internships");
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to add internship");
      setIsSuccess(false);
      setOpenDialog(true);
    }
  };

  return (
    <div className="add-shell">
      <div className="add-noise" aria-hidden="true" />
      <div className="add-container">
      <div className="add-topbar reveal delay-1">
        <Button variant="ghost" className="add-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="add-head reveal delay-1">
        <div>
          <p className="add-kicker">
            <Sparkles size={15} />
            Admin Studio
          </p>
          <h1>Create a new internship listing</h1>
          <p>Publish role details with deadline, stipend, eligibility, and brand assets in one flow.</p>
        </div>
        <div className="add-head-points">
          <article><ShieldCheck size={16} /> Role-ready publishing</article>
          <article><BriefcaseBusiness size={16} /> Student-first listing format</article>
        </div>
      </div>

      <div className="add-card reveal delay-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="add-form">
          {/* Company Name */}
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="add-label"><Landmark size={14} /> Company Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter company name" className="add-input" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="add-label"><BriefcaseBusiness size={14} /> Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter internship description" className="add-input add-textarea" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Remote Checkbox */}
          <FormItem className="add-location-toggle">
            <FormLabel className="add-label"><MapPin size={14} /> Location</FormLabel>
            <Checkbox
              checked={isRemote}
              onCheckedChange={(checked) => setIsRemote(checked)}
            />
            <FormLabel className="add-inline-label">Remote</FormLabel>
          </FormItem>

          {/* Location Input (Only If On-Site) */}
          {!isRemote && (
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="add-label">On-Site Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter location" className="add-input" />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <div className="add-grid-2">
            {/* Eligibility */}
            <FormField
              control={form.control}
              name="eligibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="add-label"><ShieldCheck size={14} /> Skills Required</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="add-input add-textarea" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="add-grid-2-inner">
              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="add-label"><Timer size={14} /> Duration</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g., 3 months" className="add-input" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Stipend */}
              <FormField
                control={form.control}
                name="stipend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="add-label"><Wallet size={14} /> Stipend</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Enter stipend amount" className="add-input" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Deadline */}
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="add-label"><CalendarClock size={14} /> Application Deadline</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" placeholder="dd/mm/yyyy" className="add-input" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Image Upload */}
          <FormItem>
            <FormLabel className="add-label"><ImageIcon size={14} /> Upload Company Image</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                className="add-input"
              />
            </FormControl>
            {selectedImage && <p className="add-file-name">Selected: {selectedImage.name}</p>}
          </FormItem>

          <Button type="submit" className="add-submit-btn">Publish Internship</Button>

          {/* Alert Dialog */}
          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isSuccess ? "Success!" : "Error"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isSuccess ? successMessage : error}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpenDialog(false)}>
                  Close
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
      </div>
      </div>
    </div>
  );
}