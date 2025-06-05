import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  // ⚠️ بيانات وهمية مؤقتة (سيتم ربطها بالـ backend لاحقًا)
  const userName = "ضياء";

  const stats = [
    { title: "عدد المهام", value: 25, color: "blue" },
    { title: "المهام المكتملة", value: 12, color: "green" },
    { title: "المهام المتأخرة", value: 4, color: "red" },
    { title: "عدد المجموعات", value: 3, color: "purple" },
  ];

  const recentTasks = [
    { id: 1, title: "مراجعة كود تسجيل الدخول", status: "قيد التنفيذ" },
    { id: 2, title: "إضافة صفحة المجموعات", status: "مؤجلة" },
    { id: 3, title: "تحسين واجهة لوحة التحكم", status: "مكتملة" },
  ];

  return (
    <div className="text-right">
      {/* 🟦 1. رسالة ترحيب */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          مرحبًا، {userName} 👋
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          يسعدنا وجودك! إليك نظرة سريعة على حالة المهام الحالية.
        </p>
      </div>

      {/* 🟦 2. ملخص سريع */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded shadow-md text-center border"
          >
            <h3
              className={`text-lg font-semibold mb-2 text-${item.color}-600 dark:text-${item.color}-400`}
            >
              {item.title}
            </h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* 🟦 3. آخر المهام */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          آخر المهام المضافة
        </h3>

        <ul className="space-y-4">
          {recentTasks.map((task) => (
            <li
              key={task.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow border flex justify-between items-center"
            >
              <span className="text-gray-800 dark:text-white">
                {task.title}
              </span>
              <span className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-white">
                {task.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {/* زر الإضافة */}
      <div className="mt-6 text-center">
        <Link
          to="/tasks"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          الانتقال إلى المهام
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
