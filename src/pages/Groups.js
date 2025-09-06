import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { getToken } from "../utils/auth";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "../components/ToastProvider";
import ConfirmModal from "../components/ConfirmModal";

function Groups() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewType, setViewType] = useState("owned"); // owned | joined

  // ✅ لحالة الموديل
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

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
      showToast("❌ فشل جلب المجموعات", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (groupId, e) => {
    e.stopPropagation();

    setConfirmModal({
      isOpen: true,
      title: "تأكيد الحذف",
      message: "هل أنت متأكد أنك تريد حذف هذه المجموعة؟",
      onConfirm: async () => {
        try {
          await axios.get(`/groups/${groupId}/delete`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          });
          setGroups((prev) => prev.filter((g) => g.id !== groupId));
          showToast("✅ تم حذف المجموعة بنجاح", "success");
        } catch (err) {
          console.error(
            "❌ فشل حذف المجموعة:",
            err.response?.data || err.message
          );
          showToast("❌ فشل حذف المجموعة", "error");
        } finally {
          setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: null,
          });
        }
      },
    });
  };

  return (
    <div className="text-right">
      {/* السويتش */}
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
      </div>

      {/* عرض البيانات */}
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
            className="relative cursor-pointer p-4 bg-white dark:bg-gray-800 border rounded shadow hover:shadow-lg transition flex flex-col justify-between"
          >
            {/* الاسم والوصف */}
            <div>
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">
                {group.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {group.description || "بدون وصف"}
              </p>
            </div>

            {/* الأزرار تظهر فقط للمالك */}
            {viewType === "owned" && (
              <div className="flex justify-between mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/groups/${group.id}/edit`);
                  }}
                  className="flex items-center gap-1 bg-blue-600 text-white text-sm px-10 py-1.5 rounded hover:bg-blue-700 transition"
                >
                  <Edit className="w-4 h-4" /> تعديل
                </button>

                <button
                  onClick={(e) => handleDelete(group.id, e)}
                  className="flex items-center gap-1 bg-red-600 text-white text-sm px-10 py-1.5 rounded hover:bg-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" /> حذف
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* زر اضافة مجموعة */}
      <div className="mt-8">
        {viewType === "owned" && (
          <button
            onClick={() => navigate("/groups/new")}
            className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <PlusCircle className="w-5 h-5" /> إضافة مجموعة
          </button>
        )}
      </div>

      {/* موديل التأكيد */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() =>
          setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: null,
          })
        }
      />
    </div>
  );
}

export default Groups;
