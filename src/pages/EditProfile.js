import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateUser } from "../utils/auth";
import axios from "../api/axios";

function EditProfile() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user && loading) {
      setFormData({ name: user.name || "" });
      setLoading(false);
    }
  }, [user, loading]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChangeInput = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // تعديل الاسم
      const nameRes = await axios.post("/users/edit-me", formData);
      if (nameRes.data?.success) {
        updateUser(nameRes.data.data);
        alert("تم تعديل الاسم بنجاح!");
      }

      // تغيير كلمة المرور
      if (
        passwordData.oldPassword &&
        passwordData.newPassword &&
        passwordData.confirmPassword
      ) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          alert("كلمة المرور الجديدة وتأكيدها غير متطابقين");
          return;
        }

        const fd = new FormData();
        fd.append("old_password", passwordData.oldPassword);
        fd.append("new_password", passwordData.newPassword);
        fd.append("new_password_confirmation", passwordData.confirmPassword);

        const passRes = await axios.post("/auth/change-password", fd, {
          headers: { Accept: "application/json" },
        });

        if (passRes.data?.success) {
          alert("تم تغيير كلمة المرور بنجاح!");
          setPasswordData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      }

      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ التعديلات، تحقق من البيانات المدخلة.");
    }
  };

  const handleCancel = () => navigate("/profile");

  if (loading) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-right">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          تعديل الملف الشخصي
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
              الاسم
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

          <hr className="my-4 border-gray-300 dark:border-gray-700" />

          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
              كلمة المرور القديمة
            </label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChangeInput}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChangeInput}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
              تأكيد كلمة المرور الجديدة
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChangeInput}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
