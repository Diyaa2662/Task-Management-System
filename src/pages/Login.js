import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // ✅ القراءة من localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark";
  });

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // ✅ تطبيق كلاس الثيم على <html>
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkMode]);

  // محاكاة تسجيل الدخول والانتقال إلى لوحة التحكم
  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 transition-colors">
      {/* زر الثيم في الأعلى */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 left-4 text-2xl hover:scale-110 transition"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">تسجيل الدخول</h2>

        <form className="space-y-4" onSubmit={handleLogin}>
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

          <div className="text-left mt-1">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              هل نسيت كلمة المرور؟
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            تسجيل الدخول
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          ليس لديك حساب؟{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            أنشئ حسابًا
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

export default Login;
