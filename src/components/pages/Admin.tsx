import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-100 mb-8">
            Admin Dashboard
          </h1>
          
          <Link to="/admin/assessments" className="block">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-700/50 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-100 group-hover:text-gray-300 transition-colors">
                  Assessments
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Create, edit, and manage assessments for students. Upload JSON-based question sets and organize them by grade and subject.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;
