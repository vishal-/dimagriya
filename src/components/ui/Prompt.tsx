import { FaExclamationTriangle } from "react-icons/fa";
import Modal from "./Modal";

interface PromptProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "warning" | "danger" | "info";
}

const Prompt = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "warning"
}: PromptProps) => {
  const getIconColor = () => {
    switch (variant) {
      case "danger":
        return "from-red-500 to-pink-500";
      case "info":
        return "from-blue-500 to-cyan-500";
      case "warning":
      default:
        return "from-yellow-500 to-orange-500";
    }
  };

  const getConfirmButtonColor = () => {
    switch (variant) {
      case "danger":
        return "from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600";
      case "info":
        return "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600";
      case "warning":
      default:
        return "from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="" size="md">
      <div className="text-center">
        {/* Icon */}
        <div
          className={`mx-auto w-16 h-16 bg-gradient-to-r ${getIconColor()} rounded-full flex items-center justify-center mb-6`}
        >
          <FaExclamationTriangle className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>

        {/* Message */}
        <p className="text-gray-300 mb-8 leading-relaxed">{message}</p>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 bg-gradient-to-r ${getConfirmButtonColor()} text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Prompt;
