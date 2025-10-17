import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimesCircle
} from "react-icons/fa";
import Modal from "./Modal";

interface AlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  variant?: "success" | "error" | "warning" | "info";
  confirmText?: string;
}

const Alert = ({
  isOpen,
  title,
  message,
  onClose,
  variant = "info",
  confirmText = "OK"
}: AlertProps) => {
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <FaCheckCircle className="w-8 h-8 text-white" />;
      case "error":
        return <FaTimesCircle className="w-8 h-8 text-white" />;
      case "warning":
        return <FaExclamationCircle className="w-8 h-8 text-white" />;
      case "info":
      default:
        return <FaInfoCircle className="w-8 h-8 text-white" />;
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "success":
        return "from-green-500 to-emerald-500";
      case "error":
        return "from-red-500 to-pink-500";
      case "warning":
        return "from-yellow-500 to-orange-500";
      case "info":
      default:
        return "from-blue-500 to-cyan-500";
    }
  };

  const getConfirmButtonColor = () => {
    switch (variant) {
      case "success":
        return "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600";
      case "error":
        return "from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600";
      case "warning":
        return "from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600";
      case "info":
      default:
        return "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <div className="text-center">
        {/* Icon */}
        <div
          className={`mx-auto w-16 h-16 bg-gradient-to-r ${getIconColor()} rounded-full flex items-center justify-center mb-6`}
        >
          {getIcon()}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>

        {/* Message */}
        <p className="text-gray-300 mb-8 leading-relaxed">{message}</p>

        {/* Button */}
        <button
          onClick={onClose}
          className={`w-full bg-gradient-to-r ${getConfirmButtonColor()} text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default Alert;
