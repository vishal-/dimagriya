import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Assessment } from "../../types/assessment";
import supabase from "../../utils/supabase";

const AdminAnswersList = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <div className="text-xl font-bold text-gray-100">
              Loading assessments...
            </div>
          </div>
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
              to="/admin"
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
              Back to Admin
            </Link>
            <h1 className="text-4xl font-bold text-gray-100 mb-2">
              Assessment Answers
            </h1>
            <p className="text-gray-400">
              Select an assessment to view its answers
            </p>
          </div>

          <div className="space-y-4">
            {assessments.map((assessment) => (
              <Link
                key={assessment.id}
                to={`/admin/answers/${assessment.id}`}
                className="block"
              >
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-700/50 hover:border-gray-600/50 group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-100 group-hover:text-gray-300 transition-colors mb-2">
                        {assessment.title}
                      </h3>
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
                    <div className="ml-4">
                      <svg
                        className="w-6 h-6 text-gray-400 group-hover:text-gray-300 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {assessments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <div className="text-2xl font-bold text-gray-100 mb-2">
                No assessments found
              </div>
              <div className="text-gray-400">
                Create some assessments first to view their answers
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnswersList;
