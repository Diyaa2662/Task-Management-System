import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import MainLayout from "./layout/MainLayout";
import AddTask from "./pages/AddTask";
import TaskDetails from "./pages/TaskDetails";
import EditTask from "./pages/EditTask";
import Groups from "./pages/Groups";
import AddGroup from "./pages/AddGroup";
import EditGroup from "./pages/EditGroup";
import GroupDetails from "./pages/GroupDetails";
import AddMember from "./pages/AddMember";
import MemberDetails from "./pages/MemberDetails";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AddTaskToCategory from "./pages/AddTaskToCategory";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <Router>
      <Routes>
        {/* صفحات عامة */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* صفحات لوحة التحكم ضمن MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/new" element={<AddTask />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/tasks/:id/edit" element={<EditTask />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/new" element={<AddGroup />} />
          <Route path="/groups/:id/edit" element={<EditGroup />} />
          <Route path="/groups/:id" element={<GroupDetails />} />
          <Route path="/groups/:id/add-member" element={<AddMember />} />
          <Route
            path="/categories/:categoryId/add-task"
            element={<AddTaskToCategory />}
          />
          <Route
            path="/groups/:id/members/:memberId"
            element={<MemberDetails />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
