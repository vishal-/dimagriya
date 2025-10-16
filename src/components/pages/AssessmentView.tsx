import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Assessment } from "../../types/assessment";
import supabase from "../../utils/supabase";
import Prompt from "../common/Prompt";

const AssessmentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showFinishPrompt, setShowFinishPrompt] = useState(false);

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

  // Timer effect
  useEffect(() => {
    if (!loading && assessment) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, assessment]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle finishing the test
  const handleFinishTest = () => {
    setShowFinishPrompt(true);
  };

  const handleConfirmFinish = () => {
    setShowFinishPrompt(false);
    navigate("/");
  };

  const handleCancelFinish = () => {
    setShowFinishPrompt(false);
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
          <div className="text-2xl font-bold text-gray-100">
            Assessment not found
          </div>
          <div className="text-gray-400 mt-2">Let's find another one!</div>
        </div>
      </div>
    );
  }

  const optionLabels = ["a", "b", "c", "d", "e"];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-gray-700/50">
              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent mb-4">
                  {assessment.title}
                </h1>
                <div className="inline-flex items-center bg-gray-700/50 px-6 py-2 rounded-full border border-gray-600">
                  <span className="text-gray-200 font-semibold text-lg">
                    Grade {assessment.grade} • {assessment.subject}
                  </span>
                </div>
              </div>
            </div>

            {assessment.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-12">
                {/* Section Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 mb-8 shadow-xl border-2 border-white/20">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent text-center drop-shadow-lg">
                    {section.name}
                  </h2>
                </div>

                <div className="space-y-8">
                  {section.questions.map((question) => (
                    <div
                      key={question.id}
                      className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-md"
                    >
                      {/* Question Header with Large Number */}
                      <div className="flex items-start space-x-4 mb-6">
                        <div className="flex-shrink-0">
                          <div className="ms-3">
                            <span className="text-2xl text-yellow-300 font-bold text-white">
                              {question.id}&#160;&#45;
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-100 leading-relaxed">
                            {question.question}
                          </h3>
                        </div>
                      </div>

                      {/* Options Grid */}
                      <div className="flex flex-wrap gap-4">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="bg-gray-700/60 rounded-xl p-4 border border-gray-600 hover:border-blue-400 transition-colors shadow-sm"
                            style={{ minWidth: "200px", flexBasis: "auto" }}
                          >
                            <div className="flex items-start space-x-3">
                              {/* Simple Option Label */}
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center border border-gray-500">
                                  <span className="text-sm font-bold text-gray-200 uppercase">
                                    {optionLabels[optionIndex]}
                                  </span>
                                </div>
                              </div>
                              {/* Option Text */}
                              <div className="flex-1">
                                <span className="text-gray-200 font-medium leading-relaxed">
                                  {option}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Finish Test Button */}
          <div className="mt-12 mb-8">
            <div className="flex justify-center">
              <button
                onClick={handleFinishTest}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-12 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xl">Finish Test</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer with Timer */}
      <div className="sticky bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-600/50 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-center items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full shadow-md">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-lg font-bold font-mono">
                  {formatTime(timeElapsed)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Prompt */}
      <Prompt
        isOpen={showFinishPrompt}
        title="Finish Test?"
        message="Are you sure you want to finish the test? This action cannot be undone and you'll be taken back to the home page."
        confirmText="Yes, Finish Test"
        cancelText="Cancel"
        onConfirm={handleConfirmFinish}
        onCancel={handleCancelFinish}
      />
    </>
  );
};

export default AssessmentView;
