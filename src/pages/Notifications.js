import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { getToken } from "../utils/auth";
import { useToast } from "../components/ToastProvider";
import { CheckCircle, XCircle, MailOpen, Trash2 } from "lucide-react";

function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const { showToast } = useToast();

  const roleLabel = (r) => {
    switch (Number(r)) {
      case 0:
        return "مدير المجموعة";
      case 1:
        return "مكلف";
      case 2:
        return "إداري المجموعة";
      default:
        return `دور #${r}`;
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await axios.get("/notifications?page=1&perPage=15&only=all", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const list = res.data?.data?.data ?? [];
      setItems(list);
    } catch (e) {
      const msg = e.response?.data?.message || "فشل جلب الإشعارات";
      setErr(msg);
      showToast(`❌ ${msg}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.get(`/notifications/${id}/mark-as-read`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setItems((prev) =>
        prev.map((n) =>
          String(n.id) === String(id) ? { ...n, is_read: true } : n
        )
      );
      showToast("✅ تم تعليم الإشعار كمقروء", "success");
    } catch (e) {
      const msg = e.response?.data?.message || "خطأ عند تعليم الإشعار";
      showToast(`❌ ${msg}`, "error");
    }
  };

  const answerInvitation = async (notification, acceptValue) => {
    try {
      const invitationId = notification.data?.invitation_id;
      if (!invitationId) {
        showToast("❌ لم يتم العثور على رقم الدعوة", "error");
        return;
      }

      const form = new FormData();
      form.append("accept", String(acceptValue));

      await axios.post(`/group-members/${invitationId}/answer`, form, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      showToast(
        acceptValue ? "✅ تم قبول الدعوة بنجاح" : "❌ تم رفض الدعوة",
        acceptValue ? "success" : "info"
      );
    } catch (e) {
      const msg = e.response?.data?.message || "خطأ أثناء معالجة الدعوة";
      showToast(`❌ ${msg}`, "error");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.get(`/notifications/${id}/delete`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setItems((prev) => prev.filter((n) => String(n.id) !== String(id)));
      showToast("🗑️ تم حذف الإشعار بنجاح", "success");
    } catch (e) {
      const msg = e.response?.data?.message || "خطأ أثناء حذف الإشعار";
      showToast(`❌ ${msg}`, "error");
    }
  };

  if (loading)
    return (
      <div className="max-w-2xl mx-auto mt-24 p-6 text-center text-gray-500">
        جاري التحميل…
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-24 p-6 bg-white dark:bg-gray-800 rounded shadow text-right">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        الإشعارات
      </h1>

      {err && <p className="text-sm text-red-600 mb-4">{err}</p>}

      {!items || items.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          لا توجد إشعارات حالياً.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((n) => (
            <li
              key={n.id}
              className={`p-4 rounded shadow-sm ${
                n.is_read
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "bg-blue-300 dark:bg-blue-600"
              }`}
            >
              {/* العنوان */}
              <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                {n.title}
              </p>

              {/* المحتوى + الدور */}
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                {n.content}
                {n.data?.role !== undefined && (
                  <>
                    {" بدور "}
                    <span className="font-medium">
                      {roleLabel(n.data.role)}
                    </span>
                  </>
                )}
              </p>

              {/* الأزرار تحت الإشعار */}
              <div className="flex justify-between items-center border-t pt-3 mt-3 border-gray-300 dark:border-gray-600">
                {/* يسار: القبول/الرفض أو الحذف */}
                <div className="flex gap-2">
                  <>
                    <button
                      onClick={() => answerInvitation(n, 1)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700 transition"
                    >
                      <CheckCircle size={16} /> قبول
                    </button>
                    <button
                      onClick={() => answerInvitation(n, 0)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700 transition"
                    >
                      <XCircle size={16} /> رفض
                    </button>
                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700 transition"
                    >
                      <Trash2 size={16} /> حذف
                    </button>
                  </>
                </div>

                {/* يمين: تعليم كمقروء */}
                {!n.is_read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700 transition"
                  >
                    <MailOpen size={16} /> تعليم كمقروء
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
