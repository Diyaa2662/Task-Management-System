import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { getToken } from "../utils/auth";
import { ClipboardList, CheckCircle2, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useToast } from "../components/ToastProvider";

function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    by_status: {},
    by_priority: {},
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksStatRes = await axios.post(
          "/tasks/my-stat",
          {},
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );

        const taskStats = tasksStatRes.data?.data || {};
        setStats({
          totalTasks: taskStats?.totals?.tasks_total || 0,
          completedTasks: taskStats?.by_status?.Complete || 0,
          pendingTasks: taskStats?.by_status?.Stock || 0,
          by_status: taskStats?.by_status || {},
          by_priority: taskStats?.by_priority || {},
        });
      } catch (error) {
        console.error("خطأ في جلب بيانات لوحة التحكم:", error);
        showToast("❌ فشل جلب بيانات لوحة التحكم", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  if (loading) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-300 mt-6">
        جاري تحميل لوحة التحكم...
      </div>
    );
  }

  const statCards = [
    {
      title: "عدد المهام",
      value: stats.totalTasks,
      icon: ClipboardList,
      color: "from-blue-300 to-blue-700",
    },
    {
      title: "المهام المكتملة",
      value: stats.completedTasks,
      icon: CheckCircle2,
      color: "from-green-300 to-green-700",
    },
    {
      title: "المهام العالقة",
      value: stats.pendingTasks,
      icon: AlertTriangle,
      color: "from-red-300 to-red-700",
    },
  ];

  const pieData = [
    {
      name: "قيد الانتظار",
      value: Number(stats.by_status.Pending || 0),
      color: "#facc15",
    },
    {
      name: "قيد التنفيذ",
      value: Number(stats.by_status.InProgress || 0),
      color: "#3b82f6",
    },
    {
      name: "مكتملة",
      value: Number(stats.by_status.Complete || 0),
      color: "#22c55e",
    },
    {
      name: "ملغاة",
      value: Number(stats.by_status.Canceled || 0),
      color: "#f43f5e",
    },
    {
      name: "عالقة",
      value: Number(stats.by_status.Stock || 0),
      color: "#6b7280",
    },
  ];

  const priorityColors = {
    low: "gray",
    Normal: "green",
    Medium: "yellow",
    High: "red",
  };

  return (
    <div className="text-right">
      {/* رسالة ترحيب */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          لوحة التحكم
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          مرحبًا بك 👋 هذا ملخص سريع حول مهامك.
        </p>
      </div>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {statCards.map((item, index) => {
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

      {/* القسم السفلي */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* المخطط Pie */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            توزيع المهام حسب الحالة
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                labelLine={false}
                label={({ cx, cy, midAngle, outerRadius, value }) => {
                  if (value === 0) return "";
                  const radius = outerRadius - 20;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={13}
                      fontWeight="bold"
                    >
                      {value}
                    </text>
                  );
                }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center mt-2 text-gray-600 dark:text-gray-300">
            المجموع الكلي: {stats.totalTasks}
          </p>
        </div>

        {/* التقدم + تفاصيل إضافية */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex flex-col justify-between">
          {/* شريط التقدم */}
          <div>
            <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-12">
              نسبة الإنجاز
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{
                    width: `${
                      stats.totalTasks > 0
                        ? (stats.completedTasks / stats.totalTasks) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                {stats.totalTasks > 0
                  ? `${Math.round(
                      (stats.completedTasks / stats.totalTasks) * 100
                    )}%`
                  : "0%"}
              </span>
            </div>
          </div>

          {/* النصف السفلي */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* حسب الحالة */}
            <div>
              <h4 className="text-md font-bold text-gray-800 dark:text-white mb-4">
                المهام حسب الحالة
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {pieData.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    {item.name}: {item.value}
                  </li>
                ))}
              </ul>
            </div>

            {/* حسب الأولوية */}
            <div>
              <h4 className="text-md font-bold text-gray-800 dark:text-white mb-3">
                المهام حسب الأولوية
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {Object.entries(priorityColors).map(([key, color]) => (
                  <li key={key} className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    ></span>
                    {key === "low"
                      ? "منخفضة"
                      : key === "Normal"
                      ? "عادية"
                      : key === "Medium"
                      ? "متوسطة"
                      : "مرتفعة"}{" "}
                    : {stats.by_priority[key] || 0}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
