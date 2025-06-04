import React from "react";
import { useParams, Link } from "react-router-dom";

function MemberDetails() {
  const { id, memberId } = useParams();

  // بيانات وهمية مؤقتة
  const member = {
    id: memberId,
    name: "أحمد محمد",
    email: "ahmed@example.com",
    tasks: [
      { id: 1, title: "تصميم الصفحة الرئيسية", status: "قيد التنفيذ" },
      { id: 2, title: "تحديث الشعار", status: "مكتملة" },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto text-right bg-white dark:bg-gray-800 p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        تفاصيل العضو
      </h2>

      <div className="space-y-3 text-gray-700 dark:text-gray-200 mb-6">
        <p>
          <span className="font-semibold">الاسم:</span> {member.name}
        </p>
        <p>
          <span className="font-semibold">البريد الإلكتروني:</span>{" "}
          {member.email}
        </p>
      </div>

      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
        المهام:
      </h3>
      <ul className="space-y-2 mb-6">
        {member.tasks.map((task) => (
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

      <div className="text-center">
        <Link
          to={`/groups/${id}`}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
        >
          العودة إلى المجموعة
        </Link>
      </div>
    </div>
  );
}

export default MemberDetails;
