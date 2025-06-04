import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
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

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-colors">
      {/* Header */}
      <header className="p-6 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          TaskFlow
        </h1>

        <div className="flex items-center gap-4">
          {/* زر تغيير الثيم */}
          <button
            onClick={toggleTheme}
            className="text-xl hover:scale-110 transition"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <Link
            to="/login"
            className="text-sm text-blue-600 px-4 py-2 border rounded-md hover:bg-blue-50 dark:border-blue-600 dark:text-blue-600"
          >
            تسجيل الدخول
          </Link>
          <Link
            to="/register"
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            إنشاء حساب
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">نظّم مهامك وفرقك بسهولة</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            TaskFlow يساعدك على تنظيم المهام اليومية، متابعة حالة تنفيذها،
            والتعاون مع فريقك بكفاءة.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              ابدأ الآن
            </Link>
            <Link
              to="/login"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 text-center text-sm text-gray-500 dark:text-gray-400 p-4">
        &copy; {new Date().getFullYear()} TaskFlow. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}

export default Home;
