import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser, logout } from "../utils/auth";
import { LogOut, Edit3, CheckSquare, List, Users } from "lucide-react";
import axios from "../api/axios";

function Profile() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [tasksCount, setTasksCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [groupsCount, setGroupsCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const fetchData = async () => {
      try {
        const tasksRes = await axios.get("/tasks");
        if (mounted && tasksRes.data?.data) {
          const tasks = tasksRes.data.data;
          setTasksCount(tasks.length);
          const completed = tasks.filter((t) => t.status === 2).length;
          setCompletedCount(completed);
        }

        const groupsRes = await axios.get("/groups/owned-groups");
        if (mounted && groupsRes.data?.data) {
          setGroupsCount(groupsRes.data.data.length);
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-600 dark:text-gray-300">
        لم يتم تسجيل الدخول.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-right bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg mt-8 relative min-h-[520px] pb-28">
      <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6">
        الملف الشخصي
      </h2>

      {/* الصورة: أول حرف فقط بدون أي تعديل */}
      <div className="flex justify-center mb-4">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {user.name.charAt(0)}
        </div>
      </div>

      {/* معلومات المستخدم */}
      <div className="mb-6 space-y-2 text-lg text-gray-700 dark:text-gray-300 text-center">
        <p>
          <strong>الاسم:</strong> {user.name}
        </p>
        <p>
          <strong>البريد:</strong> {user.email}
        </p>
      </div>

      <hr className="my-6 border-gray-300 dark:border-gray-700" />

      {/* الإحصائيات */}
      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
        إحصائيات
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow">
          <List className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-300">المهام</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            {tasksCount}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow">
          <CheckSquare className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
          <p className="text-gray-600 dark:text-gray-300">المكتملة</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            {completedCount}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow">
          <Users className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
          <p className="text-gray-600 dark:text-gray-300">المجموعات</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            {groupsCount}
          </p>
        </div>
      </div>

      {/* الأزرار */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition shadow"
        >
          <LogOut size={18} /> تسجيل الخروج
        </button>

        <Link
          to="/profile/edit"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition shadow"
        >
          <Edit3 size={18} /> تعديل الملف الشخصي
        </Link>
      </div>
    </div>
  );
}

export default Profile;
