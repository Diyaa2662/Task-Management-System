import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ isOpen, onToggleTheme, darkMode }) {
  return (
    <div
      className={`fixed top-16 right-0 h-full bg-white dark:bg-gray-800 shadow-lg border-l z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } w-64 text-gray-800 dark:text-white`}
    >
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400 text-center">
            القائمة
          </h2>
          <nav className="flex flex-col gap-3 text-right">
            <Link to="/dashboard" className="hover:text-blue-600">
              لوحة التحكم
            </Link>
            <Link to="/tasks" className="hover:text-blue-600">
              المهام
            </Link>
            <Link to="/groups" className="hover:text-blue-600">
              المجموعات
            </Link>
            <Link to="/categories" className="hover:text-blue-600">
              الفئات
            </Link>
            <Link to="/profile" className="hover:text-blue-600">
              الملف الشخصي
            </Link>
          </nav>
        </div>

        {/* زر تغيير الثيم */}
        <button
          onClick={onToggleTheme}
          className="mt-6 text-xl hover:scale-110 transition self-center"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
