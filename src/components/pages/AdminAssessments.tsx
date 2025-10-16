import { useState, useEffect } from 'react';
import type { Assessment } from '../../types/assessment';
import AssessmentForm from '../forms/AssessmentForm';
import supabase from '../../utils/supabase';

const AdminAssessments = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const fetchAssessments = async (page: number) => {
    try {
      setLoading(true);
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error, count } = await supabase
        .from('assessments')
        .select('*', { count: 'exact' })
        .order('updated_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setAssessments(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching assessments:', error);
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
              {showForm ? 'Cancel' : 'Create Assessment'}
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
                    <p className="text-gray-400 text-lg">No assessments found</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Create your first assessment to get started
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid gap-4">
                    {assessments.map((assessment) => (
                      <div 
                        key={assessment.id} 
                        onClick={() => {
                          setSelectedAssessment(assessment);
                          setShowForm(true);
                        }}
                        className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700/50 hover:shadow-2xl transition-all cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-100 mb-2">{assessment.title}</h3>
                            <p className="text-gray-400 mb-2">Grade {assessment.grade} • {assessment.subject}</p>
                            <p className="text-gray-500 text-sm">{assessment.total_questions} questions</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500 text-xs">
                              Updated: {assessment.updated_at ? new Date(assessment.updated_at).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
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
    </div>
  );
};

export default AdminAssessments;
