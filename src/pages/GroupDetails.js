import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { getToken, getCurrentUser } from "../utils/auth";
import { X } from "lucide-react";

function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [owner, setOwner] = useState(null);
  const [members, setMembers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();

  // --- Helpers ---
  const mapRoleNumberToKey = (num) => {
    switch (Number(num)) {
      case 0:
        return "Admin";
      case 1:
        return "Assignee";
      case 2:
        return "Manager";
      case 3:
        return "Viewer";
      default:
        return "Viewer";
    }
  };

  const translateRole = (roleKey) => {
    switch (roleKey) {
      case "Owner":
        return "مالك المجموعة";
      case "Admin":
        return "مدير المجموعة";
      case "Manager":
        return "إداري المجموعة";
      case "Assignee":
        return "مكلف";
      case "Viewer":
        return "قارئ";
      default:
        return roleKey;
    }
  };

  const translatePriority = (num) => {
    switch (Number(num)) {
      case 0:
        return "منخفضة";
      case 1:
        return "متوسطة";
      case 2:
        return "مرتفعة";
      default:
        return "غير محددة";
    }
  };

  const can = (role, action) => {
    const permissions = {
      Owner: ["manageMembers", "manageTasks", "deleteGroup", "editGroup"],
      Admin: ["manageMembers", "manageTasks"],
      Manager: ["manageTasks"],
      Assignee: [],
    };
    return permissions[role]?.includes(action);
  };

  // --- API calls ---
  // تفاصيل المجموعة + الفئات
  const fetchGroupDetails = async () => {
    try {
      const res = await axios.get(`/groups/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = res.data?.data ?? res.data;
      setGroup(data);
      setCategories(Array.isArray(data?.categories) ? data.categories : []);
    } catch (err) {
      console.error(
        "فشل تحميل بيانات المجموعة:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // الأعضاء + المالك
  const fetchGroupMembers = async () => {
    try {
      const res = await axios.get(`/groups/${id}/members`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const payload = res.data?.data ?? res.data ?? {};
      const ownerData = payload.owner || null;
      let memberList = Array.isArray(payload.members) ? payload.members : [];

      // تحويل الأدوار من membership.role إذا وجد
      const mappedMembers = memberList.map((m) => ({
        ...m,
        role: mapRoleNumberToKey(m.membership?.role ?? m.role ?? 3), // 3 كافتراضي (Viewer)
      }));

      setOwner(ownerData ? { ...ownerData, role: "Owner" } : null);
      setMembers(mappedMembers);
    } catch (err) {
      console.error("فشل تحميل الأعضاء:", err.response?.data || err.message);
    }
  };

  // مهام فئة معيّنة
  const fetchTasksByCategory = async (categoryId) => {
    try {
      const res = await axios.get(`/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const payload = res.data?.data ?? res.data;
      const nextTasks = Array.isArray(payload?.tasks)
        ? payload.tasks
        : Array.isArray(payload)
        ? payload
        : [];
      setTasks(nextTasks);
    } catch (err) {
      console.error("فشل تحميل المهام:", err.response?.data || err.message);
      setTasks([]);
    }
  };

  // إضافة فئة
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post(
        `/groups/${id}/add-category`,
        { title: newCategory.trim(), color: "#000000" },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setNewCategory("");
      fetchGroupDetails();
    } catch (err) {
      console.error("فشل إضافة الفئة:", err.response?.data || err.message);
    }
  };

  // حذف فئة
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;
    try {
      await axios.get(`/categories/${categoryId}/delete`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
        setTasks([]);
      }
    } catch (err) {
      console.error("فشل حذف الفئة:", err.response?.data || err.message);
    }
  };

  // حذف عضو آخر (يستخدمه المالك أو المدير)
  const handleDeleteMember = async (memberId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا العضو؟")) return;
    try {
      await axios.post(
        `/groups/${id}/remove-member`,
        { user_id: memberId },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      console.error("فشل حذف العضو:", err.response?.data || err.message);
    }
  };

  // مغادرة المجموعة (يستخدمه العضو الحالي)
  const handleLeaveGroup = async () => {
    if (!window.confirm("هل تريد مغادرة هذه المجموعة؟")) return;
    try {
      await axios.get(`/groups/${id}/leave`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      navigate("/groups"); // رجع المستخدم إلى قائمة المجموعات بعد المغادرة
    } catch (err) {
      console.error("فشل مغادرة المجموعة:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (group) fetchGroupMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  if (loading)
    return <p className="text-center text-gray-500 mt-6">جاري التحميل...</p>;
  if (!group)
    return (
      <p className="text-center mt-6 text-red-500">
        لم يتم العثور على المجموعة.
      </p>
    );

  // حدد دور المستخدم الحالي (مالك أو من قائمة الأعضاء)
  const myRole =
    (owner?.id === currentUser?.id && "Owner") ||
    members.find((m) => m.id === currentUser?.id)?.role ||
    "Assignee";

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

      {/* --- الأعضاء --- */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
          الأعضاء:
        </h3>
        <ul className="space-y-2">
          {/* المالك */}
          {owner && (
            <li className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex justify-between items-center">
              <div>
                <span className="font-semibold">{owner.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-300 ml-2">
                  (مالك المجموعة)
                </span>
              </div>
              <Link
                to={`/groups/${group.id}/members/${owner.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                عرض
              </Link>
            </li>
          )}

          {/* الأعضاء */}
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

                {/* زر الحذف يظهر فقط عند المالك أو المدير، وليس عند نفس العضو */}
                {can(myRole, "manageMembers") &&
                  member.id !== currentUser?.id && (
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      حذف
                    </button>
                  )}

                {/* زر المغادرة يظهر عند جميع الأعضاء ما عدا المالك */}
                {member.id === currentUser?.id && myRole !== "Owner" && (
                  <button
                    onClick={handleLeaveGroup}
                    className="text-sm text-yellow-600 hover:underline"
                  >
                    مغادرة
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {can(myRole, "manageMembers") && (
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

      {/* --- الفئات --- */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
          الفئات:
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`relative group flex items-center px-3 py-1 rounded cursor-pointer 
                ${
                  selectedCategory === cat.id
                    ? "bg-blue-400 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white"
                }`}
              onClick={() => {
                setSelectedCategory(cat.id);
                fetchTasksByCategory(cat.id);
              }}
            >
              <span>{cat.title}</span>

              {can(myRole, "manageTasks") && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(cat.id);
                  }}
                  className="absolute -top-2 -left-2 hidden group-hover:flex bg-red-600 text-white rounded-full w-5 h-5 items-center justify-center hover:bg-red-700"
                  title="حذف الفئة"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>

        {can(myRole, "manageTasks") && (
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

      {/* --- المهام --- */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
          {selectedCategory ? "مهام الفئة المختارة:" : "اختر فئة لعرض المهام"}
        </h3>

        {tasks.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            لا توجد مهام حالياً.
          </p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-gray-100 dark:bg-gray-700 p-3 rounded"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{task.title}</div>
                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <span className="text-sm px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded">
                    {translatePriority(task.priority)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {can(myRole, "manageTasks") && selectedCategory && (
          <div className="mt-4">
            <Link
              to={`/categories/${selectedCategory}/add-task?groupId=${group.id}`}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              + إضافة مهمة
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupDetails;
