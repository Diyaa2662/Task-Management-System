import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

function GroupDetails() {
  const { id } = useParams();

  const currentUserRole = "Owner";

  const group = {
    id,
    name: "فريق التصميم",
    members: [
      { name: "أحمد", role: "Owner" },
      { name: "سارة", role: "Admin" },
      { name: "خالد", role: "Manager" },
      { name: "مريم", role: "Assignee" },
    ],
    categories: ["تصميم واجهات", "تصميم شعارات"],
    tasks: [
      {
        id: 1,
        title: "تصميم صفحة تسجيل الدخول",
        category: "تصميم واجهات",
        status: "قيد التنفيذ",
      },
      {
        id: 2,
        title: "تصميم شعار جديد",
        category: "تصميم شعارات",
        status: "مكتملة",
      },
      {
        id: 3,
        title: "تحسين واجهة لوحة التحكم",
        category: "تصميم واجهات",
        status: "قيد التنفيذ",
      },
    ],
  };

  const [members, setMembers] = useState(group.members);
  const [categories, setCategories] = useState(group.categories);
  const [newCategory, setNewCategory] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    setCategories([...categories, newCategory.trim()]);
    setNewCategory("");
  };

  const handleDeleteCategory = (index) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الفئة؟")) {
      setCategories(categories.filter((_, i) => i !== index));
      if (filterCategory === categories[index]) {
        setFilterCategory("all");
      }
    }
  };

  const filteredTasks =
    filterCategory === "all"
      ? group.tasks
      : group.tasks.filter((task) => task.category === filterCategory);

  const handleDeleteMember = (index) => {
    if (window.confirm("هل أنت متأكد من حذف هذا العضو؟")) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleRoleChange = (index, newRole) => {
    const updated = members.map((m, i) =>
      i === index ? { ...m, role: newRole } : m
    );
    setMembers(updated);
  };

  return (
    <div className="max-w-4xl mx-auto text-right bg-white dark:bg-gray-800 p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        تفاصيل المجموعة: {group.name}
      </h2>

      {/* ✅ الأعضاء */}
      <div className="mb-8">
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
                {editingIndex === index ? (
                  member.role !== "Owner" ? (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(index, e.target.value)}
                      className="ml-2 p-1 border rounded dark:bg-gray-600 dark:text-white"
                    >
                      <option value="Admin">مدير المجموعة</option>
                      <option value="Manager">إداري المجموعة</option>
                      <option value="Assignee">مكلف</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-300 ml-2">
                      (مالك المجموعة)
                    </span>
                  )
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    ({translateRole(member.role)})
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/groups/${group.id}/members/${index}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  عرض
                </Link>
                {can(currentUserRole, "manageMembers") &&
                  member.role !== "Owner" && (
                    <>
                      {editingIndex === index ? (
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="text-sm text-green-600 hover:underline"
                        >
                          حفظ
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingIndex(index)}
                          className="text-sm text-indigo-400 hover:underline"
                        >
                          تغيير الدور
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMember(index)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        حذف
                      </button>
                    </>
                  )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ الفئات */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
          الفئات التنظيمية:
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="flex items-center bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-3 py-1 rounded"
            >
              <span>{cat}</span>
              {can(currentUserRole, "manageTasks") && (
                <button
                  onClick={() => handleDeleteCategory(idx)}
                  className="ml-2 text-red-600 hover:text-red-800"
                  title="حذف الفئة"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {can(currentUserRole, "manageTasks") && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="أدخل اسم الفئة"
              className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleAddCategory}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              إضافة فئة
            </button>
          </div>
        )}
      </div>

      {/* ✅ الفلتر */}
      <div className="mb-6 flex flex-wrap gap-2 justify-end items-center">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          فرز حسب الفئة:
        </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="all">كل المهام</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ المهام */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
          المهام:
        </h3>
        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex justify-between items-center"
            >
              <div>
                <span>{task.title}</span>
                <span className="text-xs ml-3 px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded">
                  {task.category}
                </span>
              </div>
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
