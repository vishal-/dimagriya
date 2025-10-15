const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent mb-6">
              Welcome Home
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover amazing features and possibilities with our modern application
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-700/50">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-4 group-hover:text-gray-300 transition-colors">
                Lightning Fast
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Experience blazing fast performance with our optimized architecture and modern technologies.
              </p>
            </div>
            
            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-700/50">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-4 group-hover:text-gray-300 transition-colors">
                Reliable & Secure
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Built with security in mind, ensuring your data is protected with industry-standard practices.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <button className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
