import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { getToken } from "../utils/auth";

function AddTask() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: 0,
    priority: 1,
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" || name === "priority" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getToken();

      // 1. تجهيز البيانات الأساسية (بدون الحالة والأولوية)
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("due_date", formData.dueDate);

      // 2. إرسال الطلب الأول: إنشاء المهمة
      const response = await axios.post("/tasks/create", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("استجابة الإنشاء الكاملة:", response.data);

      const taskId = response.data.data.id;

      // 3. إرسال الحالة
      await axios.post(
        `/tasks/${taskId}/change-status`,
        { status: Number(formData.status) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 4. إرسال الأولوية
      await axios.post(
        `/tasks/${taskId}/change-priority`,
        { priority: Number(formData.priority) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ تمت إضافة المهمة وكل القيم");
      navigate("/tasks");
    } catch (err) {
      console.error("❌ فشل إضافة المهمة:", err);
      alert("حدث خطأ أثناء إضافة المهمة. تأكد من البيانات وحاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-right">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          إضافة مهمة جديدة
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
              onClick={() => navigate("/tasks")}
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

export default AddTask;
