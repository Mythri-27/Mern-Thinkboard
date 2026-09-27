import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "https://thinkboard-xy7l.onrender.com/api/notes"
    : "http://localhost:5000/api/notes";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;