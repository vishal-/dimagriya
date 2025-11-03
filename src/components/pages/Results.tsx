import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaTrophy,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHome,
  FaRedo
} from "react-icons/fa";
import type { Assessment, Attempt } from "../../types/assessment";
import supabase from "../../utils/supabase";

const Results = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);

  // Flatten all questions for easier analysis
  const allQuestions =
    assessment?.sections.flatMap((section) =>
      section.questions.map((question, index) => ({
        ...question,
        sectionName: section.name,
        globalIndex: index
      }))
    ) || [];

  const fetchData = useCallback(async () => {
    if (!attemptId) return;

    try {
      // Fetch attempt
      const { data: attemptData, error: attemptError } = await supabase
        .from("attempts")
        .select("*")
        .eq("id", attemptId)
        .single();

      if (attemptError) throw attemptError;

      // Fetch assessment
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("assessments")
        .select("*")
        .eq("id", attemptData.assessment_id)
        .single();

      if (assessmentError) throw assessmentError;

      setAssessment(assessmentData);
      setAttempt(attemptData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Format duration in minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Get performance color based on percentage
  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-400";
    if (percentage >= 70) return "text-yellow-400";
    if (percentage >= 50) return "text-orange-400";
    return "text-red-400";
  };

  // Get performance message
  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent! Outstanding performance!";
    if (percentage >= 80) return "Great job! Well done!";
    if (percentage >= 70) return "Good work! Keep it up!";
    if (percentage >= 60) return "Fair attempt. Room for improvement.";
    if (percentage >= 50) return "Needs improvement. Keep practicing!";
    return "Keep studying and try again!";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <div className="text-xl font-bold text-gray-100">
              Loading results...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment || !attempt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center">
          <div className="text-6xl mb-4">😔</div>
          <div className="text-2xl font-bold text-gray-100 mb-2">
            Results not found
          </div>
          <div className="text-gray-400 mb-6">
            The results you're looking for don't exist or have been removed.
          </div>
          <Link
            to="/student"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Student Portal
          </Link>
        </div>
      </div>
    );
  }

  const optionLabels = ["a", "b", "c", "d", "e"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 mb-8 shadow-xl border-2 border-white/20">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <FaTrophy className="text-yellow-400 text-4xl mr-3" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Assessment Results
                </h1>
              </div>
              <h2 className="text-2xl font-semibold text-gray-100 mb-2">
                {assessment.title}
              </h2>
              <div className="inline-flex items-center bg-gray-700/50 px-6 py-2 rounded-full border border-gray-600">
                <span className="text-gray-200 font-semibold text-lg">
                  Grade {assessment.grade} • {assessment.subject}
                </span>
              </div>
            </div>
          </div>

          {/* Score Overview */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-gray-100 mb-4">
                Score Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Questions:</span>
                  <span className="text-gray-100 font-semibold">
                    {attempt.total_questions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Correct Answers:</span>
                  <span className="text-green-400 font-semibold">
                    {attempt.correct_answers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Score:</span>
                  <span
                    className={`text-2xl font-bold ${getPerformanceColor(
                      attempt.score_percentage || 0
                    )}`}
                  >
                    {attempt.score_percentage?.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-gray-100 mb-4">
                Attempt Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Started:</span>
                  <span className="text-gray-100 font-semibold">
                    {new Date(attempt.started_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Completed:</span>
                  <span className="text-gray-100 font-semibold">
                    {attempt.ended_at
                      ? new Date(attempt.ended_at).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Duration:</span>
                  <span className="text-blue-400 font-semibold flex items-center">
                    <FaClock className="mr-1" />
                    {attempt.duration_minutes
                      ? formatDuration(attempt.duration_minutes)
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
            <div className="text-center">
              <div
                className={`text-3xl font-bold mb-2 ${getPerformanceColor(
                  attempt.score_percentage || 0
                )}`}
              >
                {attempt.score_percentage &&
                  attempt.score_percentage >= 90 &&
                  "🏆"}
                {attempt.score_percentage &&
                  attempt.score_percentage >= 70 &&
                  attempt.score_percentage < 90 &&
                  "🎉"}
                {attempt.score_percentage &&
                  attempt.score_percentage >= 50 &&
                  attempt.score_percentage < 70 &&
                  "👍"}
                {attempt.score_percentage &&
                  attempt.score_percentage < 50 &&
                  "📚"}
              </div>
              <p className="text-xl text-gray-200 font-semibold">
                {getPerformanceMessage(attempt.score_percentage || 0)}
              </p>
            </div>
          </div>

          {/* Question Review */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
            <h3 className="text-xl font-bold text-gray-100 mb-6">
              Question Review
            </h3>
            <div className="space-y-6">
              {allQuestions.map((question, index) => {
                const userAnswer = attempt.responses?.[index.toString()];
                const isCorrect = userAnswer === question.answer;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isCorrect
                        ? "bg-green-900/20 border-green-600"
                        : "bg-red-900/20 border-red-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                          Q{index + 1}
                        </span>
                        <span className="text-sm text-gray-400">
                          {question.sectionName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isCorrect ? (
                          <FaCheckCircle className="text-green-400" />
                        ) : (
                          <FaTimesCircle className="text-red-400" />
                        )}
                        <span
                          className={`text-sm font-semibold ${
                            isCorrect ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-100 font-medium mb-3">
                      {question.question}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === option;
                        const isCorrectAnswer = question.answer === option;

                        let bgColor = "bg-gray-700/50";
                        let borderColor = "border-gray-600";
                        let textColor = "text-gray-300";

                        if (isCorrectAnswer) {
                          bgColor = "bg-green-900/30";
                          borderColor = "border-green-500";
                          textColor = "text-green-300";
                        } else if (isUserAnswer && !isCorrect) {
                          bgColor = "bg-red-900/30";
                          borderColor = "border-red-500";
                          textColor = "text-red-300";
                        }

                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded border ${bgColor} ${borderColor}`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className={`font-semibold ${textColor}`}>
                                {optionLabels[optionIndex]}.
                              </span>
                              <span className={textColor}>{option}</span>
                              {isCorrectAnswer && (
                                <span className="text-green-400 font-semibold ml-auto">
                                  ✓ Correct
                                </span>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <span className="text-red-400 font-semibold ml-auto">
                                  ✗ Your Answer
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/student"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <FaHome className="text-lg" />
              <span>Back to Student Portal</span>
            </Link>

            <button
              onClick={() => navigate(`/attempt/${assessment.id}`)}
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
            >
              <FaRedo className="text-lg" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
