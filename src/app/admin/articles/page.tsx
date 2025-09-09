"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/lib/apiClient";
import Cookies from "js-cookie";
import { Article } from "@/types/article";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(0);

  const articlesPerPage = 10;

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/articles"); // ambil semua artikel
      setArticles(res.data.data || []);

      setTotal(res.data.total || 0);
      setLimit(res.data.limit || 0);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("You are not authorized!");
        return;
      }

      await apiClient.delete(`/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setArticles(articles.filter((article) => article.id !== id));
      setDeleteModal({ open: false, id: null });
      alert("Article deleted successfully!");
    } catch (error: unknown) {
      console.error("Failed to delete article:", error);
      alert(`Delete failed! ${error || ""}`);
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       article.content?.toLowerCase().includes(searchTerm.toLowerCase())) 

  );

  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * articlesPerPage;
  const displayedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  return (
    <div className="bg-white rounded-lg shadow">
      <p className="border-b pb-4 p-6">Total Articles: {filteredArticles.length}</p>

      <div className="flex justify-between p-6">
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            className="border p-2 rounded"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search articles"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="border p-2 rounded"
          />
        </div>

        <Link href={`/admin/articles/add`}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            + Add Article
          </button>
        </Link>
      </div>

      {/* Articles Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2 w-[225px]">Thumbnail</th>
              <th className="p-2 w-[225px]">Title</th>
              <th className="p-2 w-[225px]">Category</th>
              <th className="p-2 w-[225px]">Created At</th>
              <th className="p-2 w-[225px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">Loading...</td>
              </tr>
            ) : displayedArticles.length > 0 ? (
              displayedArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 text-gray-500 h-[84px]">
                  <td className="p-2 text-center">
                    {article.imageUrl && (
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        width={60}
                        height={60}
                        className="object-cover rounded mx-auto"
                      />
                    )}
                  </td>
                  <td className="p-2">{article.title}</td>
                  <td className="p-2 text-center">{article.category?.name || "No category"}</td>
                  <td className="p-2 text-center">{new Date(article.createdAt).toLocaleString()}</td>
                  <td className="p-2 text-center space-x-2">
                    <Link href={`/articles/${article.id}`} className="text-blue-500 hover:underline">Preview</Link>
                    <Link href={`/admin/articles/${article.id}/edit`} className="text-blue-500 hover:underline">Edit</Link>
                    <button onClick={() => setDeleteModal({ open: true, id: article.id })} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-2 text-center">No articles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      <div className="flex justify-center items-center gap-4 mt-4 mb-4 p-4">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
        <span>{page} / {totalPages}</span>
        <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages || totalPages === 0} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>

      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this article?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteModal({ open: false, id: null })} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={() => deleteModal.id && handleDelete(deleteModal.id)} className="px-4 py-2 bg-red-500 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
