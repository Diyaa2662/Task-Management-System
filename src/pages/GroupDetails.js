import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

function GroupDetails() {
  const { id } = useParams();

  // ✅ الدور الحالي للمستخدم داخل المجموعة (لاحقًا من backend)
  const currentUserRole = "Owner"; // مثال: "Admin", "Manager", "Assignee"

  // ✅ بيانات وهمية للمجموعة
  const group = {
    id,
    name: "فريق التصميم",
    members: [
      { name: "أحمد", role: "Owner" },
      { name: "سارة", role: "Admin" },
      { name: "مريم", role: "Assignee" },
    ],
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

      {/* ✅ الأعضاء */}
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
              <div>
                <span className="font-semibold">{member.name}</span>{" "}
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  ({translateRole(member.role)})
                </span>
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/groups/${group.id}/members/${index}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  عرض
                </Link>
                {can(currentUserRole, "manageMembers") && (
                  <button
                    onClick={() => handleDeleteMember(index)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    حذف
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ المهام */}
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

      {/* ✅ الأزرار */}
      <div className="flex flex-wrap gap-3 justify-between mt-6">
        {can(currentUserRole, "manageTasks") && (
          <Link
            to={`/groups/${group.id}/add-task`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + إضافة مهمة
          </Link>
        )}

        {can(currentUserRole, "manageMembers") && (
          <Link
            to={`/groups/${group.id}/add-member`}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + إضافة عضو
          </Link>
        )}

        {can(currentUserRole, "editGroup") && (
          <Link
            to={`/groups/${group.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            تعديل المجموعة
          </Link>
        )}

        {can(currentUserRole, "deleteGroup") && (
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
        )}

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

// ✅ دالة ترجمة الدور
function translateRole(role) {
  switch (role) {
    case "Owner":
      return "مالك المجموعة";
    case "Admin":
      return "مدير المجموعة";
    case "Manager":
      return "إداري المجموعة";
    case "Assignee":
      return "مكلف";
    default:
      return role;
  }
}

// ✅ دالة صلاحيات حسب الدور
function can(role, action) {
  const permissions = {
    Owner: ["manageMembers", "manageTasks", "deleteGroup", "editGroup"],
    Admin: ["manageMembers", "manageTasks"],
    Manager: ["manageTasks"],
    Assignee: [],
  };
  return permissions[role]?.includes(action);
}

export default GroupDetails;
