import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { getToken } from "../utils/auth";

function EditGroup() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);

  // ✅ جلب بيانات المجموعة عند تحميل الصفحة
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`/groups/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (res.data && res.data.data) {
          setFormData({
            name: res.data.data.name || "",
            description: res.data.data.description || "",
          });
        }
      } catch (err) {
        console.error(
          "❌ فشل جلب بيانات المجموعة:",
          err.response?.data || err.message
        );
        alert("فشل جلب بيانات المجموعة");
        navigate("/groups");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/groups/${id}/edit`, formData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      alert("✅ تم تعديل المجموعة بنجاح");
      navigate(`/groups`);
    } catch (err) {
      console.error(
        "❌ فشل تعديل المجموعة:",
        err.response?.data || err.message
      );
      alert("فشل تعديل المجموعة");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        جاري تحميل بيانات المجموعة...
      </p>
    );
  }

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
              onClick={() => navigate(`/groups`)}
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
