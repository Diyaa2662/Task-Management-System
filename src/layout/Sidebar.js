import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ isOpen }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { path: "/dashboard", label: "لوحة التحكم" },
    { path: "/tasks", label: "المهام" },
    { path: "/groups", label: "المجموعات" },
    { path: "/notifications", label: "الإشعارات" }, // ✅ الإضافة الجديدة
    { path: "/profile", label: "الملف الشخصي" },
  ];

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
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`border rounded px-4 py-2 transition-colors
                  ${
                    currentPath === link.path
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
