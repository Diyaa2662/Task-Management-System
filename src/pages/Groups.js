import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { getToken } from "../utils/auth";

function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewType, setViewType] = useState("owned"); // owned | joined

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewType]);

  const fetchGroups = async () => {
    setLoading(true);
    setError("");

    try {
      const endpoint =
        viewType === "owned" ? "/groups/owned-groups" : "/groups/joined-groups";

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (res.data && Array.isArray(res.data.data)) {
        setGroups(res.data.data);
      } else if (Array.isArray(res.data)) {
        setGroups(res.data);
      } else {
        setGroups([]);
      }
    } catch (err) {
      console.error("❌ فشل جلب المجموعات:", err.response?.data || err.message);
      setError("فشل جلب المجموعات.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ حذف مجموعة (GET /groups/{id}/delete)
  const handleDelete = async (groupId, e) => {
    e.stopPropagation(); // لمنع التنقّل لصفحة التفاصيل
    if (!window.confirm("هل أنت متأكد من حذف هذه المجموعة؟")) return;

    try {
      await axios.get(`/groups/${groupId}/delete`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      // حدّث الواجهة مباشرة بدون إعادة الجلب
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    } catch (err) {
      console.error("❌ فشل حذف المجموعة:", err.response?.data || err.message);
      alert("فشل حذف المجموعة.");
    }
  };

  return (
    <div className="text-right">
      {/* ✅ السويتش */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setViewType("owned")}
            className={`px-4 py-2 rounded ${
              viewType === "owned"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
            }`}
          >
            المجموعات التي أنشأتها
          </button>
          <button
            onClick={() => setViewType("joined")}
            className={`px-4 py-2 rounded ${
              viewType === "joined"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
            }`}
          >
            المجموعات التي أشارك بها
          </button>
        </div>

        {viewType === "owned" && (
          <button
            onClick={() => navigate("/groups/new")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + إضافة مجموعة
          </button>
        )}
      </div>

      {/* ✅ عرض البيانات */}
      {loading && <p className="text-center text-gray-500">جاري التحميل...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && groups.length === 0 && (
        <p className="text-center text-gray-500">لا توجد مجموعات حالياً.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            onClick={() => navigate(`/groups/${group.id}`)}
            className="relative cursor-pointer p-4 bg-white dark:bg-gray-800 border rounded shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">
              {group.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {group.description || "بدون وصف"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              👥 عدد الأعضاء: {group.members_count || 0}
            </p>

            {/* ✅ زر الحذف أسفل يسار الكرت — يظهر فقط في المجموعات التي أنشأتها */}
            {viewType === "owned" && (
              <button
                onClick={(e) => handleDelete(group.id, e)}
                className="absolute bottom-3 left-3 bg-red-600 text-white text-sm px-3 py-1.5 rounded hover:bg-red-700 transition"
              >
                حذف المجموعة
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Groups;
