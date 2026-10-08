import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import VerifyPage from "./pages/VerifyPage";
import "./styles.css";
export default function App() { return <BrowserRouter><Routes><Route path="/login" element={<Login />} /><Route path="/student-dashboard" element={<StudentDashboard />} /><Route path="/staff-dashboard" element={<StaffDashboard />} /><Route path="/verify/:token" element={<VerifyPage />} /><Route path="/verify" element={<VerifyPage />} /><Route path="*" element={<Navigate to="/login" replace />} /></Routes></BrowserRouter>; }
