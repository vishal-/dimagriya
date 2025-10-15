import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import type { Assessment } from "../../types/assessment";
import supabase from "../../utils/supabase";

const AssessmentView = () => {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-gray-300">Loading assessment...</div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-gray-300">Assessment not found</div>
      </div>
    );
  }

  const optionLabels = ["a", "b", "c", "d", "e"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-700/50">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              {assessment.title}
            </h1>
            <p className="text-gray-400 mb-8">
              Grade {assessment.grade} • {assessment.subject}
            </p>

            {assessment.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-100 mb-6 border-b border-gray-600 pb-2">
                  {section.name}
                </h2>

                {section.questions.map((question) => (
                  <div key={question.id} className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-100 mb-4">
                      {question.id}. {question.question}
                    </h3>

                    <div className="ml-6 space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="text-gray-300">
                          <span className="font-semibold text-gray-400 mr-2">
                            {optionLabels[optionIndex]})
                          </span>
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentView;
