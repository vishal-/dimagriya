import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaCog, FaTrash } from "react-icons/fa";
import type { Assessment } from "../../types/assessment";
import AssessmentForm from "../forms/AssessmentForm";
import { Alert, Prompt } from "../ui";
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
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
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
      setAlertMessage("Failed to delete assessment. Please try again.");
      setAlertOpen(true);
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
                              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors shadow-sm"
                              title="Edit assessment"
                            >
                              <FaEdit className="w-5 h-5 text-white" />
                            </Link>

                            {/* Quick Edit Button */}
                            <button
                              onClick={() => {
                                setSelectedAssessment(assessment);
                                setShowForm(true);
                              }}
                              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors shadow-sm"
                              title="Quick edit"
                            >
                              <FaCog className="w-5 h-5 text-white flex-shrink-0" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteClick(assessment)}
                              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
                              title="Delete assessment"
                            >
                              <FaTrash className="w-5 h-5 text-white flex-shrink-0" />
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

      {/* Delete Confirmation Prompt */}
      <Prompt
        isOpen={deleteConfirmOpen}
        title="Delete Assessment"
        message={`Are you sure you want to delete "${assessmentToDelete?.title}"? This action cannot be undone and all associated data will be permanently deleted.`}
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleting) setDeleteConfirmOpen(false);
        }}
        variant="danger"
      />

      {/* Error Alert */}
      <Alert
        isOpen={alertOpen}
        title="Error"
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
        variant="error"
      />
    </div>
  );
};

export default AdminAssessments;
