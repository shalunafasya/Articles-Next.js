"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Article } from "@/types/article";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import TextEditor from "@/components/TiptapEditor";
import parse from "html-react-parser"
import { useRouter } from "next/navigation";

export default function AddArticlePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewThumbnail, setPreviewThumbnail] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

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
      const file = e.target.files[0];
      setThumbnail(file);
      setPreviewThumbnail(URL.createObjectURL(file));
    }
  };

  const handleDeleteThumbnail = () => {
    setThumbnail(null);
    setPreviewThumbnail("");
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
      setPreviewThumbnail("");
    } catch (err) {
      console.error("Failed to upload article:", err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-6 max-w  m-1">
      <h1 className="text-xl font-semibold mb-6">Create Article</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-2">Thumbnail</label>
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {thumbnail && (
              <button
                type="button"
                onClick={handleDeleteThumbnail}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            )}
          </div>
          {previewThumbnail && (
            <img
              src={previewThumbnail}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded"
            />
          )}
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
          <TextEditor value={content} onChange={setContent} />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setCategory("");
              setContent("");
              setThumbnail(null);
              setPreviewThumbnail("");
              router.back()
            }}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>

      {showPreview && (
        <div className="fixed inset-0 bg-white overflow-y-auto z-50">
          <header className="sticky top-0 bg-white shadow-md border-b px-10 py-5 flex justify-between items-center">
            <h1 className="text-xl font-bold">Preview Article</h1>
            <button
              onClick={() => setShowPreview(false)}
              className="text-red-500 font-semibold"
            >
              ✖ Close
            </button>
          </header>

          <section className="container mx-auto max-w-[1120px] py-10">
            <p className="text-center text-sm text-gray-500 mb-6">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              . Created by You
            </p>

            <h1 className="text-3xl font-bold mb-4 text-center">{title || "Untitled"}</h1>

            {previewThumbnail && (
              <Image
                src={previewThumbnail}
                alt="Preview Thumbnail"
                width={1120}
                height={480}
                className="rounded-lg mb-6 w-[1120px] h-[480px] object-cover"
              />
            )}

            <div className="prose max-w-none">{parse(content) || "No content yet."}</div>

          </section>

          <footer className="bg-blue-500 text-white py-5 h-[100px] text-center">
            <p>&copy; 2025 Blog Genzet. All rights reserved.</p>
          </footer>
        </div>
      )}
    </div>
  );
}