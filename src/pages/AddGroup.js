import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { getToken } from "../utils/auth";
import { useToast } from "../components/ToastProvider";

function AddGroup() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "/groups/create",
        {
          name: formData.name,
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      showToast("✅ تم إنشاء المجموعة بنجاح", "success");

      // بعد الحفظ، نعيد المستخدم لصفحة المجموعات
      navigate("/groups");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "❌ حدث خطأ أثناء إنشاء المجموعة، حاول مجددًا.";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-right">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          إضافة مجموعة جديدة
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="grid gap-4">
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
              placeholder="مثال: فريق التصميم"
            />
          </div>

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
              placeholder="مثال: هذه المجموعة مسؤولة عن تصميم واجهات المستخدم"
            ></textarea>
          </div>

          <div className="flex justify-between gap-4 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "جارٍ الحفظ..." : "حفظ المجموعة"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/groups")}
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

export default AddGroup;
