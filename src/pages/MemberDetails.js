import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axios";
import { getToken } from "../utils/auth";
import { User, Mail, Star, ArrowLeft } from "lucide-react"; // أيقونات

function MemberDetails() {
  const { id, memberId } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMember = async () => {
    try {
      const res = await axios.get(`/groups/${id}/members`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const payload = res.data?.data ?? res.data ?? {};
      const ownerData = payload.owner || null;
      const memberList = Array.isArray(payload.members) ? payload.members : [];

      const allMembers = [
        ...(ownerData ? [{ ...ownerData, isOwner: true }] : []),
        ...memberList.map((m) => ({ ...m, isOwner: false })),
      ];

      const found = allMembers.find((m) => String(m.id) === String(memberId));
      setMember(found || null);
    } catch (err) {
      console.error(
        "فشل تحميل بيانات العضو:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, memberId]);

  if (loading)
    return <p className="text-center text-gray-500 mt-6">جاري التحميل...</p>;

  if (!member)
    return (
      <p className="text-center mt-6 text-red-500">لم يتم العثور على العضو.</p>
    );

  return (
    <div className="max-w-3xl mx-auto text-right bg-white dark:bg-gray-800 p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <User size={24} /> تفاصيل العضو
      </h2>

      <div className="space-y-3 text-gray-700 dark:text-gray-200 mb-6">
        <p className="flex items-center gap-2">
          <User size={16} className="text-blue-600 dark:text-blue-400" />
          <span className="font-semibold">الاسم:</span> {member.name}
        </p>
        <p className="flex items-center gap-2">
          <Mail size={16} className="text-green-600 dark:text-green-400" />
          <span className="font-semibold">البريد الإلكتروني:</span>{" "}
          {member.email}
        </p>
        {member.isOwner && (
          <p className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <Star size={16} /> هذا العضو هو مالك المجموعة
          </p>
        )}
      </div>

      <div className="text-center">
        <Link
          to={`/groups/${id}`}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} /> العودة إلى المجموعة
        </Link>
      </div>
    </div>
  );
}

export default MemberDetails;
