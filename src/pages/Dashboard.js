import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  // بيانات وهمية مؤقتة
  const stats = [
    { title: "عدد المهام", value: 25, color: "blue" },
    { title: "المهام المكتملة", value: 12, color: "green" },
    { title: "المهام المتأخرة", value: 4, color: "red" },
  ];

  const recentTasks = [
    { id: 1, title: "مراجعة كود تسجيل الدخول", status: "قيد التنفيذ" },
    { id: 2, title: "إضافة صفحة المجموعات", status: "مؤجلة" },
    { id: 3, title: "تحسين واجهة لوحة التحكم", status: "مكتملة" },
  ];

  const userGroups = [
    { id: 1, name: "فريق التصميم" },
    { id: 2, name: "فريق البرمجة" },
    { id: 3, name: "فريق التسويق" },
  ];

  return (
    <div className="text-right">
      {/* رسالة ترحيب */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          لوحة التحكم
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          مرحبًا بك 👋 هذا ملخص سريع حول مهامك ومجموعاتك.
        </p>
      </div>

      {/* ملخص المهام */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((item, index) => (
          <Link
            key={index}
            to="/tasks"
            className={`block bg-white dark:bg-gray-800 p-6 rounded shadow-md border hover:shadow-lg transition transform hover:scale-[1.02]`}
          >
            <h3
              className={`text-lg font-semibold mb-2 text-${item.color}-600 dark:text-${item.color}-400`}
            >
              {item.title}
            </h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {item.value}
            </p>
          </Link>
        ))}
      </div>

      {/* آخر المهام */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          آخر المهام المضافة
        </h3>
        <ul className="space-y-4">
          {recentTasks.map((task) => (
            <li
              key={task.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow border flex justify-between items-center hover:shadow-md transition"
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

      {/* مجموعات المستخدم */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          المجموعات التي تنتمي إليها
        </h3>
        <ul className="space-y-4">
          {userGroups.map((group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="block bg-white dark:bg-gray-800 p-4 rounded shadow border hover:shadow-md transition"
            >
              <span className="text-gray-800 dark:text-white font-medium">
                {group.name}
              </span>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
