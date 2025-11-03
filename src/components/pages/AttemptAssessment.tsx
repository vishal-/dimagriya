import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBook, FaQuestionCircle, FaTimes, FaPlay } from "react-icons/fa";
import type { Assessment } from "../../types/assessment";
import supabase from "../../utils/supabase";
import AssessmentInstructions from "../common/AssessmentInstructions";

const AttemptAssessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAssessment = useCallback(async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setAssessment(data);
    } catch (error) {
      console.error("Error fetching assessment:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAssessment();
  }, [fetchAssessment]);

  const handleStartAssessment = async () => {
    try {
      // Create new attempt record
      const { data: attempt, error } = await supabase
        .from("attempts")
        .insert({
          assessment_id: id,
          total_questions: totalQuestions,
          status: "in_progress"
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate with attempt ID
      navigate(`/attempt/${id}/${attempt.id}`);
    } catch (error) {
      console.error("Failed to start assessment:", error);
      // Show error to user
    }
  };

  const handleCancel = () => {
    // Navigate back to student portal
    navigate("/student");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <div className="text-xl font-bold text-gray-100">
              Loading assessment...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center">
          <div className="text-6xl mb-4">😔</div>
          <div className="text-2xl font-bold text-gray-100 mb-2">
            Assessment not found
          </div>
          <div className="text-gray-400 mb-6">
            The assessment you're looking for doesn't exist or has been removed.
          </div>
          <button
            onClick={handleCancel}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Student Portal
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = assessment.sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 mb-8 shadow-xl border-2 border-white/20">
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent mb-4">
                {assessment.title}
              </h1>
              <div className="inline-flex items-center bg-gray-700/50 px-6 py-2 rounded-full border border-gray-600">
                <FaBook className="mr-2 text-blue-300" />
                <span className="text-gray-200 font-semibold text-lg">
                  Grade {assessment.grade} • {assessment.subject}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <AssessmentInstructions />

          {/* Assessment Overview */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-gray-700/50">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
              <FaQuestionCircle className="mr-3 text-yellow-400" />
              Assessment Overview
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center mb-2">
                  <FaQuestionCircle className="mr-2 text-blue-400" />
                  <span className="text-gray-300 font-semibold">
                    Total Questions
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-100">
                  {totalQuestions}
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center mb-2">
                  <FaBook className="mr-2 text-green-400" />
                  <span className="text-gray-300 font-semibold">Sections</span>
                </div>
                <div className="text-2xl font-bold text-gray-100">
                  {assessment.sections.length}
                </div>
              </div>
            </div>

            {/* Sections Breakdown */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-200 mb-3">
                Sections:
              </h3>
              {assessment.sections.map((section, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/50"
                >
                  <span className="text-gray-200 font-medium">
                    {section.name}
                  </span>
                  <span className="text-gray-400">
                    {section.questions.length} question
                    {section.questions.length !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleCancel}
              className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <FaTimes className="text-lg" />
              <span className="text-lg">Cancel</span>
            </button>

            <button
              onClick={handleStartAssessment}
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
            >
              <FaPlay className="text-lg" />
              <span className="text-lg">Start Assessment</span>
            </button>
          </div>

          {/* Warning Notice */}
          <div className="mt-8 bg-yellow-900/30 border border-yellow-600/50 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-yellow-100 text-lg font-bold">!</span>
                </div>
              </div>
              <div>
                <h3 className="text-yellow-200 font-bold text-lg mb-2">
                  Important Notice
                </h3>
                <p className="text-yellow-100">
                  By clicking "Start Assessment", you acknowledge that you
                  understand the instructions and are ready to begin. Make sure
                  you are in a quiet environment and will not be interrupted
                  during the assessment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptAssessment;
