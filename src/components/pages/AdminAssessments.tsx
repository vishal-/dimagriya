import { useState } from 'react';
import AssessmentForm from '../forms/AssessmentForm';

const AdminAssessments = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-100">Assessments</h1>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              {showForm ? 'Cancel' : 'Create Assessment'}
            </button>
          </div>

          {showForm ? (
            <AssessmentForm onSave={() => setShowForm(false)} />
          ) : (
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700/50">
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No assessments found</p>
                <p className="text-gray-500 text-sm mt-2">
                  Create your first assessment to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAssessments;
