// تخزين بيانات المستخدم والتوكن عند تسجيل الدخول
export const login = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

// تسجيل الخروج
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// جلب بيانات المستخدم الحالي
export const getCurrentUser = () => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};

// التحقق مما إذا كان المستخدم مسجل الدخول
export const isLoggedIn = () => {
  return !!localStorage.getItem("user");
};

// تحديث بيانات المستخدم المخزنة (مثلاً بعد التعديل على الملف الشخصي)
export const updateUser = (newData) => {
  localStorage.setItem("user", JSON.stringify(newData));
};

// جلب التوكن المخزّن
export const getToken = () => {
  return localStorage.getItem("token");
};
