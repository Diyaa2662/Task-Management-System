import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "../api/axios";
import { getToken } from "../utils/auth";

function AddTaskToCategory() {
  const navigate = useNavigate();
  const { categoryId } = useParams(); // ID الفئة
  const location = useLocation();

  // استخرج groupId من query أو state (حسب كيف تستدعي الصفحة)
  const searchParams = new URLSearchParams(location.search);
  const groupId = searchParams.get("groupId");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "1",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `/categories/${categoryId}/add-task`,
        {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          due_date: formData.dueDate,
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      // بعد نجاح الإضافة، العودة إلى صفحة تفاصيل المجموعة
      if (groupId) {
        navigate(`/groups/${groupId}`);
      } else {
        navigate(-1); // fallback
      }
    } catch (err) {
      console.error("فشل إضافة المهمة:", err.response?.data || err.message);
      alert("حدث خطأ أثناء إضافة المهمة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-right">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          إضافة مهمة إلى الفئة
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
              rows={3}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <option value={1}>متوسطة</option>
                <option value={2}>مرتفعة</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
                تاريخ الاستحقاق
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "جارٍ الحفظ..." : "حفظ المهمة"}
            </button>

            <button
              type="button"
              onClick={() =>
                groupId ? navigate(`/groups/${groupId}`) : navigate(-1)
              }
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

export default AddTaskToCategory;
