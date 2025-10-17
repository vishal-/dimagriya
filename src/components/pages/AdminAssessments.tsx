import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Assessment } from "../../types/assessment";
import AssessmentForm from "../forms/AssessmentForm";
import { Modal } from "../ui";
import supabase from "../../utils/supabase";

const AdminAssessments = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] =
    useState<Assessment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const itemsPerPage = 10;

  const fetchAssessments = async (page: number) => {
    try {
      setLoading(true);
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error, count } = await supabase
        .from("assessments")
        .select("*", { count: "exact" })
        .order("updated_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      setAssessments(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (assessment: Assessment) => {
    setAssessmentToDelete(assessment);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!assessmentToDelete) return;

    try {
      setDeleting(true);
      const { error } = await supabase
        .from("assessments")
        .delete()
        .eq("id", assessmentToDelete.id);

      if (error) throw error;

      setDeleteConfirmOpen(false);
      setAssessmentToDelete(null);
      fetchAssessments(currentPage);
    } catch (error) {
      console.error("Error deleting assessment:", error);
      alert("Failed to delete assessment");
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-100">Assessments</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setSelectedAssessment(null);
              }}
              className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              {showForm ? "Cancel" : "Create Assessment"}
            </button>
          </div>

          {showForm ? (
            <AssessmentForm
              assessment={selectedAssessment || undefined}
              onSave={() => {
                setShowForm(false);
                setSelectedAssessment(null);
                fetchAssessments(currentPage);
              }}
            />
          ) : (
            <div className="space-y-6">
              {loading ? (
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700/50">
                  <div className="text-center py-12">
                    <p className="text-gray-400">Loading assessments...</p>
                  </div>
                </div>
              ) : assessments.length === 0 ? (
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700/50">
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">
                      No assessments found
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Create your first assessment to get started
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {assessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-700/50 hover:shadow-xl hover:border-gray-600/50 transition-all"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/admin/assessment/${assessment.id}`}
                              className="block group"
                            >
                              <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors truncate">
                                {assessment.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-400 mt-1">
                              Last updated:{" "}
                              {assessment.updated_at
                                ? new Date(
                                    assessment.updated_at
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>

                          <div className="flex gap-2 ml-4">
                            {/* Edit Button */}
                            <Link
                              to={`/admin/assessment/${assessment.id}`}
                              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors group"
                              title="Edit assessment"
                            >
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </Link>

                            {/* Quick Edit Button */}
                            <button
                              onClick={() => {
                                setSelectedAssessment(assessment);
                                setShowForm(true);
                              }}
                              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                              title="Quick edit"
                            >
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
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteClick(assessment)}
                              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                              title="Delete assessment"
                            >
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-8">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
                      >
                        Previous
                      </button>

                      <span className="text-gray-400">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          if (!deleting) setDeleteConfirmOpen(false);
        }}
        title="Delete Assessment"
        size="md"
      >
        <div className="mb-6">
          <p className="text-gray-300 mb-2">
            Are you sure you want to delete{" "}
            <strong>{assessmentToDelete?.title}</strong>?
          </p>
          <p className="text-sm text-gray-400">
            This action cannot be undone. All associated data will be
            permanently deleted.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteConfirmOpen(false)}
            disabled={deleting}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={deleting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAssessments;
