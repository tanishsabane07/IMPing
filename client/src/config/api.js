// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  withCredentials: true,
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  register: '/register',
  
  // Admin
  adminStudents: '/admin/students',
  deleteStudent: (id) => `/admin/students/${id}`,
  
  // Internships
  internships: '/internships',
  internshipById: (id) => `/internships/internship/${id}`,
  searchInternships: (query) => `/internships/search?query=${query}`,
  
  // Applications
  applyInternship: (id) => `/applications/apply/${id}`,
  applicationsByInternship: (id) => `/applications/internship/${id}`,
  appliedInternships: (id) => `/applications/applied/${id}`,
  updateApplicationStatus: '/applications/update-status',
  sendEmails: '/applications/send-emails',
  myApplications: '/student/my-applications',
  
  // File URLs - Now using direct Cloudinary URLs
  getFileUrl: (cloudinaryUrl) => cloudinaryUrl, // Cloudinary URLs are already complete
  getResumeUrl: (cloudinaryUrl) => cloudinaryUrl, // Cloudinary URLs are already complete  
  getImageUrl: (cloudinaryUrl) => cloudinaryUrl, // Cloudinary URLs are already complete
};

export default API_BASE_URL;
