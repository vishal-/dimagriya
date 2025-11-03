import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import AdminAssessments from "../pages/AdminAssessments";
import AdminAssessmentEditor from "../pages/AdminAssessmentEditor";
import AdminAnswersList from "../pages/AdminAnswersList";
import AdminAnswersView from "../pages/AdminAnswersView";
import AdminResults from "../pages/AdminResults";
import Student from "../pages/Student";
import AttemptAssessment from "../pages/AttemptAssessment";
import TakeAssessment from "../pages/TakeAssessment";
import Results from "../pages/Results";
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
        <Route path="/attempt/:id" element={<AttemptAssessment />} />
        <Route path="/evaluate/:attemptId" element={<TakeAssessment />} />
        <Route path="/result/:attemptId" element={<Results />} />
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
        <Route
          path="/admin/assessment/:id"
          element={
            <AuthGuard>
              <AdminAssessmentEditor />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/answers"
          element={
            <AuthGuard>
              <AdminAnswersList />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/results"
          element={
            <AuthGuard>
              <AdminResults />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/answers/:id"
          element={
            <AuthGuard>
              <AdminAnswersView />
            </AuthGuard>
          }
        />
      </Routes>
    </div>
  );
};

export default Container;
