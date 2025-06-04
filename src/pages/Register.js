import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  // ✅ قراءة التفضيل من localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark";
  });

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkMode]);

  // محاكاة إنشاء الحساب والانتقال إلى لوحة التحكم
  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 transition-colors">
      {/* زر تغيير الثيم */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 left-4 text-2xl hover:scale-110 transition"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">إنشاء حساب جديد</h2>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-right text-sm mb-1">
              الاسم الكامل
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-md text-right dark:bg-gray-700 dark:text-white"
              placeholder="الاسم الكامل"
            />
          </div>

          <div>
            <label className="block text-right text-sm mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              className="w-full p-3 border rounded-md text-right dark:bg-gray-700 dark:text-white"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-right text-sm mb-1">كلمة المرور</label>
            <input
              type="password"
              className="w-full p-3 border rounded-md text-right dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-right text-sm mb-1">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              className="w-full p-3 border rounded-md text-right dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            إنشاء الحساب
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          لديك حساب؟{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            تسجيل الدخول
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-gray-500 dark:text-gray-300 text-sm hover:underline"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
