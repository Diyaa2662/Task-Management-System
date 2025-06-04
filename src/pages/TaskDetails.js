import React from "react";
import { useParams, Link } from "react-router-dom";

function TaskDetails() {
  const { id } = useParams(); // لاحقًا نستخدمه لجلب المهمة من الـ backend

  // بيانات وهمية مؤقتة
  const task = {
    id,
    title: "إنهاء صفحة تسجيل الدخول",
    description: "إنشاء الواجهة وتنسيقها وربطها مع قاعدة البيانات لاحقًا.",
    status: "قيد التنفيذ",
    priority: "مرتفعة",
    category: "Frontend",
    assignee: "أحمد",
    dueDate: "2025-06-10",
  };

  return (
    <div className="max-w-3xl mx-auto text-right bg-white dark:bg-gray-800 p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        تفاصيل المهمة
      </h2>

      <div className="space-y-3 text-gray-700 dark:text-gray-200">
        <p>
          <span className="font-semibold">العنوان:</span> {task.title}
        </p>
        <p>
          <span className="font-semibold">الوصف:</span> {task.description}
        </p>
        <p>
          <span className="font-semibold">الحالة:</span> {task.status}
        </p>
        <p>
          <span className="font-semibold">الأولوية:</span> {task.priority}
        </p>
        <p>
          <span className="font-semibold">الفئة:</span> {task.category}
        </p>
        <p>
          <span className="font-semibold">المسؤول:</span> {task.assignee}
        </p>
        <p>
          <span className="font-semibold">تاريخ الاستحقاق:</span> {task.dueDate}
        </p>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <Link
          to={`/tasks/${task.id}/edit`}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          تعديل المهمة
        </Link>

        <Link
          to="/tasks"
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
        >
          العودة إلى المهام
        </Link>
      </div>
    </div>
  );
}

export default TaskDetails;
