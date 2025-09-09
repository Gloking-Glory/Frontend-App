"use client"; 

import { FC } from "react"; 
import { motion, AnimatePresence } from "framer-motion"; 
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"; 

type AlertType = "success" | "error" | "warning";

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  type?: AlertType;
  onClose: () => void;
}

const iconMap: Record<AlertType, React.ReactNode> = {
  success: <CheckCircle className="w-16 h-16 text-green-500" />,
  error: <XCircle className="w-16 h-16 text-red-500" />,
  warning: <AlertTriangle className="w-16 h-16 text-yellow-500" />,
};

const AlertModal: FC<AlertModalProps> = ({
  isOpen,
  title,
  subtitle,
  type = "success", 
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-center mb-4">{iconMap[type]}</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {title}
            </h2>
            <p className="text-gray-600 mb-6">{subtitle}</p>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium shadow-md transition"
            >
              Ok
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertModal;
