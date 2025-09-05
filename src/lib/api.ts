import axios from "axios";

const API_URL = "https://test-fe.mysellerpintar.com/api";

export const getArticles = async () => {
  try {
    const res = await axios.get(`${API_URL}/articles`);
    return res.data;
  } catch (err) {
    console.error("Error fetching articles:", err);
    return { data: [], total: 0 };
  }
};
