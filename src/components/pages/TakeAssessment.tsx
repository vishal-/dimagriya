import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaClock, FaChevronLeft, FaChevronRight, FaFlag } from "react-icons/fa";
import type { Assessment } from "../../types/assessment";
import type { Attempt, Response } from "../../types/Attempt";
import supabase from "../../utils/supabase";
import { Prompt } from "../ui";

const TakeAssessment = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showFinishPrompt, setShowFinishPrompt] = useState(false);

  // Flatten all questions for easier navigation
  const allQuestions =
    assessment?.sections.flatMap((section) =>
      section.questions.map((question, index) => ({
        ...question,
        sectionName: section.name,
        globalIndex: index
      }))
    ) || [];

  const currentQuestion = allQuestions[currentQuestionIndex];
  const currentSection = assessment?.sections.find((section) =>
    section.questions.includes(currentQuestion)
  );

  const fetchData = useCallback(async () => {
    if (!attemptId) return;

    try {
      // Fetch attempt first
      const { data: attemptData, error: attemptError } = await supabase
        .from("attempts")
        .select("*")
        .eq("id", attemptId)
        .single();

      if (attemptError) throw attemptError;

      // Fetch assessment using assessment_id from attempt
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("assessments")
        .select("*")
        .eq("id", attemptData.assessment_id)
        .single();

      if (assessmentError) throw assessmentError;

      setAssessment(assessmentData);
      setAttempt(attemptData);

      // Calculate time elapsed from attempt start
      const startTime = new Date(attemptData.started_at);
      const now = new Date();
      const elapsedSeconds = Math.floor(
        (now.getTime() - startTime.getTime()) / 1000
      );
      setTimeElapsed(elapsedSeconds);

      // Load existing responses
      if (attemptData.responses) {
        setResponses(attemptData.responses);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Timer effect - sync with DB every 30 seconds
  useEffect(() => {
    if (!attempt || loading) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => {
        const newTime = prev + 1;

        // Sync with DB every 30 seconds
        if (newTime % 30 === 0) {
          (async () => {
            try {
              await supabase
                .from("attempts")
                .update({
                  responses: responses,
                  duration_minutes: Math.ceil(newTime / 60)
                })
                .eq("id", attemptId);
              console.log("Synced with DB");
            } catch (err) {
              console.error("Sync error:", err);
            }
          })();
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [attempt, loading, responses, attemptId]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSelect = async (answer: string) => {
    const isCorrect = answer === currentQuestion.answer;
    const response: Response = {
      question: currentQuestion.question,
      answer: answer,
      isCorrect: isCorrect
    };

    const newResponses = {
      ...responses,
      [currentQuestionIndex.toString()]: response
    };
    setResponses(newResponses);

    // Auto-save to DB
    try {
      await supabase
        .from("attempts")
        .update({ responses: newResponses })
        .eq("id", attemptId);
    } catch (err) {
      console.error("Auto-save error:", err);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleFinishTest = () => {
    setShowFinishPrompt(true);
  };

  const handleConfirmFinish = async () => {
    try {
      // Calculate final score
      let correctAnswers = 0;
      allQuestions.forEach((_, index) => {
        const response = responses[index.toString()];
        if (response && response.isCorrect) {
          correctAnswers++;
        }
      });

      const scorePercentage = (correctAnswers / allQuestions.length) * 100;

      // Update attempt in DB
      await supabase
        .from("attempts")
        .update({
          status: "completed",
          ended_at: new Date().toISOString(),
          duration_minutes: Math.ceil(timeElapsed / 60),
          responses: responses,
          correct_answers: correctAnswers,
          score_percentage: scorePercentage
        })
        .eq("id", attemptId);

      // Navigate to results page
      navigate(`/result/${attemptId}`);
    } catch (error) {
      console.error("Failed to finish assessment:", error);
    }
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

  if (!assessment || !attempt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center">
          <div className="text-6xl mb-4">😔</div>
          <div className="text-2xl font-bold text-gray-100 mb-2">
            Assessment or attempt not found
          </div>
          <div className="text-gray-400 mb-6">
            The assessment or attempt you're looking for doesn't exist.
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const optionLabels = ["a", "b", "c", "d", "e"];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        {/* Header */}
        <div className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-600/50 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-gray-100">
                  {assessment.title}
                </h1>
                <div className="text-sm text-gray-400">
                  Question {currentQuestionIndex + 1} of {allQuestions.length}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-sm text-gray-300">
                  {currentSection?.name}
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-md">
                  <div className="flex items-center space-x-2">
                    <FaClock className="w-4 h-4" />
                    <span className="text-sm font-bold font-mono">
                      {formatTime(timeElapsed)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {currentQuestion && (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-amber-300/50 shadow-md">
                {/* Question */}
                <div className="mb-8">
                  <div className="flex items-start space-x-4 mb-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xl font-bold min-w-[60px] text-center">
                      {currentQuestionIndex + 1}
                    </span>
                    <h2 className="text-2xl text-gray-100 leading-relaxed font-bold flex-1">
                      {currentQuestion.question}
                    </h2>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4 mb-8">
                  {currentQuestion.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="p-4 rounded-xl border-2 bg-gray-700/60 border-gray-600"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-500 text-gray-300 bg-gray-600">
                          <span className="text-lg font-bold uppercase">
                            {optionLabels[optionIndex]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="text-xl text-white leading-relaxed">
                            {option}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Answer Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Select your answer:
                  </h3>
                  <div className="flex flex-wrap gap-6">
                    {currentQuestion.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestionIndex}`}
                          value={option}
                          checked={
                            responses[currentQuestionIndex.toString()]
                              ?.answer === option
                          }
                          onChange={() => handleAnswerSelect(option)}
                          className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-lg font-bold text-gray-200 uppercase">
                          {optionLabels[optionIndex]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                      currentQuestionIndex === 0
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
                    }`}
                  >
                    <FaChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex space-x-4">
                    {currentQuestionIndex === allQuestions.length - 1 ? (
                      <button
                        onClick={handleFinishTest}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex items-center space-x-3">
                          <FaFlag className="w-5 h-5" />
                          <span>Finish Test</span>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-105"
                      >
                        <span>Next</span>
                        <FaChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Prompt */}
      <Prompt
        isOpen={showFinishPrompt}
        title="Finish Test?"
        message={`Are you sure you want to finish the test? You have answered ${
          Object.keys(responses).length
        } out of ${
          allQuestions.length
        } questions. This action cannot be undone.`}
        confirmText="Yes, Finish Test"
        cancelText="Continue Test"
        onConfirm={handleConfirmFinish}
        onCancel={handleCancelFinish}
      />
    </>
  );
};

export default TakeAssessment;
