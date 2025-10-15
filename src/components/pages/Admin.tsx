const Admin = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Admin Dashboard
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            Welcome to the admin panel. This area is restricted to
            administrators only.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <h3 className="font-semibold text-red-900 mb-2">Users</h3>
              <p className="text-red-700 text-sm">
                Manage user accounts and permissions.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h3 className="font-semibold text-yellow-900 mb-2">Settings</h3>
              <p className="text-yellow-700 text-sm">
                Configure application settings.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h3 className="font-semibold text-purple-900 mb-2">Analytics</h3>
              <p className="text-purple-700 text-sm">
                View application analytics and reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
