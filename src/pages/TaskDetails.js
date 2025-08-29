import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axios";
import { getToken } from "../utils/auth";
import {
  FileText,
  Info,
  ListChecks,
  Flag,
  Calendar,
  Edit3,
  ArrowLeft,
} from "lucide-react";

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setTask(response.data.data);
      } catch (err) {
        console.error("❌ فشل جلب تفاصيل المهمة:", err);
        setError("حدث خطأ أثناء جلب تفاصيل المهمة.");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-300 mt-6">
        جاري تحميل تفاصيل المهمة...
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 mt-6">
        {error || "لم يتم العثور على المهمة."}
      </div>
    );
  }

  const statusText = {
    0: "قيد الانتظار",
    1: "قيد التنفيذ",
    2: "مكتملة",
    3: "عالقة",
    4: "ملغاة",
  }[task.status];

  const priorityText = {
    0: "منخفضة",
    1: "عادية",
    2: "متوسطة",
    3: "مرتفعة",
  }[task.priority];

  return (
    <div className="max-w-3xl mx-auto text-right bg-white dark:bg-gray-800 p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <Info className="w-6 h-6 text-blue-600" />
        تفاصيل المهمة
      </h2>

      <div className="space-y-4 text-gray-700 dark:text-gray-200">
        <p className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <span className="font-semibold">العنوان:</span> {task.title}
        </p>
        <p className="flex items-center gap-2">
          <Info className="w-5 h-5 text-gray-500" />
          <span className="font-semibold">الوصف:</span>{" "}
          {task.description || "بدون وصف"}
        </p>
        <p className="flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-gray-500" />
          <span className="font-semibold">الحالة:</span> {statusText}
        </p>
        <p className="flex items-center gap-2">
          <Flag className="w-5 h-5 text-gray-500" />
          <span className="font-semibold">الأولوية:</span> {priorityText}
        </p>
        <p className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="font-semibold">تاريخ الاستحقاق:</span>{" "}
          {task.due_date || "غير محدد"}
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          to={`/tasks/${task.id}/edit`}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          <Edit3 className="w-5 h-5" />
          تعديل المهمة
        </Link>

        <Link
          to="/tasks"
          className="flex items-center gap-2 bg-gray-300 text-gray-800 px-5 py-2 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          العودة إلى المهام
        </Link>
      </div>
    </div>
  );
}

export default TaskDetails;
