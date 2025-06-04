import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  // ✅ قراءة الثيم من localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark";
  });

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // ✅ تطبيق الكلاس على <html>
  useEffect(() => {
    const html = document.documentElement;
    darkMode ? html.classList.add("dark") : html.classList.remove("dark");
  }, [darkMode]);

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
        <h2 className="text-2xl font-bold mb-4 text-center">
          نسيت كلمة المرور؟
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-sm">
          أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.
        </p>

        <form className="space-y-4">
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            إرسال رابط الاستعادة
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">
            العودة لتسجيل الدخول
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

export default ForgotPassword;
