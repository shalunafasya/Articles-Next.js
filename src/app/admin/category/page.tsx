"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as categoryService from "@/services/categoryService";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be at most 50 characters"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<categoryService.Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<categoryService.Category | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories(searchTerm);

      console.log("Fetched categories:", data);
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [searchTerm]);

  const handleAdd = async (formData: CategoryFormData) => {
    try {
      await categoryService.addCategory(formData.name);
      alert("Category added successfully!");
      reset();
      setShowAddModal(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to add category");
    }
  };

  const handleEdit = async (formData: CategoryFormData) => {
    if (!selectedCategory) return;
    try {
      await categoryService.updateCategory(selectedCategory.id, formData.name);
      alert("Category updated successfully!");
      reset();
      setShowEditModal(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to update category");
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      await categoryService.deleteCategory(selectedCategory.id);
      alert("Category deleted successfully!");
      setShowDeleteModal(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <p className="p-6 border">Total Categories: {categories.length}</p>

      <div className="flex justify-between mt-4 overflow-x-auto bg-white">
        <div className="flex items-center overflow-hidden bg-white ml-6"> 
          <div className="flex items-center p-2 border rounded ml-2">
        <input
          type="text"
          placeholder="Search category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            <th className="p-2 w-[225px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 h-[84px]">
                <td className="p-2 text-center text-gray-500">{cat.name}</td>
                <td className="p-2 text-center">{new Date(cat.createdAt).toLocaleString()}</td>
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
              <td colSpan={3} className="p-2 text-center">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>

</div>
      

      {showAddModal && (
        <Modal title="Add Category" onClose={() => { setShowAddModal(false); reset(); }}>
          <form onSubmit={handleSubmit(handleAdd)}>
            <input
              type="text"
              {...register("name")}
              placeholder="Category name"
              className="w-full border p-2 rounded mb-2"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 border rounded" onClick={() => { setShowAddModal(false); reset(); }}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
                {isSubmitting ? "Saving..." : "Add"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showEditModal && selectedCategory && (
        <Modal title="Edit Category" onClose={() => { setShowEditModal(false); reset(); }}>
          <form onSubmit={handleSubmit(handleEdit)}>
            <input
              type="text"
              {...register("name")}
              placeholder="Category name"
              className="w-full border p-2 rounded mb-2"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 border rounded" onClick={() => { setShowEditModal(false); reset(); }}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
                {isSubmitting ? "Saving..." : "Update"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showDeleteModal && selectedCategory && (
        <Modal title="Delete Category" onClose={() => setShowDeleteModal(false)}>
          <p className="mb-4">Are you sure you want to delete <strong>{selectedCategory.name}</strong>?</p>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleDelete}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}
