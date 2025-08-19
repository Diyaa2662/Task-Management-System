import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axios";
import { getToken } from "../utils/auth";
import { X } from "lucide-react";

function GroupDetails() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const currentUserRole = "Owner"; // مؤقتاً، حتى تجيبها من API المستخدم

  // دالة جلب بيانات المجموعة
  const fetchGroupDetails = async () => {
    try {
      const res = await axios.get(`/groups/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const groupData = res.data.data; // <-- التعديل هنا

      setGroup(groupData);
      setMembers(groupData.members || []);
      setCategories(groupData.categories || []);
      setTasks(groupData.tasks || []);
    } catch (err) {
      console.error(
        "فشل تحميل بيانات المجموعة:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // إضافة فئة جديدة
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post(`/groups/${id}/add-category`, {
        title: newCategory.trim(),
        color: "#000000", // مؤقتاً، ممكن تضيف اختيار لون لاحقاً
      });
      setCategories([
        ...categories,
        { title: newCategory.trim(), color: "#000000" },
      ]); // <-- تعديل هنا
      setNewCategory("");
    } catch (err) {
      console.error("فشل إضافة الفئة:", err);
    }
  };

  // حذف عضو
  const handleDeleteMember = async (memberId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا العضو؟")) return;
    try {
      await axios.post(`/groups/${id}/remove-member`, { user_id: memberId });
      setMembers(members.filter((m) => m.id !== memberId));
    } catch (err) {
      console.error("فشل حذف العضو:", err);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-6">جاري التحميل...</p>;
  }

  if (!group) {
    return (
      <p className="text-center mt-6 text-red-500">
        لم يتم العثور على المجموعة.
      </p>
    );
  }

  const filteredTasks =
    filterCategory === "all"
      ? tasks
      : tasks.filter((task) => task.category === filterCategory);

  return (
    <div className="max-w-4xl mx-auto text-right bg-white dark:bg-gray-800 p-6 rounded shadow mt-6">
      {/* العنوان وزر العودة */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          تفاصيل المجموعة: {group.name}
        </h2>
        <Link
          to="/groups"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          title="العودة إلى المجموعات"
        >
          ←
        </Link>
      </div>

      {/* الأعضاء */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
          الأعضاء:
        </h3>
        <ul className="space-y-2">
          {members.map((member) => (
            <li
              key={member.id}
              className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex justify-between items-center"
            >
              <div>
                <span className="font-semibold">{member.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-300 ml-2">
                  ({translateRole(member.role)})
                </span>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/groups/${group.id}/members/${member.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  عرض
                </Link>
                {can(currentUserRole, "manageMembers") &&
                  member.role !== "Owner" && (
                    <>
                      <button
                        onClick={() =>
                          alert("تغيير الدور يحتاج endpoint جديد في الـ API")
                        }
                        className="text-sm text-indigo-400 hover:underline"
                      >
                        تغيير الدور
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
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

        {/* زر إضافة عضو */}
        {can(currentUserRole, "manageMembers") && (
          <div className="mt-4">
            <Link
              to={`/groups/${group.id}/add-member`}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition inline-block"
            >
              + إضافة عضو
            </Link>
          </div>
        )}
      </div>

      {/* الفئات */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
          الفئات التنظيمية:
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="relative group flex items-center bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-3 py-1 rounded"
            >
              <span>{cat.title}</span>
              {/* زر الحذف يظهر فقط عند الهوفر */}
              <button
                onClick={async () => {
                  if (!window.confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;
                  try {
                    await axios.get(`/categories/${cat.id}/delete`, {
                      headers: { Authorization: `Bearer ${getToken()}` },
                    });
                    setCategories(categories.filter((c) => c.id !== cat.id));
                  } catch (err) {
                    console.error("فشل حذف الفئة:", err);
                  }
                }}
                className="absolute -top-2 -left-2 hidden group-hover:flex bg-red-600 text-white rounded-full w-5 h-5 items-center justify-center hover:bg-red-700"
                title="حذف الفئة"
              >
                <X size={12} />
              </button>
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

      {/* الفلتر */}
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
            <option key={idx} value={cat.title}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      {/* المهام */}
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

      {/* الأزرار */}
      <div className="flex flex-wrap gap-3 justify-between mt-6">
        {can(currentUserRole, "manageTasks") && (
          <Link
            to={`/groups/${group.id}/add-task`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + إضافة مهمة
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
                axios
                  .get(`/groups/${group.id}/delete`)
                  .then(() => alert("تم حذف المجموعة"))
                  .catch((err) => console.error("فشل حذف المجموعة:", err));
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            حذف المجموعة
          </button>
        )}
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
