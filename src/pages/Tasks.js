import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { getToken } from "../utils/auth";
import { Eye, Trash2 } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../components/ToastProvider";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // ✅ للتأكيد على الحذف
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/tasks", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setTasks(response.data.data || []);
      } catch (err) {
        console.error("❌ فشل جلب المهام:", err.response?.data || err.message);
        setError("حدث خطأ أثناء جلب المهام.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleDelete = async () => {
    if (!selectedTask) return;

    try {
      await axios.get(`/tasks/${selectedTask.id}/delete`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setTasks((prev) => prev.filter((task) => task.id !== selectedTask.id));
      showToast("🗑️ تم حذف المهمة بنجاح", "success");
    } catch (err) {
      console.error("❌ فشل الحذف:", err);
      showToast("❌ حدث خطأ أثناء حذف المهمة", "error");
    } finally {
      setConfirmOpen(false);
      setSelectedTask(null);
    }
  };

  const handleFilterChange = (e) => setFilterStatus(e.target.value);

  const filteredTasks =
    filterStatus === "all"
      ? tasks
      : tasks.filter((task) => String(task.status) === filterStatus);

  return (
    <div>
      {/* عنوان + فلتر + زر إضافة */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          قائمة المهام
        </h2>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <select
            value={filterStatus}
            onChange={handleFilterChange}
            className="p-2 rounded border dark:bg-gray-700 dark:text-white"
          >
            <option value="all">كل الحالات</option>
            <option value="0">قيد الانتظار</option>
            <option value="1">قيد التنفيذ</option>
            <option value="2">مكتملة</option>
            <option value="3">عالقة</option>
            <option value="4">ملغاة</option>
          </select>
          <Link
            to="/tasks/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + إضافة مهمة
          </Link>
        </div>
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
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="grid grid-cols-12 items-stretch gap-4 p-4 bg-white dark:bg-gray-800 shadow rounded border hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              {/* العنوان والوصف */}
              <div className="col-span-12 md:col-span-6 text-right">
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 hidden md:block">
                  {(task.description?.length || 0) <= 50
                    ? task.description || "بدون وصف"
                    : `${task.description.slice(0, 50)}...`}
                </p>
              </div>

              {/* الحالة */}
              <div className="col-span-6 md:col-span-2 flex items-center md:justify-center text-sm">
                <div
                  className={`w-full h-full px-3 py-2 rounded-md flex items-center justify-center
      ${
        task.status === 0
          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"
          : task.status === 1
          ? "bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-blue-100"
          : task.status === 2
          ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
          : task.status === 3
          ? "bg-gray-500 text-white dark:bg-gray-950 dark:text-white"
          : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
      }`}
                >
                  {task.status === 0
                    ? "قيد الانتظار"
                    : task.status === 1
                    ? "قيد التنفيذ"
                    : task.status === 2
                    ? "مكتملة"
                    : task.status === 3
                    ? "عالقة"
                    : "ملغاة"}
                </div>
              </div>

              {/* الأولوية */}
              <div className="col-span-6 md:col-span-2 flex items-center md:justify-center text-sm">
                <div
                  className={`w-full h-full px-3 py-2 rounded-md flex items-center justify-center
      ${
        task.priority === 0
          ? "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-white"
          : task.priority === 1
          ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
          : task.priority === 2
          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
          : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
      }`}
                >
                  {task.priority === 0
                    ? "منخفضة"
                    : task.priority === 1
                    ? "عادية"
                    : task.priority === 2
                    ? "متوسطة"
                    : "مرتفعة"}
                </div>
              </div>

              {/* الأزرار */}
              <div className="col-span-12 md:col-span-2 flex flex-col gap-2 items-end md:items-center">
                <Link
                  to={`/tasks/${task.id}`}
                  className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full border border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-400 dark:hover:bg-blue-800 transition"
                >
                  <Eye className="w-4 h-4" /> عرض التفاصيل
                </Link>

                <button
                  className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full border border-red-500 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:border-red-400 dark:hover:bg-red-800 transition"
                  onClick={() => {
                    setSelectedTask(task);
                    setConfirmOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" /> حذف
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ مودال التأكيد */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="تأكيد الحذف"
        message={
          selectedTask
            ? `هل أنت متأكد أنك تريد حذف المهمة: "${selectedTask.title}"؟`
            : "هل أنت متأكد أنك تريد الحذف؟"
        }
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedTask(null);
        }}
      />
    </div>
  );
}

export default Tasks;
