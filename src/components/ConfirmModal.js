import React from "react";
import { XCircle } from "lucide-react";

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 text-right">
        {/* العنوان */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <XCircle className="text-red-500" /> {title}
        </h2>

        {/* الرسالة */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

        {/* الأزرار */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
