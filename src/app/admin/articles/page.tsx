"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Article } from "@/types/article";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          "https://test-fe.mysellerpintar.com/api/articles"
        );
        const data = res.data;
        setArticles(data.data || []);
        setTotal(data.total || 0);

        const uniqueCategories = Array.from(
          new Set(
            (data.data || [])
              .map((article: Article) => article.category?.name)
              .filter(Boolean)
          )
        );
        setCategories(uniqueCategories as string[]);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(
    (article) =>
      (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "" || article.category?.name === selectedCategory)
  );

  const handleDelete = async (id: string) => {
  try {
    // Ambil token dari cookies
    const token = Cookies.get("token"); 
    if (!token) {
      alert("You are not authorized!");
      return;
    }

    await axios.delete(`https://test-fe.mysellerpintar.com/api/articles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Update state setelah berhasil delete
    setArticles(articles.filter((article) => article.id !== id));
    setDeleteModal({ open: false, id: null });
    alert("Article deleted successfully!");
  } catch (error: unknown) {
    console.error("Failed to delete article:", error);
    alert(`Delete failed! ${error || ""}`);
  }
};

  return (
    <div className="bg-white rounded-lg shadow">
      <p className="p-6 border">Total Articles : {filteredArticles.length}</p>

      <div className="flex justify-between mt-4 overflow-x-auto bg-gray-50">
        <div className="flex items-center ml-6 gap-2">
          <select
            className="text-gray-700 bg-white border p-2 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex items-center p-2 border rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search articles"
              className="outline-none border-none ml-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Link href={`/admin/articles/add`}>
          <button className="border-2 bg-blue-500 text-white rounded-lg mr-6 px-6 py-2 font-semibold hover:bg-white hover:border-blue-500 hover:text-blue-500">
            + Add Articles
          </button>
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2 w-[225px]">Thumbnails</th>
              <th className="p-2 w-[225px]">Title</th>
              <th className="p-2 w-[225px]">Category</th>
              <th className="p-2 w-[225px]">Created At</th>
              <th className="p-2 w-[225px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 h-[84px]">
                  <td className="p-2 text-center">
                    {article.imageUrl && (
                      <Image
                        src={article.imageUrl || "/images/article1.jpg"}
                        alt={article.title}
                        width={60}
                        height={60}
                        className="object-cover rounded mx-auto"
                      />
                    )}
                  </td>
                  <td className="p-2 text-gray-500">{article.title}</td>
                  <td className="p-2 text-center text-gray-500">
                    {article.category?.name || "No category"}
                  </td>
                  <td className="p-2 text-center text-gray-500">
                    {new Date(article.createdAt).toLocaleString()}
                  </td>
                  <td className="p-2 text-center space-x-2">
                    <Link
                      href={`/articles/${article.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Preview
                    </Link>
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ open: true, id: article.id })}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-2 text-center border">
                  No articles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this article?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteModal.id && handleDelete(deleteModal.id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
