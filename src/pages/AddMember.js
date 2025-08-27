import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { getToken } from "../utils/auth";

function AddMember() {
  const navigate = useNavigate();
  const { id } = useParams(); // ID المجموعة

  const [formData, setFormData] = useState({
    email: "",
    role: "1", // مكلف
  });

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setServerError("");
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setServerError("");
    setFieldErrors({});

    try {
      const fd = new FormData();
      fd.append("email", formData.email.trim());
      fd.append("role", formData.role); // لازم رقم كسلسلة

      await axios.post(`/groups/${id}/invite-member`, fd, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });

      alert("✅ تم إرسال دعوة الانضمام بنجاح");
      navigate(`/groups/${id}`);
    } catch (err) {
      const data = err.response?.data;
      // أمثلة رسائل التحقق من Laravel
      if (data?.errors) setFieldErrors(data.errors);
      if (data?.message) setServerError(data.message);
      console.error("فشل إضافة العضو:", data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-right">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          إضافة عضو جديد
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* البريد */}
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="email@example.com"
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-600 mt-1">
                {fieldErrors.email[0]}
              </p>
            )}
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
              <option value="0">مدير المجموعة</option>
              <option value="2">إداري المجموعة</option>
              <option value="1">مكلف</option>
            </select>
            {fieldErrors.role && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.role[0]}</p>
            )}
          </div>

          {serverError && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-2 rounded">
              {serverError}
            </div>
          )}

          {/* الأزرار */}
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-60"
            >
              {submitting ? "جارٍ الإرسال..." : "إضافة العضو"}
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
