import api from "@/lib/apiClient";

export const fetchCategories = async () => {
  const res = await api.get("/categories");
  return res.data.data || [];
};

export const fetchArticleById = async (id: string) => {
  const res = await api.get(`/articles/${id}`);
  return res.data;
};

export const uploadThumbnail = async (thumbnail: File) => {
  const formData = new FormData();
  formData.append("image", thumbnail);

  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.imageUrl;
};

export const addArticle = async (data: {
  title: string;
  content: string;
  categoryId: string;
  imageUrl: string;
}) => {
  return await api.post("/articles", data);
};

export const updateArticle = async (
  id: string,
  data: {
    title: string;
    content: string;
    categoryId: string;
    imageUrl: string;
  }
) => {
  return await api.put(`/articles/${id}`, data);
};
