import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditGroup() {
  const navigate = useNavigate();
  const { id } = useParams();

  // بيانات وهمية مؤقتة (لاحقًا ستأتي من الـ backend)
  const existingGroup = {
    id,
    name: "فريق البرمجة",
    description: "هذه المجموعة مسؤولة عن تطوير وظائف الموقع وكتابة الكود",
  };

  const [formData, setFormData] = useState({
    name: existingGroup.name,
    description: existingGroup.description,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📌 تم تعديل المجموعة:", formData);
    // مستقبلاً: إرسال البيانات إلى الـ API
    navigate("/groups");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-right">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          تعديل المجموعة
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* 🔹 اسم المجموعة */}
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
              اسم المجموعة
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* 🔹 وصف المجموعة */}
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
              وصف المجموعة
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="مثال: هذه المجموعة مسؤولة عن..."
            ></textarea>
          </div>

          {/* 🔘 الأزرار */}
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              حفظ التعديلات
            </button>

            <button
              type="button"
              onClick={() => navigate("/groups/:id")}
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

export default EditGroup;
