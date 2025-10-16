import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import type { Assessment } from "../../types/assessment";
import supabase from "../../utils/supabase";

const AdminAnswersView = () => {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAssessment = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
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

  // Helper function to convert answer index to letter
  const getAnswerLetter = (answerIndex: string): string => {
    const letters = ["a", "b", "c", "d", "e"];
    const index = parseInt(answerIndex) - 1;
    return letters[index] || answerIndex;
  };

  // Helper function to get answer details
  const getAnswerDetails = (question: {
    answer: string;
    options: string[];
  }) => {
    // First, try to find the answer in the options array
    const answerIndex = question.options.findIndex(
      (option) => option === question.answer
    );

    if (answerIndex !== -1) {
      // Answer is the actual text, found in options
      const answerLetter = getAnswerLetter((answerIndex + 1).toString());
      return { letter: answerLetter, text: question.answer };
    } else {
      // Answer might be an index string
      const parsedIndex = parseInt(question.answer) - 1;
      if (parsedIndex >= 0 && parsedIndex < question.options.length) {
        const answerLetter = getAnswerLetter(question.answer);
        const answerText = question.options[parsedIndex];
        return { letter: answerLetter, text: answerText };
      } else {
        // Fallback
        return { letter: "Unknown", text: question.answer };
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <div className="text-xl font-bold text-gray-100">
              Loading answers...
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
          <div className="text-gray-400 mt-2">
            The assessment you're looking for doesn't exist
          </div>
          <Link
            to="/admin/answers"
            className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Answers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              to="/admin/answers"
              className="inline-flex items-center text-gray-400 hover:text-gray-200 transition-colors mb-4"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Answers
            </Link>
            <h1 className="text-4xl font-bold text-gray-100 mb-2">
              {assessment.title} - Answers
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="inline-flex items-center bg-gray-700/50 px-3 py-1 rounded-full">
                Grade {assessment.grade}
              </span>
              <span className="inline-flex items-center bg-gray-700/50 px-3 py-1 rounded-full">
                {assessment.subject}
              </span>
              <span className="inline-flex items-center bg-gray-700/50 px-3 py-1 rounded-full">
                {assessment.total_questions} questions
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {assessment.sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700/50"
              >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                  {section.name}
                </h2>

                <div className="space-y-3">
                  {section.questions.map((question) => (
                    <div
                      key={question.id}
                      className="flex items-center justify-between bg-gray-700/30 rounded-lg p-4 border border-gray-600/30"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="text-lg font-bold text-yellow-300">
                            {question.id}.
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-200 text-2xl">
                            Answer:&#160;&#160;&#160;
                            {getAnswerDetails(question).letter}
                            &#160;&#160;-&#160;&#160;
                            {getAnswerDetails(question).text}
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
      </div>
    </div>
  );
};

export default AdminAnswersView;
