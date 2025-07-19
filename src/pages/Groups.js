import React from "react";
import { useNavigate } from "react-router-dom";

function Groups() {
  const navigate = useNavigate();

  // بيانات وهمية مقسمة لقسمين
  const myGroups = [
    {
      id: 1,
      name: "فريق التصميم",
      description: "تصميم واجهات الموقع",
      members: 4,
    },
    {
      id: 2,
      name: "فريق البرمجة",
      description: "تطوير الواجهة الخلفية",
      members: 6,
    },
    { id: 3, name: "فريق التسويق", description: "حملات إعلانية", members: 3 },
    { id: 4, name: "فريق المحتوى", description: "كتابة مقالات", members: 5 },
    { id: 5, name: "فريق الجودة", description: "اختبار النظام", members: 2 },
    { id: 6, name: "فريق البيانات", description: "تحليل البيانات", members: 7 },
  ];

  const joinedGroups = [
    { id: 7, name: "فريق الدعم", description: "مساعدة العملاء", members: 4 },
    { id: 8, name: "فريق الترجمة", description: "ترجمة المحتوى", members: 3 },
    { id: 9, name: "فريق التوثيق", description: "توثيق النظام", members: 2 },
    { id: 10, name: "فريق البحث", description: "دراسة المستخدم", members: 6 },
    { id: 11, name: "فريق الحماية", description: "تأمين التطبيق", members: 4 },
    { id: 12, name: "فريق التوزيع", description: "تنظيم المهام", members: 5 },
  ];

  // مكون لعرض قسم
  const GroupSection = ({ title, groups, showAddButton }) => (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>
        {showAddButton && (
          <button
            onClick={() => navigate("/groups/new")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + إضافة مجموعة
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            onClick={() => navigate(`/groups/${group.id}`)}
            className="cursor-pointer p-4 bg-white dark:bg-gray-800 border rounded shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">
              {group.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {group.description}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              👥 عدد الأعضاء: {group.members}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="text-right">
      <GroupSection
        title="المجموعات التي أنشأتها"
        groups={myGroups}
        showAddButton={true}
      />
      <GroupSection
        title="المجموعات التي أشارك بها"
        groups={joinedGroups}
        showAddButton={false}
      />
    </div>
  );
}

export default Groups;
