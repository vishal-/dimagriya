import { FaClock } from "react-icons/fa6";

const AssessmentInstructions = () => (
  <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-gray-700/50">
    <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
      <FaClock className="mr-3 text-orange-400" />
      Assessment Instructions
    </h2>

    <div className="space-y-4 text-gray-300">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
          1
        </div>
        <p>Read each question carefully before selecting your answer.</p>
      </div>

      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
          2
        </div>
        <p>You can navigate between questions using the navigation provided.</p>
      </div>

      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
          3
        </div>
        <p>
          Make sure to review your answers before submitting the assessment.
        </p>
      </div>

      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
          4
        </div>
        <p>
          Once you start the assessment, the timer will begin. You cannot pause
          the timer.
        </p>
      </div>

      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
          !
        </div>
        <p className="text-orange-300 font-semibold">
          Ensure you have a stable internet connection before starting the
          assessment.
        </p>
      </div>
    </div>
  </div>
);

export default AssessmentInstructions;
