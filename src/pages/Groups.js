import React, { useState } from "react";
import { Link } from "react-router-dom";

function Groups() {
  // ✅ بيانات وهمية + تخزينها في حالة قابلة للتعديل
  const [groups, setGroups] = useState([
    { id: 1, name: "فريق التصميم", members: 4 },
    { id: 2, name: "فريق البرمجة", members: 6 },
    { id: 3, name: "فريق التسويق", members: 3 },
  ]);

  // ✅ دالة الحذف
  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه المجموعة؟")) {
      const updated = groups.filter((group) => group.id !== id);
      setGroups(updated);
    }
  };

  return (
    <div className="text-right">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          المجموعات
        </h2>
        <Link
          to="/groups/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + إضافة مجموعة
        </Link>
      </div>

      <div className="grid gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="p-4 bg-white dark:bg-gray-800 border rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {group.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                عدد الأعضاء: {group.members}
              </p>
            </div>

            <div className="flex gap-2">
              {/* زر عرض التفاصيل */}
              <Link
                to={`/groups/${group.id}`}
                className="text-sm text-blue-500 hover:underline"
              >
                عرض
              </Link>

              {/* زر تعديل */}
              <Link
                to={`/groups/${group.id}/edit`}
                className="text-sm text-blue-600 hover:underline"
              >
                تعديل
              </Link>

              {/* زر حذف */}
              <button
                onClick={() => handleDelete(group.id)}
                className="text-sm text-red-600 hover:underline"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Groups;
