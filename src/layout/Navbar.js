import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser, logout } from "../utils/auth";

function Navbar({ onToggleSidebar, onToggleTheme, darkMode }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [notifications, setNotifications] = React.useState([
    { id: 1, message: "تمت دعوتك للانضمام إلى مجموعة فريق التصميم" },
    { id: 2, message: "تمت إضافتك إلى مجموعة فريق البرمجة" },
  ]);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleAccept = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    alert("✅ تم قبول الدعوة (لاحقًا سيتم الربط مع API)");
  };

  const handleReject = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    alert("❌ تم رفض الدعوة");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ✅ يغلق قائمة الإشعارات عند الضغط خارجها
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".notification-dropdown")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow px-6 py-4 flex justify-between items-center fixed top-0 right-0 left-0 z-50">
      {/* يمين: زر القائمة واسم الموقع */}
      <div className="flex items-center gap-8">
        <button
          onClick={onToggleSidebar}
          className="text-2xl hover:text-blue-600"
        >
          ☰
        </button>

        <Link
          to="/dashboard"
          className="text-2xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400"
        >
          TaskFlow
        </Link>

        <div className="hidden sm:flex gap-6">
          <Link
            to="/tasks"
            className="text-lg font-bold text-blue-600 dark:text-blue-400"
          >
            المهام
          </Link>
          <Link
            to="/groups"
            className="text-lg font-bold text-blue-600 dark:text-blue-400"
          >
            المجموعات
          </Link>
        </div>
      </div>

      {/* يسار: الإعدادات والملف الشخصي */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={onToggleTheme}
          className="text-xl hover:scale-110 transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {user && (
          <span className="hidden sm:inline bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium text-gray-800 dark:text-white">
            {user.name}
          </span>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="hidden sm:inline bg-red-300 dark:bg-red-600 text-white px-3 py-1 rounded-full shadow-sm hover:bg-red-700 transition text-sm"
          >
            تسجيل الخروج
          </button>
        )}

        {/* ✅ أيقونة الإشعارات وقائمة منسدلة */}
        <div className="relative notification-dropdown">
          <button onClick={() => setIsOpen(!isOpen)} className="relative">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded p-4 z-50 text-right">
              <h4 className="text-sm font-bold mb-3 text-gray-800 dark:text-white">
                الإشعارات
              </h4>
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  لا توجد إشعارات حالياً.
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="mb-3 p-2 bg-gray-100 dark:bg-gray-700 rounded"
                  >
                    <p
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/notifications");
                      }}
                      className="text-sm mb-2 text-gray-800 dark:text-white cursor-pointer hover:underline"
                    >
                      {n.message}
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleAccept(n.id)}
                        className="text-green-600 hover:underline text-sm"
                      >
                        قبول
                      </button>
                      <button
                        onClick={() => handleReject(n.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        رفض
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* أيقونة الملف الشخصي */}
        <Link to="/profile" title="الملف الشخصي">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-9 h-9 text-gray-700 dark:text-white hover:text-blue-600 transition"
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
    </header>
  );
}

export default Navbar;
