import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="bg-gray-900 shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/admin"
              className="text-gray-300 hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;