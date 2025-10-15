const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome Home</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            This is the home page of your application. You can customize this
            content as needed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Feature 1</h3>
              <p className="text-blue-700 text-sm">
                Description of your first feature.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Feature 2</h3>
              <p className="text-green-700 text-sm">
                Description of your second feature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
