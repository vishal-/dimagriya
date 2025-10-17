import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Assessment } from "../../types/assessment";
import { Modal, Alert } from "../ui";
import supabase from "../../utils/supabase";

// Edit modal for different field types
interface EditModalProps {
  isOpen: boolean;
  title: string;
  value: string | number;
  fieldName: string;
  type?: "text" | "number";
  onSave: (value: string | number) => void;
  onClose: () => void;
}

const EditModal = ({
  isOpen,
  title,
  value,
  fieldName,
  type = "text",
  onSave,
  onClose
}: EditModalProps) => {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value, isOpen]);

  const handleSave = () => {
    const finalValue = type === "number" ? parseInt(inputValue) : inputValue;
    onSave(finalValue);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${title}`} size="md">
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          {fieldName}
        </label>
        <input
          type={type}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
          autoFocus
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

const AdminAssessmentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string | number>("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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

  const handleSaveField = async (field: string, value: string | number) => {
    if (!assessment) return;

    try {
      const updateData: Record<string, string | number> = {};
      updateData[field] = value;

      const { error } = await supabase
        .from("assessments")
        .update(updateData)
        .eq("id", assessment.id);

      if (error) throw error;

      setAssessment({ ...assessment, [field]: value });
      setEditingField(null);
    } catch (error) {
      console.error("Error saving field:", error);
      setAlertMessage("Failed to save changes. Please try again.");
      setAlertOpen(true);
    }
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
          <Link
            to="/admin/assessments"
            className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/admin/assessments"
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
              Back to Assessments
            </Link>
            <h1 className="text-4xl font-bold text-gray-100">
              Edit Assessment
            </h1>
          </div>

          {/* Assessment Details */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50 space-y-6">
            {/* Title */}
            <div className="border-b border-gray-700 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Title
                  </label>
                  <p className="text-2xl font-bold text-gray-100 mt-2">
                    {assessment.title}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingField("title");
                    setEditValue(assessment.title);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Grade */}
            <div className="border-b border-gray-700 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Grade
                  </label>
                  <p className="text-xl text-gray-100 mt-2">
                    Grade {assessment.grade}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingField("grade");
                    setEditValue(assessment.grade);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Subject */}
            <div className="border-b border-gray-700 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Subject
                  </label>
                  <p className="text-xl text-gray-100 mt-2">
                    {assessment.subject}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingField("subject");
                    setEditValue(assessment.subject);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Total Questions */}
            <div className="border-b border-gray-700 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <label className="text-sm font-semibold text-gray-400">
                    Total Questions
                  </label>
                  <p className="text-xl text-gray-100 mt-2">
                    {assessment.total_questions}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingField("total_questions");
                    setEditValue(assessment.total_questions);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Sections Summary */}
            <div className="pt-4">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                Sections ({assessment.sections.length})
              </h2>
              <div className="space-y-3">
                {assessment.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-100">
                          {section.name}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {section.questions.length} questions
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/admin/assessment/${id}/section/${idx}`)
                        }
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                      >
                        Edit Section
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t border-gray-700 text-sm text-gray-400 space-y-2">
              <p>
                Created:{" "}
                {assessment.created_at
                  ? new Date(assessment.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                Last Updated:{" "}
                {assessment.updated_at
                  ? new Date(assessment.updated_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modals */}
      <EditModal
        isOpen={editingField === "title"}
        title="Title"
        fieldName="Assessment Title"
        value={editValue}
        onSave={(value) => handleSaveField("title", value)}
        onClose={() => setEditingField(null)}
      />

      <EditModal
        isOpen={editingField === "subject"}
        title="Subject"
        fieldName="Subject"
        value={editValue}
        onSave={(value) => handleSaveField("subject", value)}
        onClose={() => setEditingField(null)}
      />

      <EditModal
        isOpen={editingField === "grade"}
        title="Grade"
        fieldName="Grade Level"
        value={editValue}
        type="number"
        onSave={(value) => handleSaveField("grade", value)}
        onClose={() => setEditingField(null)}
      />

      <EditModal
        isOpen={editingField === "total_questions"}
        title="Total Questions"
        fieldName="Total Questions"
        value={editValue}
        type="number"
        onSave={(value) => handleSaveField("total_questions", value)}
        onClose={() => setEditingField(null)}
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

export default AdminAssessmentEditor;
