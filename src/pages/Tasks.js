import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { getToken } from "../utils/auth";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/tasks", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        setTasks(response.data.data || []);
      } catch (err) {
        // ✅ اطبع الخطأ الكامل إذا موجود
        console.error("❌ فشل جلب المهام:", err.response?.data || err.message);
        setError("حدث خطأ أثناء جلب المهام.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف المهمة؟")) return;

    try {
      const token = getToken();

      // eslint-disable-next-line no-unused-vars
      const response = await axios.get(`/tasks/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // حذف المهمة من الواجهة مباشرة
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("❌ فشل الحذف:", err);
    }
  };

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

      {/* الفلاتر (مستقبلًا ممكن ربطها بالـ API) */}
      <div className="mb-4 flex flex-wrap gap-4">
        <select className="p-2 rounded border dark:bg-gray-700 dark:text-white">
          <option>كل الحالات</option>
          <option>قيد الانتظار</option>
          <option>قيد التنفيذ</option>
          <option>مكتملة</option>
          <option>عالقة</option>
          <option>ملغاة</option>
        </select>
      </div>

      {/* تحميل أو خطأ */}
      {loading && (
        <p className="text-center text-gray-500">جاري تحميل المهام...</p>
      )}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* قائمة المهام */}
      <div className="grid gap-4">
        {!loading && tasks.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            لا توجد مهام حالياً.
          </p>
        ) : (
          tasks.map((task) => (
            <Link
              to={`/tasks/${task.id}`}
              key={task.id}
              className="p-4 bg-white dark:bg-gray-800 shadow rounded border flex justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
            >
              {/* ✅ القسم الأيمن: العنوان والوصف */}
              <div className="flex-1 pr-4 text-right">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 hidden md:block">
                  {task.description || "بدون وصف"}
                </p>
              </div>

              {/* ✅ القسم الأيسر: الأولوية + الحالة + الحذف */}
              <div className="flex flex-col items-start gap-2 min-w-[100px]">
                {/* الأولوية */}
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100">
                  {task.priority === 0
                    ? "منخفضة"
                    : task.priority === 1
                    ? "عادية"
                    : task.priority === 2
                    ? "متوسطة"
                    : "مرتفعة"}
                </span>

                {/* الحالة */}
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white">
                  {task.status === 0
                    ? "قيد الانتظار"
                    : task.status === 1
                    ? "قيد التنفيذ"
                    : task.status === 2
                    ? "مكتملة"
                    : task.status === 3
                    ? "عالقة"
                    : "ملغاة"}
                </span>

                {/* زر الحذف */}
                <button
                  className="text-xs font-medium px-2 py-1 rounded-full border border-red-500 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:border-red-400 dark:hover:bg-red-800 mt-2 self-start"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(task.id);
                  }}
                >
                  حذف
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;
