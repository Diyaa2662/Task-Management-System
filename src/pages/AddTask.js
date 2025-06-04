import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTask() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "قيد التنفيذ",
    priority: "متوسطة",
    category: "",
    assignee: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("تم إرسال المهمة:", formData);
    navigate("/tasks");
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
                <option>قيد التنفيذ</option>
                <option>مكتملة</option>
                <option>مؤجلة</option>
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
                <option>مرتفعة</option>
                <option>متوسطة</option>
                <option>منخفضة</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
                الفئة / المجموعة
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
                المسؤول
              </label>
              <input
                type="text"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
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
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              حفظ المهمة
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
