import React, { useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "تمت دعوتك للانضمام إلى مجموعة فريق التصميم" },
    { id: 2, message: "تمت إضافتك إلى مجموعة فريق البرمجة" },
  ]);

  const handleAccept = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    alert("✅ تم قبول الدعوة (لاحقًا سيتم الربط مع API)");
  };

  const handleReject = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    alert("❌ تم رفض الدعوة");
  };

  return (
    <div className="max-w-2xl mx-auto mt-24 p-6 bg-white dark:bg-gray-800 rounded shadow text-right">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        الإشعارات
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          لا توجد إشعارات حالياً.
        </p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow-sm"
            >
              <p className="text-sm text-gray-800 dark:text-white mb-3">
                {n.message}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => handleAccept(n.id)}
                  className="text-sm text-green-600 hover:underline"
                >
                  قبول
                </button>
                <button
                  onClick={() => handleReject(n.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  رفض
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
