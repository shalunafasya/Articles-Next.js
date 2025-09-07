"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://test-fe.mysellerpintar.com/api/categories",
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );

      setCategories(res.data.data || []);  
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories([]); 
    }
  };

  fetchCategories();
}, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(
          `https://test-fe.mysellerpintar.com/api/articles/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data;

        setTitle(data.title);
        setCategory(data.category?.id || "");
        setContent(data.content);
        setPreviewThumbnail(data.imageUrl || "");
      } catch (err) {
        console.error("Failed to fetch article:", err);
      }
    };

    if (id) fetchArticle();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
      setPreviewThumbnail(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUploadThumbnail = async (): Promise<string | null> => {
    if (!thumbnail) return previewThumbnail || null;

    const formData = new FormData();
    formData.append("image", thumbnail);

    try {
      const res = await axios.post(
        "https://test-fe.mysellerpintar.com/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      return res.data.imageUrl;
    } catch (err) {
      console.error("Thumbnail upload error:", err);
      alert("Thumbnail upload failed!");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !category || !content) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const imageUrl = await handleUploadThumbnail();
      if (!imageUrl) return;

      const articleData = { title, content, categoryId: category, imageUrl };

      await axios.put(
        `https://test-fe.mysellerpintar.com/api/articles/${id}`,
        articleData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      alert("Article updated successfully!");
      router.push("/admin/articles");
    } catch (err) {
      console.error("Failed to update article:", err);
      alert("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-6 max-w-2xl mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-6">Edit Article</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thumbnail */}
        <div>
          <label className="block font-medium mb-2">Thumbnail</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewThumbnail && (
            <p className="mt-2">
              Preview:{" "}
              <img src={previewThumbnail} className="w-40 rounded-md" />
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Input title"
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
