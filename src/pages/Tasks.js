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
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
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
                    ? "متوسطة"
                    : "مرتفعة"}
                </span>

                {/* الحالة */}
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white">
                  {task.status}
                </span>

                {/* زر الحذف */}
                <button
                  className="text-sm text-red-600 hover:underline mt-2 self-start"
                  onClick={async (e) => {
                    e.preventDefault(); // منع الانتقال عند الضغط على الزر

                    const confirmDelete = window.confirm(
                      "هل أنت متأكد من حذف المهمة؟"
                    );
                    if (!confirmDelete) return;

                    try {
                      const response = await fetch(
                        `https://task-management-api.alwakkaa.com/tasks/${task.id}/delete`,
                        {
                          method: "DELETE",
                        }
                      );

                      if (!response.ok) {
                        throw new Error("فشل في حذف المهمة");
                      }

                      // ✅ حذف المهمة من الواجهة
                      setTasks((prev) => prev.filter((t) => t.id !== task.id));
                      console.log("🗑️ تم حذف المهمة:", task.id);
                    } catch (error) {
                      console.error("❌ فشل الحذف:", error);
                      alert("حدث خطأ أثناء محاولة الحذف");
                    }
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
