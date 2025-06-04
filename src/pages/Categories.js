import React, { useState } from "react";

function Categories() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Frontend" },
    { id: 2, name: "Backend" },
    { id: 3, name: "تصميم" },
  ]);

  const [newName, setNewName] = useState("");
  const [isEditing, setIsEditing] = useState(null); // id of category being edited

  const handleAdd = () => {
    if (!newName.trim()) return;
    const newCategory = {
      id: Date.now(),
      name: newName,
    };
    setCategories([...categories, newCategory]);
    setNewName("");
  };

  const handleEdit = (id) => {
    const updated = categories.map((cat) =>
      cat.id === id ? { ...cat, name: newName } : cat
    );
    setCategories(updated);
    setIsEditing(null);
    setNewName("");
  };

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الفئة؟")) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  const startEdit = (category) => {
    setIsEditing(category.id);
    setNewName(category.name);
  };

  return (
    <div className="max-w-xl mx-auto text-right bg-white dark:bg-gray-800 p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        إدارة الفئات
      </h2>

      {/* نموذج الإضافة / التعديل */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="اسم الفئة"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={isEditing ? () => handleEdit(isEditing) : handleAdd}
          className={`px-4 py-2 rounded text-white transition ${
            isEditing
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isEditing ? "حفظ التعديل" : "إضافة فئة"}
        </button>
      </div>

      {/* قائمة الفئات */}
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex justify-between items-center"
          >
            <span className="text-gray-800 dark:text-white">{cat.name}</span>
            <div className="flex gap-3">
              <button
                onClick={() => startEdit(cat)}
                className="text-sm text-blue-600 hover:underline"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-sm text-red-600 hover:underline"
              >
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
