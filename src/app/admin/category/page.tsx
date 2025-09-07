"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Article } from "@/types/article";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be at most 50 characters"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
  try {
    const token = Cookies.get("token");
    const res = await axios.get("https://test-fe.mysellerpintar.com/api/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: Category[] = res.data.data || [];
    setCategories(data);
    setTotal(data.length);
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
};


  const handleAddCategory = async (formData: CategoryFormData) => {
  try {
    const token = Cookies.get("token");
    await axios.post(
      "https://test-fe.mysellerpintar.com/api/categories",
      { name: formData.name },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      }
    );
    alert("Category berhasil ditambahkan!");
    reset();
    setShowAddModal(false);
    fetchCategories();
  } catch (error) {
    console.error("Gagal tambah category:", error);
    alert("Error: " + error);
  }
};


  const handleEditCategory = async (formData: CategoryFormData) => {
    if (!selectedCategory) return;
    try {
      const token = Cookies.get("token");
      await axios.put(
        `https://test-fe.mysellerpintar.com/api/categories/${selectedCategory.id}`,
        { name: formData.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Category berhasil diupdate!");
      reset();
      setShowEditModal(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Gagal update category:", error);
      alert("Error: " + error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `https://test-fe.mysellerpintar.com/api/categories/${selectedCategory.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Category berhasil dihapus!");
      setShowDeleteModal(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Gagal delete category:", error);
      alert("Error: " + error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <p className="p-6 border">Total Category : {total}</p>

      <div className="flex justify-between mt-4 overflow-x-auto bg-gray-50">
        <div className="flex items-center overflow-hidden bg-white ml-6">
          <div className="flex items-center p-2 border rounded ml-2">
            <input
              type="text"
              placeholder="Search Category"
              className="outline-none border-none"
            />
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="border-2 bg-blue-500 text-white rounded-lg mr-6 px-6 py-2 font-semibold hover:bg-white hover:border-blue-500 hover:text-blue-500"
        >
          + Add Category
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2 w-[225px]">Category</th>
              <th className="p-2 w-[225px]">Created At</th>
              <th className="p-2 w-[225px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 h-[84px]">
                  <td className="p-2 text-center text-gray-500">{cat.name}</td>
                  <td className="p-2 text-center text-gray-500">
                    {new Date(cat.createdAt).toLocaleString()}
                  </td>
                  <td className="p-2 text-center space-x-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setValue("name", cat.name);
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-2 text-center border">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Add Category</h2>
            <form onSubmit={handleSubmit(handleAddCategory)}>
              <input
                type="text"
                placeholder="Input Category"
                {...register("name")}
                className="w-full border p-2 rounded mb-2"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    reset();
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
            <form onSubmit={handleSubmit(handleEditCategory)}>
              <input
                type="text"
                placeholder="Input Category"
                {...register("name")}
                className="w-full border p-2 rounded mb-2"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    reset();
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Delete Category</h2>
            <p className="mb-4">
              Are you sure you want to delete category{" "}
              <strong>{selectedCategory.name}</strong>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
