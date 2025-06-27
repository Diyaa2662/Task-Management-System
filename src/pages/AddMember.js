import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddMember() {
  const navigate = useNavigate();
  const { id } = useParams(); // ID المجموعة

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "assignee", // القيمة الابتدائية: مكلف
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`تم إضافة العضو إلى المجموعة رقم ${id}:`, formData);
    navigate(`/groups/${id}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-right">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          إضافة عضو جديد
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* الاسم */}
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
              اسم العضو
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="أدخل اسم العضو"
            />
          </div>

          {/* البريد */}
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
              البريد الإلكتروني (اختياري)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="email@example.com"
            />
          </div>

          {/* الدور */}
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
              الدور داخل المجموعة
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="owner">مالك المجموعة</option>
              <option value="admin">مدير المجموعة</option>
              <option value="manager">إداري المجموعة</option>
              <option value="assignee">مكلف (عضو عادي)</option>
            </select>
          </div>

          {/* الأزرار */}
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              إضافة العضو
            </button>

            <button
              type="button"
              onClick={() => navigate(`/groups/${id}`)}
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

export default AddMember;
