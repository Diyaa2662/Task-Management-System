import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function MainLayout() {
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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // ✅ حالة لكشف إذا الشاشة صغيرة
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 pt-16 min-h-screen relative transition-all">
      <Navbar
        onToggleSidebar={toggleSidebar}
        onToggleTheme={toggleTheme}
        darkMode={darkMode}
      />

      {/* ✅ الشريط الجانبي كـ Overlay على الموبايل */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggleTheme={toggleTheme}
        darkMode={darkMode}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ✅ main لا يتحرك في حالة الموبايل */}
      <main
        className={`p-6 transition-all duration-300 ${
          sidebarOpen && !isMobile ? "mr-64" : ""
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
