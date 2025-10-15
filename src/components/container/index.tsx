import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import AdminAssessments from "../pages/AdminAssessments";
import Navigation from "../common/Navigation";

const Container = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Navigation />

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/assessments" element={<AdminAssessments />} />
      </Routes>
    </div>
  );
};

export default Container;
