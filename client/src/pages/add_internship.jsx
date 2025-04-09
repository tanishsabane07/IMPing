// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";

// export default function AddInternship() {
//   const form = useForm({
//     defaultValues: {
//       company: "",
//       description: "",
//       location: "Remote",
//       eligibility: "",
//       duration: "",
//       stipend: 0,
//       deadline: new Date().toISOString().split("T")[0],
//       image: "",
//     },
//   });

//   const [isRemote, setIsRemote] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [openDialog, setOpenDialog] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const navigate = useNavigate();
//   const token = localStorage.getItem("authToken");

//   if (!token) {
//     navigate("/register/login");
//     return;
//   }

//   const onSubmit = async (data) => {
//     console.log("Form Data:", data);
//     setError(""); // Reset error
//     setSuccessMessage(""); // Reset success message

//     try {
//       const response = await axios.post("http://localhost:3000/admin/add-internship",
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("Response:", response.data);
//       setSuccessMessage("Internship added successfully!");
//       setIsSuccess(true);
//       setOpenDialog(true);

//       // Redirect to another page after 2 seconds
//       setTimeout(() => {
//         navigate("/internships"); // Change to desired page
//       }, 2000);
//     } catch (err) {
//       console.error("Error:", err);
//       setError(err.response?.data?.message || "Failed to add internship");
//       setIsSuccess(false);
//       setOpenDialog(true);
//     }
//   };

//   return (
//     <div className="p-4 m-auto max-w-3xl mt-12">
//       <div>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             {/* Company Name */}
//             <FormField
//               control={form.control}
//               name="company"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Company Name</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder="Enter company name" />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             {/* Description */}
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Description</FormLabel>
//                   <FormControl>
//                     <Textarea {...field} placeholder="Enter internship description" />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             {/* Remote Checkbox */}
//             <FormField
//               control={form.control}
//               name="isRemote"
//               render={({ field }) => (
//                 <FormItem className="flex items-center space-x-2">
//                   <FormLabel>Location</FormLabel>
//                   <FormControl>
//                     <Checkbox
//                       checked={field.value}
//                       onCheckedChange={(checked) => {
//                         field.onChange(checked);
//                         setIsRemote(checked);
//                       }}
//                     />
//                   </FormControl>
//                   <FormLabel>Remote</FormLabel>
//                 </FormItem>
//               )}
//             />

//             {/* Location Input (Only If On-Site) */}
//             {!isRemote && (
//               <FormField
//                 control={form.control}
//                 name="location"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>On-Site Location</FormLabel>
//                     <FormControl>
//                       <Input {...field} placeholder="Enter location" />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//             )}

//             {/* Eligibility */}
//             <FormField
//               control={form.control}
//               name="eligibility"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Skills Required</FormLabel>
//                   <FormControl>
//                     <Textarea {...field} placeholder="E.g., B.Tech, MBA" />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             {/* Duration */}
//             <FormField
//               control={form.control}
//               name="duration"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Duration</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder="E.g., 3 months" />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             {/* Stipend */}
//             <FormField
//               control={form.control}
//               name="stipend"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Stipend</FormLabel>
//                   <FormControl>
//                     <Input {...field} type="number" placeholder="Enter stipend amount" />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             {/* Deadline */}
//             <FormField
//               control={form.control}
//               name="deadline"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Application Deadline</FormLabel>
//                   <FormControl>
//                     <Input {...field} type="date" placeholder="dd/mm/yyyy"/>
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             {/* Image Upload */}
//             <FormField
//               control={form.control}
//               name="image"
//               render={({ field: { onChange, ...rest } }) => (
//                 <FormItem>
//                   <FormLabel>Upload Image</FormLabel>
//                   <FormControl>
//                     <Input type="file" onChange={(e) => onChange(e.target.files[0])} {...rest} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             <Button type="submit">Submit</Button>

//             {/* Alert Dialog for Success or Failure */}
//             <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>
//                     {isSuccess ? "Success!" : "Error"}
//                   </AlertDialogTitle>
//                   <AlertDialogDescription>
//                     {isSuccess ? successMessage : error}
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel onClick={() => setOpenDialog(false)}>
//                     Close
//                   </AlertDialogCancel>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

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
        "http://localhost:3000/admin/add-internship",
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
    <div className="p-4 m-auto max-w-3xl mt-12">
        <h1 className="text-2xl font-bold mb-4">Add Internship</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Company Name */}
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter company name" />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter internship description" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Remote Checkbox */}
          <FormItem className="flex items-center space-x-2">
            <FormLabel>Location</FormLabel>
            <Checkbox
              checked={isRemote}
              onCheckedChange={(checked) => setIsRemote(checked)}
            />
            <FormLabel>Remote</FormLabel>
          </FormItem>

          {/* Location Input (Only If On-Site) */}
          {!isRemote && (
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>On-Site Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter location" />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* Eligibility */}
          <FormField
            control={form.control}
            name="eligibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills Required</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="E.g., B.Tech, MBA" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Duration */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="E.g., 3 months" />
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
                <FormLabel>Stipend</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="Enter stipend amount" />
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
                <FormLabel>Application Deadline</FormLabel>
                <FormControl>
                  <Input {...field} type="date" placeholder="dd/mm/yyyy" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormItem>
            <FormLabel>Upload Image</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
            </FormControl>
          </FormItem>

          <Button type="submit">Submit</Button>

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
  );
}