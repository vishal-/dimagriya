import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaEdit, FaCog, FaPencilAlt } from "react-icons/fa";
import type { Assessment, Problem } from "../../types/assessment";
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
  const [editingQuestion, setEditingQuestion] = useState<{
    sectionIdx: number;
    questionIdx: number;
  } | null>(null);
  const [editQuestionData, setEditQuestionData] = useState<Partial<Problem>>(
    {}
  );
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
      // Handle section name editing
      if (field.startsWith("section_") && field.endsWith("_name")) {
        const sectionIdx = parseInt(field.split("_")[1]);
        const updatedSections = [...assessment.sections];
        updatedSections[sectionIdx].name = value as string;

        const { error } = await supabase
          .from("assessments")
          .update({ sections: updatedSections })
          .eq("id", assessment.id);

        if (error) throw error;

        setAssessment({ ...assessment, sections: updatedSections });
        setEditingField(null);
        return;
      }

      // Handle regular field editing
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

  const handleEditQuestion = (sectionIdx: number, questionIdx: number) => {
    const question = assessment?.sections[sectionIdx]?.questions[questionIdx];
    if (question) {
      setEditingQuestion({ sectionIdx, questionIdx });
      setEditQuestionData({ ...question });
    }
  };

  const handleSaveQuestion = async () => {
    if (!assessment || !editingQuestion) return;

    try {
      const { sectionIdx, questionIdx } = editingQuestion;
      const updatedSections = [...assessment.sections];
      updatedSections[sectionIdx].questions[questionIdx] = {
        ...updatedSections[sectionIdx].questions[questionIdx],
        ...editQuestionData
      };

      const { error } = await supabase
        .from("assessments")
        .update({ sections: updatedSections })
        .eq("id", assessment.id);

      if (error) throw error;

      setAssessment({ ...assessment, sections: updatedSections });
      setEditingQuestion(null);
      setEditQuestionData({});
    } catch (error) {
      console.error("Error saving question:", error);
      setAlertMessage("Failed to save question. Please try again.");
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
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                  title="Edit title"
                >
                  <FaEdit className="w-4 h-4 text-white flex-shrink-0" />
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
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                  title="Edit grade"
                >
                  <FaEdit className="w-4 h-4 text-white flex-shrink-0" />
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
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                  title="Edit subject"
                >
                  <FaEdit className="w-4 h-4 text-white flex-shrink-0" />
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
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                  title="Edit total questions"
                >
                  <FaEdit className="w-4 h-4 text-white flex-shrink-0" />
                </button>
              </div>
            </div>

            {/* Sections with Questions */}
            <div className="pt-4">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">
                Sections & Questions ({assessment.sections.length} sections,{" "}
                {assessment.total_questions} questions)
              </h2>
              <div className="space-y-6">
                {assessment.sections.map((section, sectionIdx) => (
                  <div
                    key={sectionIdx}
                    className="bg-gray-700/50 rounded-xl p-6 border border-gray-600"
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-100">
                          {section.name}
                        </h3>
                        <button
                          onClick={() => {
                            setEditingField(`section_${sectionIdx}_name`);
                            setEditValue(section.name);
                          }}
                          className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
                          title="Edit section name"
                        >
                          <FaEdit className="w-3 h-3 text-white flex-shrink-0" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/assessment/${id}/section/${sectionIdx}`
                            )
                          }
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
                          title="Edit section"
                        >
                          <FaCog className="w-4 h-4 text-white flex-shrink-0" />
                        </button>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-4">
                      {section.questions.map((question, questionIdx) => (
                        <div
                          key={question.id}
                          className="bg-gray-800/50 rounded-lg p-4 border border-gray-600"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                  Q{questionIdx + 1}
                                </span>
                                <span className="text-sm text-gray-400">
                                  ID: {question.id}
                                </span>
                              </div>
                              <p className="text-gray-100 font-medium mb-3">
                                {question.question}
                              </p>

                              {/* Options */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                {question.options.map((option, optionIdx) => (
                                  <div
                                    key={optionIdx}
                                    className={`p-2 rounded text-sm ${
                                      option === question.answer
                                        ? "bg-green-600/20 border border-green-500 text-green-300"
                                        : "bg-gray-700/50 text-gray-300"
                                    }`}
                                  >
                                    <span className="font-semibold mr-2">
                                      {String.fromCharCode(65 + optionIdx)}.
                                    </span>
                                    {option}
                                    {option === question.answer && (
                                      <span className="ml-2 text-green-400 font-semibold">
                                        ✓ Correct
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                handleEditQuestion(sectionIdx, questionIdx)
                              }
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors ml-4"
                              title="Edit question"
                            >
                              <FaPencilAlt className="w-4 h-4 text-white flex-shrink-0" />
                            </button>
                          </div>
                        </div>
                      ))}
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

      <EditModal
        isOpen={
          (editingField?.startsWith("section_") &&
            editingField?.endsWith("_name")) ||
          false
        }
        title="Section Name"
        fieldName="Section Name"
        value={editValue}
        onSave={(value) => handleSaveField(editingField!, value)}
        onClose={() => setEditingField(null)}
      />

      {/* Question Edit Modal */}
      <Modal
        isOpen={editingQuestion !== null}
        onClose={() => {
          setEditingQuestion(null);
          setEditQuestionData({});
        }}
        title="Edit Question"
        size="xl"
      >
        <div className="space-y-6">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Question
            </label>
            <textarea
              value={editQuestionData.question || ""}
              onChange={(e) =>
                setEditQuestionData((prev) => ({
                  ...prev,
                  question: e.target.value
                }))
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:border-blue-500 min-h-[100px] resize-vertical"
              placeholder="Enter the question text..."
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Options
            </label>
            <div className="space-y-3">
              {(editQuestionData.options || []).map((option, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="bg-gray-600 text-gray-300 px-3 py-2 rounded font-semibold min-w-[40px] text-center">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(editQuestionData.options || [])];
                      newOptions[idx] = e.target.value;
                      setEditQuestionData((prev) => ({
                        ...prev,
                        options: newOptions
                      }));
                    }}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  />
                  <input
                    type="radio"
                    name="correct-answer"
                    checked={option === editQuestionData.answer}
                    onChange={() =>
                      setEditQuestionData((prev) => ({
                        ...prev,
                        answer: option
                      }))
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Select the radio button next to the correct answer
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setEditingQuestion(null);
                setEditQuestionData({});
              }}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveQuestion}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Save Question
            </button>
          </div>
        </div>
      </Modal>

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
