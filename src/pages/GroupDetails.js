import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

function GroupDetails() {
  const { id } = useParams();

  // بيانات وهمية مؤقتة
  const group = {
    id,
    name: "فريق التصميم",
    members: ["أحمد", "سارة", "مريم"],
    tasks: [
      { id: 1, title: "تصميم صفحة تسجيل الدخول", status: "قيد التنفيذ" },
      { id: 2, title: "تحسين واجهة لوحة التحكم", status: "مكتملة" },
    ],
  };

  const [members, setMembers] = useState(group.members);

  const handleDeleteMember = (index) => {
    if (window.confirm("هل أنت متأكد من حذف هذا العضو؟")) {
      const updated = members.filter((_, i) => i !== index);
      setMembers(updated);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-right bg-white dark:bg-gray-800 p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        تفاصيل المجموعة: {group.name}
      </h2>

      {/* الأعضاء */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
          الأعضاء:
        </h3>
        <ul className="space-y-2">
          {members.map((member, index) => (
            <li
              key={index}
              className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex justify-between items-center"
            >
              <span>{member}</span>
              <div className="flex gap-3">
                <Link
                  to={`/groups/${group.id}/members/${index}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  عرض
                </Link>
                <button
                  onClick={() => handleDeleteMember(index)}
                  className="text-sm text-red-600 hover:underline"
                >
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* المهام */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
          المهام:
        </h3>
        <ul className="space-y-2">
          {group.tasks.map((task) => (
            <li
              key={task.id}
              className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex justify-between items-center"
            >
              <span>{task.title}</span>
              <span className="text-sm px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded">
                {task.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* الأزرار */}
      <div className="flex justify-between mt-6">
        <Link
          to={`/groups/${group.id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          تعديل المجموعة
        </Link>

        <Link
          to={`/groups/${group.id}/add-member`}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + إضافة عضو
        </Link>

        <button
          onClick={() => {
            if (window.confirm("هل أنت متأكد من حذف هذه المجموعة؟")) {
              alert("تم حذف المجموعة (لاحقًا يتم الربط مع قاعدة البيانات)");
            }
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          حذف المجموعة
        </button>
        <Link
          to="/groups"
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
        >
          العودة إلى المجموعات
        </Link>
      </div>
    </div>
  );
}

export default GroupDetails;
