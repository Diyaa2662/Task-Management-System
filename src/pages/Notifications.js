import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { getToken } from "../utils/auth";

function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // جلب الدعوات
  const fetchInvitations = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await axios.get("/group-members/get-invitations", {
        headers: { Authorization: `Bearer ${getToken()}` },
      }); // :contentReference[oaicite:2]{index=2}

      // حاول ندخل على أماكن شائعة للبيانات (data.data | data | [])
      const payload = res.data?.data ?? res.data ?? [];
      const list = Array.isArray(payload) ? payload : payload.invitations ?? [];

      setItems(list);
    } catch (e) {
      console.error("فشل جلب الدعوات:", e.response?.data || e.message);
      setErr(e.response?.data?.message || "فشل جلب الدعوات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const roleLabel = (r) => {
    // يدعم رقم أو نص
    if (typeof r === "number") {
      switch (r) {
        case 0:
          return "مدير المجموعة";
        case 1:
          return "مكلّف";
        case 2:
          return "إداري المجموعة";
        case 3:
          return "قارئ";
        default:
          return `دور #${r}`;
      }
    }
    // نصوص محتملة من الباك
    if (!r) return "دور غير محدد";
    const v = String(r).toLowerCase();
    if (v.includes("admin")) return "مدير المجموعة";
    if (v.includes("manager")) return "إداري المجموعة";
    if (v.includes("assignee")) return "مكلّف";
    return r;
  };

  const getGroupName = (inv) =>
    inv.group?.name ||
    inv.group?.title ||
    inv.group_name ||
    inv.group_title ||
    (inv.group_id ? `مجموعة #${inv.group_id}` : "مجموعة غير معروفة");

  const getInviterName = (inv) =>
    inv.inviter?.name ||
    inv.sender?.name ||
    inv.inviter_name ||
    inv.sender_name ||
    "مرسل غير معروف";

  // قبول/رفض الدعوة
  const answerInvitation = async (invitationId, acceptValue) => {
    try {
      const form = new FormData();
      form.append("accept", String(acceptValue)); // لازم form-data بالحقل accept = 1/0 :contentReference[oaicite:3]{index=3}
      await axios.post(`/group-members/${invitationId}/answer`, form, {
        headers: { Authorization: `Bearer ${getToken()}` },
      }); // :contentReference[oaicite:4]{index=4}

      // شيل الدعوة من اللستة
      setItems((prev) =>
        prev.filter((x) => String(x.id) !== String(invitationId))
      );
    } catch (e) {
      console.error("خطأ بالقبول/الرفض:", e.response?.data || e.message);
      alert(e.response?.data?.message || "حدث خطأ أثناء معالجة الدعوة");
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
          {items.map((inv) => {
            const groupName = getGroupName(inv);
            const inviterName = getInviterName(inv);
            const invId = inv.id ?? inv.invitation_id ?? inv.group_member_id; // يدعم تسميات ID مختلفة
            const r = roleLabel(inv.role);

            return (
              <li
                key={invId}
                className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow-sm"
              >
                <p className="text-sm text-gray-800 dark:text-white mb-1">
                  دعوة للانضمام إلى{" "}
                  <span className="font-semibold">{groupName}</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                  من: <span className="font-medium">{inviterName}</span> — الدور
                  المقترح: <span className="font-medium">{r}</span>
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => answerInvitation(invId, 1)}
                    className="text-sm text-green-600 hover:underline"
                  >
                    قبول
                  </button>
                  <button
                    onClick={() => answerInvitation(invId, 0)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    رفض
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
