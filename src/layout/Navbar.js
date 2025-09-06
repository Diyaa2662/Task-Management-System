import React from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { getCurrentUser, getToken, logout } from "../utils/auth";
import { Menu, User, LogOut, Bell } from "lucide-react";
import { useToast } from "../components/ToastProvider";
import ConfirmModal from "../components/ConfirmModal";

function Navbar({ onToggleSidebar, onToggleTheme, darkMode }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = getCurrentUser();

  const [notifications, setNotifications] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false); // ✅ مودال التأكيد

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/group-members/get-invitations", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        const data = res.data?.data ?? [];
        const mapped = data.map((inv) => ({
          id: inv.id,
          message: `تمت دعوتك للانضمام إلى مجموعة ID: ${inv.group_id}`,
          role: inv.role,
        }));
        setNotifications(mapped);
      } catch (err) {
        console.error(
          "فشل تحميل الإشعارات:",
          err.response?.data || err.message
        );
      }
    };
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    logout();
    showToast("👋 تم تسجيل الخروج بنجاح", "success");
    navigate("/");
  };

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
          <Menu size={28} />
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
            onClick={() => setConfirmOpen(true)} // ✅ فتح المودال بدل تسجيل الخروج مباشرة
            className="sm:inline bg-red-300 dark:bg-red-600 text-white px-5 py-1 rounded-full shadow-sm hover:bg-red-700 transition text-sm flex items-center gap-1"
          >
            <LogOut size={16} />
          </button>
        )}

        {/* الإشعارات */}
        <div className="relative notification-dropdown">
          <button onClick={() => setIsOpen(!isOpen)} className="relative">
            <Bell
              size={20}
              className="text-gray-700 dark:text-white hover:text-blue-600 transition"
            />
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
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/notifications");
                    }}
                    className="mb-3 p-2 bg-gray-100 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <p className="text-sm text-gray-800 dark:text-white">
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* الملف الشخصي */}
        <Link to="/profile" title="الملف الشخصي">
          <User
            size={28}
            className="text-gray-700 dark:text-white hover:text-blue-600 transition"
          />
        </Link>
      </div>

      {/* ✅ مودال التأكيد */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="تأكيد تسجيل الخروج"
        message="هل أنت متأكد أنك تريد تسجيل الخروج؟"
        onConfirm={handleLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </header>
  );
}

export default Navbar;
