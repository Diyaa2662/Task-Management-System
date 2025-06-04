import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function MainLayout() {
  // ✅ الثيم
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark";
  });

  useEffect(() => {
    const html = document.documentElement;
    darkMode ? html.classList.add("dark") : html.classList.remove("dark");
  }, [darkMode]);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // ✅ الشريط الجانبي
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 pt-16 min-h-screen relative transition-all">
      <Navbar
        onToggleSidebar={toggleSidebar}
        onToggleTheme={toggleTheme}
        darkMode={darkMode}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onToggleTheme={toggleTheme}
        darkMode={darkMode}
      />
      <main
        className={`p-6 transition-all duration-300 ${
          sidebarOpen ? "mr-64" : "mr-0"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
