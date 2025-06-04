import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Navbar({ onToggleSidebar, onToggleTheme, darkMode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // يمكن لاحقًا حذف التوكنات أو البيانات من localStorage هنا
    navigate("/");
  };

  return (
    <header className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow px-6 py-4 flex justify-between items-center fixed top-0 right-0 left-0 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-2xl hover:text-blue-600"
        >
          ☰
        </button>
        <Link
          to="/dashboard"
          className="text-xl font-bold text-blue-600 dark:text-blue-400"
        >
          TaskFlow
        </Link>
        <Link to="/profile" title="الملف الشخصي">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-700 dark:text-white hover:text-blue-600 transition"
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
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleTheme}
          className="text-xl hover:scale-110 transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <span className="text-sm hidden md:inline">مرحبًا، المستخدم</span>

        <button onClick={handleLogout} className="text-sm hover:text-red-600">
          تسجيل الخروج
        </button>
      </div>
    </header>
  );
}

export default Navbar;
