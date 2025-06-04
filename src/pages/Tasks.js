import React from "react";
import { Link } from "react-router-dom";

const dummyTasks = [
  {
    id: 1,
    title: "إنهاء واجهة تسجيل الدخول",
    status: "قيد التنفيذ",
    priority: "مرتفعة",
    category: "Frontend",
    assignee: "أحمد",
  },
  {
    id: 2,
    title: "مراجعة وثيقة المتطلبات",
    status: "مكتملة",
    priority: "متوسطة",
    category: "تحليل",
    assignee: "سارة",
  },
];

function Tasks() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          قائمة المهام
        </h2>
        <Link
          to="/tasks/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + إضافة مهمة
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <select className="p-2 rounded border dark:bg-gray-700 dark:text-white">
          <option>كل الحالات</option>
          <option>قيد التنفيذ</option>
          <option>مكتملة</option>
          <option>مؤجلة</option>
        </select>

        <select className="p-2 rounded border dark:bg-gray-700 dark:text-white">
          <option>كل الفئات</option>
          <option>Frontend</option>
          <option>Backend</option>
          <option>تصميم</option>
        </select>
      </div>

      <div className="grid gap-4">
        {dummyTasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-white dark:bg-gray-800 shadow rounded border flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {task.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                الفئة: {task.category}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                المسؤول: {task.assignee}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                {task.status}
              </span>

              {/* ✅ زر عرض التفاصيل */}
              <Link
                to={`/tasks/${task.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                عرض التفاصيل
              </Link>

              {/* زر الحذف (اختياري) */}
              <button className="text-sm text-red-600 hover:underline">
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
