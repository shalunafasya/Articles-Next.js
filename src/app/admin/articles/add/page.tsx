"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Article } from "@/types/article";

export default function AddArticlePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://test-fe.mysellerpintar.com/api/articles",
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        const articles = res.data.data || [];
        const uniqueCategories: { id: string; name: string }[] = [];

        articles.forEach((article: Article) => {
          if (
            article.category &&
            !uniqueCategories.find((c) => c.id === article.category.id)
          ) {
            uniqueCategories.push({
              id: article.category.id,
              name: article.category.name,
            });
          }
        });

        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleUploadThumbnail = async (): Promise<string | null> => {
    if (!thumbnail) return null;

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
    } catch (err: unknown) {
      console.error("Thumbnail upload error:", err);
      alert("Thumbnail upload failed!");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !content || !thumbnail) {
      alert("Please fill all fields and select a thumbnail");
      return;
    }

    try {
      setLoading(true);
      const imageUrl = await handleUploadThumbnail();
      if (!imageUrl) return;

      const articleData = {
        title,
        content,
        categoryId: category,
        imageUrl: imageUrl,
      };

      const res = await axios.post(
        "https://test-fe.mysellerpintar.com/api/articles",
        articleData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(articleData);
      console.log("Article uploaded:", res.data);
      alert("Article uploaded successfully!");
      setTitle("");
      setCategory("");
      setContent("");
      setThumbnail(null);
    } catch (err) {
      console.error("Failed to upload article:", err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-6 max-w-2xl mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-6">Create Article</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-2">Thumbnail</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {thumbnail && <p>Selected: {thumbnail.name}</p>}
        </div>

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
            onClick={() => {
              setTitle("");
              setCategory("");
              setContent("");
              setThumbnail(null);
            }}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
}
