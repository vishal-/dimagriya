import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import type { Assessment } from "../../types/assessment";
import supabase from "../../utils/supabase";

interface GradeSubject {
  grade: number;
  subject: string;
}

const Student = () => {
  const [gradeSubjects, setGradeSubjects] = useState<GradeSubject[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAssessments, setLoadingAssessments] = useState(false);

  const fetchGradeSubjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("grade, subject")
        .order("grade")
        .order("subject");

      if (error) throw error;

      // Remove duplicates
      const unique =
        data?.reduce((acc: GradeSubject[], curr) => {
          const exists = acc.find(
            (item) => item.grade === curr.grade && item.subject === curr.subject
          );
          if (!exists) acc.push(curr);
          return acc;
        }, []) || [];

      setGradeSubjects(unique);
    } catch (error) {
      console.error("Error fetching grade/subjects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssessments = useCallback(async () => {
    if (!selectedGrade || !selectedSubject) return;

    try {
      setLoadingAssessments(true);
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("grade", selectedGrade)
        .eq("subject", selectedSubject)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoadingAssessments(false);
    }
  }, [selectedGrade, selectedSubject]);

  useEffect(() => {
    fetchGradeSubjects();
  }, [fetchGradeSubjects]);

  useEffect(() => {
    if (selectedGrade && selectedSubject) {
      fetchAssessments();
    }
  }, [selectedGrade, selectedSubject, fetchAssessments]);

  const uniqueGrades = [...new Set(gradeSubjects.map((gs) => gs.grade))].sort(
    (a, b) => a - b
  );
  const availableSubjects = gradeSubjects
    .filter((gs) => (selectedGrade ? gs.grade === selectedGrade : true))
    .map((gs) => gs.subject)
    .filter((subject, index, arr) => arr.indexOf(subject) === index)
    .sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-100 mb-8 text-center">
            Student Portal
          </h1>

          {loading ? (
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-700/50">
              <div className="text-center">
                <p className="text-gray-400">
                  Loading available assessments...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-700/50">
                <h2 className="text-2xl font-bold text-gray-100 mb-6">
                  Select Grade
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uniqueGrades.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => {
                        setSelectedGrade(grade);
                        setSelectedSubject(null);
                      }}
                      className={`p-4 rounded-lg font-semibold transition-all ${
                        selectedGrade === grade
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      Grade {grade}
                    </button>
                  ))}
                </div>
              </div>

              {selectedGrade && (
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-700/50">
                  <h2 className="text-2xl font-bold text-gray-100 mb-6">
                    Select Subject
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableSubjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => setSelectedSubject(subject)}
                        className={`p-4 rounded-lg font-semibold transition-all ${
                          selectedSubject === subject
                            ? "bg-green-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedGrade && selectedSubject && (
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-700/50">
                  <h2 className="text-2xl font-bold text-gray-100 mb-6">
                    Grade {selectedGrade} {selectedSubject} Assessments
                  </h2>

                  {loadingAssessments ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Loading assessments...</p>
                    </div>
                  ) : assessments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">
                        No assessments available for this grade and subject.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {assessments.map((assessment) => (
                        <div
                          key={assessment.id}
                          className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg border border-gray-600/50"
                        >
                          <div>
                            <h3 className="text-lg font-semibold text-gray-100 mb-1">
                              {assessment.title}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {assessment.total_questions} questions
                            </p>
                          </div>
                          <Link to={`/assessment/${assessment.id}`}>
                            <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
                              Start Assessment
                            </button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Student;
