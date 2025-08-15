// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  withCredentials: true,
};

// Helper function to create full URLs
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// API endpoints for easy reference
export const API_ENDPOINTS = {
  // Auth
  register: '/register',
  
  // Admin
  adminStudents: '/admin/students',
  deleteStudent: (id) => `/admin/students/${id}`,
  addInternship: '/admin/add-internship',
  updateInternship: (id) => `/admin/update-internship/${id}`,
  
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
  
  // Profile
  profile: '/profile',
};

export default API_BASE_URL;
