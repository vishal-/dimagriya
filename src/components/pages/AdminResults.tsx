import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaClock,
  FaUser,
  FaBook
} from "react-icons/fa";
import type { Attempt } from "../../types/Attempt";
import type { Assessment } from "../../types/assessment";
import AdminHeader from "../common/AdminHeader";
import supabase from "../../utils/supabase";

interface AttemptWithAssessment extends Attempt {
  assessment?: Assessment;
}

const AdminResults = () => {
  const [attempts, setAttempts] = useState<AttemptWithAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  const fetchAttempts = useCallback(async () => {
    try {
      setLoading(true);

      // Calculate offset for pagination
      const offset = (currentPage - 1) * itemsPerPage;

      // Fetch attempts with pagination
      const {
        data: attemptsData,
        error: attemptsError,
        count
      } = await supabase
        .from("attempts")
        .select(
          `
          *,
          assessments (
            id,
            title,
            grade,
            subject
          )
        `,
          { count: "exact" }
        )
        .order("started_at", { ascending: false })
        .range(offset, offset + itemsPerPage - 1);

      if (attemptsError) throw attemptsError;

      // Transform the data to include assessment info
      const transformedAttempts =
        attemptsData?.map((attempt) => ({
          ...attempt,
          assessment: Array.isArray(attempt.assessments)
            ? attempt.assessments[0]
            : attempt.assessments
        })) || [];

      setAttempts(transformedAttempts);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error("Error fetching attempts:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-900/20";
      case "in_progress":
        return "text-blue-400 bg-blue-900/20";
      case "abandoned":
        return "text-red-400 bg-red-900/20";
      default:
        return "text-gray-400 bg-gray-900/20";
    }
  };

  const getScoreColor = (percentage?: number) => {
    if (!percentage) return "text-gray-400";
    if (percentage >= 90) return "text-green-400";
    if (percentage >= 70) return "text-yellow-400";
    if (percentage >= 50) return "text-orange-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <div className="text-xl font-bold text-gray-100">
              Loading attempts...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-100 mb-2">
                Attempts & Results
              </h1>
              <p className="text-gray-400">
                View and analyze student assessment attempts and performance
              </p>
            </div>
          </div>

          {/* Attempts List */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700/50 overflow-hidden">
            {attempts.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  No attempts found
                </h3>
                <p className="text-gray-400">
                  Students haven't taken any assessments yet.
                </p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="bg-gray-700/50 px-6 py-4 border-b border-gray-600">
                  <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-300">
                    <div className="col-span-4">Assessment</div>
                    <div className="col-span-2">Student</div>
                    <div className="col-span-2">Started</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Score</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-700/50">
                  {attempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="px-6 py-4 hover:bg-gray-700/20 transition-colors"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Assessment Info */}
                        <div className="col-span-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <FaBook className="w-5 h-5 text-white" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-semibold text-gray-100 truncate">
                                {attempt.assessment?.title ||
                                  "Unknown Assessment"}
                              </h4>
                              <p className="text-xs text-gray-400">
                                Grade {attempt.assessment?.grade} •{" "}
                                {attempt.assessment?.subject}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Student */}
                        <div className="col-span-2">
                          <div className="flex items-center space-x-2">
                            <FaUser className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">
                              {attempt.student || "Anonymous"}
                            </span>
                          </div>
                        </div>

                        {/* Started Time */}
                        <div className="col-span-2">
                          <div className="flex items-center space-x-2">
                            <FaClock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">
                              {formatDateTime(attempt.started_at)}
                            </span>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              attempt.status
                            )}`}
                          >
                            {attempt.status.replace("_", " ").toUpperCase()}
                          </span>
                        </div>

                        {/* Score */}
                        <div className="col-span-1">
                          {attempt.score_percentage !== null &&
                          attempt.score_percentage !== undefined ? (
                            <span
                              className={`text-sm font-semibold ${getScoreColor(
                                attempt.score_percentage
                              )}`}
                            >
                              {attempt.score_percentage.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="col-span-1">
                          <Link
                            to={`/result/${attempt.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            title="View Results"
                          >
                            <FaEye className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-gray-700/50 px-6 py-4 border-t border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(
                          currentPage * itemsPerPage,
                          attempts.length + (currentPage - 1) * itemsPerPage
                        )}{" "}
                        of {totalPages * itemsPerPage} attempts
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1}
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <FaChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </button>

                        <div className="flex items-center space-x-1">
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              const pageNum =
                                Math.max(
                                  1,
                                  Math.min(totalPages - 4, currentPage - 2)
                                ) + i;
                              if (pageNum > totalPages) return null;

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    currentPage === pageNum
                                      ? "bg-blue-600 text-white"
                                      : "text-gray-300 bg-gray-700 hover:bg-gray-600"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}
                        </div>

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                          <FaChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResults;
