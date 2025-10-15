import { useState } from 'react';
import type { Assessment } from '../../types/assessment';
import supabase from '../../utils/supabase';

interface AssessmentFormProps {
  assessment?: Assessment;
  onSave?: () => void;
}

const AssessmentForm = ({ assessment, onSave }: AssessmentFormProps) => {
  const [jsonInput, setJsonInput] = useState(
    assessment ? JSON.stringify(assessment, null, 2) : ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      
      const parsedAssessment: Assessment = JSON.parse(jsonInput);
      
      const { error: supabaseError } = await supabase
        .from('assessments')
        .insert([parsedAssessment]);

      if (supabaseError) throw supabaseError;
      
      onSave?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700/50">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">
        {assessment ? 'Edit Assessment' : 'Create Assessment'}
      </h2>
      
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Assessment JSON
        </label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full h-96 bg-gray-900 text-gray-100 border border-gray-600 rounded-lg p-4 font-mono text-sm"
          placeholder="Paste your assessment JSON here..."
        />
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={loading || !jsonInput.trim()}
          className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Assessment'}
        </button>
      </div>
    </div>
  );
};

export default AssessmentForm;