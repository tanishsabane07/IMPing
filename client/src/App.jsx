import './App.css'
import LoginPage from './pages/login'
import Dashboard from './pages/dashboard'
import AddInternship from './pages/add_internship'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupPage from './pages/signup'
import { Navigate } from 'react-router-dom'
import InternshipDetails from './pages/internship_details'
import Layout from './layouts/layout'
import EditInternship from './pages/edit_internship'
import Profile from './pages/profile_settings'
import ApplyInternship from './pages/upload_details'
import DuedInternships from './pages/dued_internships'
import StudentsPage from './pages/student_list'
import StudentApplications from './pages/student_applications'

function App() {

  return (
    <Router>
      <Layout>
        <Routes>

        <Route path="/register">
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        <Route path="/internships" element={<Dashboard />} />

        <Route path="/admin/add-internship" element={<AddInternship />} />

        <Route path="/" element={<Navigate to="/register/login" />} />

        <Route path="/internships/internship/:id" element={<InternshipDetails />} />

        <Route path="/admin/update-internship/:id" element={<EditInternship />} />

        <Route path="/profile/" element={<Profile />} />

        <Route path="/student/apply/:id" element={<ApplyInternship />} />

        <Route path="/admin/dued-internships" element={<DuedInternships />} />

        <Route path="/admin/students" element={<StudentsPage />} />

        <Route path="/student/my-applications" element={<StudentApplications />} />

        </Routes>
      </Layout>
    </Router>
  )
}

export default App