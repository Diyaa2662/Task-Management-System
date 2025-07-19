import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser, logout } from "../utils/auth";

function Profile() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-600 dark:text-gray-300">
        لم يتم تسجيل الدخول.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-right bg-white dark:bg-gray-800 p-6 rounded shadow mt-6 relative min-h-[500px] pb-24">
      {/* عنوان الصفحة */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        الملف الشخصي
      </h2>

      {/* الأيقونة الكبيرة */}
      <div className="flex justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-20 text-gray-500 dark:text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>

      {/* زر تغيير الصورة */}
      <div className="flex justify-center mt-2">
        <label className="cursor-pointer text-sm text-blue-600 hover:underline">
          تغيير الصورة
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                console.log("الصورة المختارة:", file);
              }
            }}
          />
        </label>
      </div>

      {/* معلومات المستخدم */}
      <div className="mb-6 space-y-2 text-lg text-gray-700 dark:text-gray-300">
        <p>
          <strong>الاسم:</strong> {user.name}
        </p>
        <p>
          <strong>البريد:</strong> {user.email}
        </p>
      </div>

      {/* الإحصائيات (اختياري، وهمية مؤقتًا) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
          إحصائيات:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
            <p className="text-gray-600 dark:text-gray-300">المهام</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              15
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
            <p className="text-gray-600 dark:text-gray-300">المكتملة</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">9</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
            <p className="text-gray-600 dark:text-gray-300">المجموعات</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">3</p>
          </div>
        </div>
      </div>

      {/* أزرار أسفل الصفحة */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between mt-8">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          تسجيل الخروج
        </button>

        <Link
          to="/profile/edit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          تعديل الملف الشخصي
        </Link>
      </div>
    </div>
  );
}

export default Profile;
