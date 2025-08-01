import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { getToken } from "../utils/auth";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: 0,
    priority: 0,
    due_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ جلب بيانات المهمة
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const task = response.data.data;

        setFormData({
          title: task.title || "",
          description: task.description || "",
          status: task.status,
          priority: task.priority,
          due_date: task.due_date || "",
        });
      } catch (err) {
        console.error("❌ فشل جلب المهمة:", err);
        setError("حدث خطأ أثناء جلب بيانات المهمة.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "status" || name === "priority" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();

      // 1. تعديل العنوان والوصف وتاريخ الاستحقاق
      await axios.post(
        `/tasks/${id}/edit`,
        {
          title: formData.title,
          description: formData.description,
          due_date: formData.due_date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2. تعديل الحالة
      await axios.post(
        `/tasks/${id}/change-status`,
        {
          status: formData.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 3. تعديل الأولوية
      await axios.post(
        `/tasks/${id}/change-priority`,
        {
          priority: formData.priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/tasks/${id}`);
    } catch (err) {
      console.error("❌ فشل التعديل:", err);
      alert("حدث خطأ أثناء تعديل المهمة.");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-300 mt-6">
        جاري تحميل بيانات المهمة...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 mt-6">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-right">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          تعديل المهمة
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
              عنوان المهمة
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
              الوصف
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
                الحالة
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value={0}>قيد الانتظار</option>
                <option value={1}>قيد التنفيذ</option>
                <option value={2}>مكتملة</option>
                <option value={3}>عالقة</option>
                <option value={4}>ملغاة</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
                الأولوية
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value={0}>منخفضة</option>
                <option value={1}>عادية</option>
                <option value={2}>متوسطة</option>
                <option value={3}>مرتفعة</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
                تاريخ الاستحقاق
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              حفظ التعديلات
            </button>

            <button
              type="button"
              onClick={() => navigate(`/tasks/${id}`)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTask;
