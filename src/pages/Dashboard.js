import React from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Users,
} from "lucide-react";

function Dashboard() {
  const stats = [
    {
      title: "عدد المهام",
      value: 25,
      icon: ClipboardList,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "المهام المكتملة",
      value: 12,
      icon: CheckCircle2,
      color: "from-green-500 to-green-700",
    },
    {
      title: "المهام العالقة",
      value: 4,
      icon: AlertTriangle,
      color: "from-red-500 to-red-700",
    },
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

  const getStatusColor = (status) => {
    switch (status) {
      case "قيد التنفيذ":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-white";
      case "مؤجلة":
        return "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white";
      case "مكتملة":
        return "bg-green-100 text-green-700 dark:bg-green-600 dark:text-white";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-white";
    }
  };

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
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to="/tasks"
              className={`block rounded-2xl shadow hover:shadow-lg transition transform hover:scale-[1.02] bg-gradient-to-br ${item.color} text-white p-6`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <Icon className="w-8 h-8 opacity-90" />
              </div>
              <p className="text-3xl font-bold">{item.value}</p>
            </Link>
          );
        })}
      </div>

      {/* آخر المهام */}
      <div className="mb-10 relative bg-transparent">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          آخر المهام المضافة
        </h3>
        <ul className="space-y-4 mb-14">
          {recentTasks.map((task) => (
            <li
              key={task.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border flex justify-between items-center hover:shadow-md transition"
            >
              <span className="text-gray-800 dark:text-white">
                {task.title}
              </span>
              <span
                className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {task.status}
              </span>
            </li>
          ))}
        </ul>
        <div className="absolute -bottom-14 left-1">
          <Link
            to="/tasks"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <ClipboardList className="w-5 h-5" />
            عرض المهام
          </Link>
        </div>
      </div>

      {/* مجموعات المستخدم */}
      <div className="relative bg-transparent">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          المجموعات التي تنتمي إليها
        </h3>
        <ul className="space-y-4 mb-14">
          {userGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border flex items-center gap-3"
            >
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-800 dark:text-white font-medium">
                {group.name}
              </span>
            </div>
          ))}
        </ul>
        <div className="absolute -bottom-14 left-1">
          <Link
            to="/groups"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <Users className="w-5 h-5" />
            عرض المجموعات
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
