import apiClient from "@/lib/apiClient";

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export const getCategories = async (search?: string): Promise<Category[]> => {
  const res = await apiClient.get("/categories", {
    params: search ? { search } : {},
  });
  return res.data.data || [];
};

export const addCategory = async (name: string) => {
  return apiClient.post("/categories", { name });
};

export const updateCategory = async (id: string, name: string) => {
  return apiClient.put(`/categories/${id}`, { name });
};

export const deleteCategory = async (id: string) => {
  return apiClient.delete(`/categories/${id}`);
};
