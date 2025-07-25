import axios from "axios";

const instance = axios.create({
  baseURL: "https://task-management-api.alwakkaa.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// في حال كان فيه توكن مخزّن
const token = localStorage.getItem("token");
if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default instance;
