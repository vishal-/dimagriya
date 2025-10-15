import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import AdminAssessments from "../pages/AdminAssessments";
import Student from "../pages/Student";
import AssessmentView from "../pages/AssessmentView";
// import Navigation from "../common/Navigation";
import AuthGuard from "../auth/AuthGuard";

const Container = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* <Navigation /> */}

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<Student />} />
        <Route path="/assessment/:id" element={<AssessmentView />} />
        <Route
          path="/admin"
          element={
            <AuthGuard>
              <Admin />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/assessments"
          element={
            <AuthGuard>
              <AdminAssessments />
            </AuthGuard>
          }
        />
      </Routes>
    </div>
  );
};

export default Container;
