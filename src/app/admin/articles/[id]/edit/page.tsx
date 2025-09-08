"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import parse from "html-react-parser";
import { LuImagePlus } from "react-icons/lu";

import TextEditor from "@/components/TiptapEditor";
import {
  fetchCategories,
  fetchArticleById,
  uploadThumbnail,
  updateArticle,
} from "@/services/articleService";

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchArticleById(id as string)
      .then((data) => {
        setTitle(data.title);
        setCategory(data.category?.id || "");
        setContent(data.content);
        setPreviewThumbnail(data.imageUrl || "");
      })
      .catch((err) => console.error("Fetch article error:", err));
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
      setPreviewThumbnail(URL.createObjectURL(e.target.files[0]));
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

      let imageUrl = previewThumbnail;
      if (thumbnail) {
        imageUrl = await uploadThumbnail(thumbnail);
      }

      await updateArticle(id as string, {
        title,
        content,
        categoryId: category,
        imageUrl,
      });

      alert("Article updated successfully!");
      router.push("/admin/articles");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update article!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-6 m-1">
      <h1 className="text-xl font-semibold mb-6">Edit Article</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-2">Thumbnail</label>
          <label
            htmlFor="fileUpload"
            className="px-4 py-10 bg-white border-gray-400 border-2 border-dashed rounded cursor-pointer hover:bg-gray-300 flex flex-col items-center justify-center"
          >
            <LuImagePlus className="text-4xl text-gray-500" />
            <p className="underline text-gray-500">Click to select file</p>
            <p className="text-gray-500">Support File Type : jpg or png</p>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="fileUpload"
          />
          {previewThumbnail && (
            <img
              src={previewThumbnail}
              className="mt-3 w-40 h-40 object-cover rounded-md"
              alt="Preview"
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
            onClick={() => router.back()}
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
            {loading ? "Updating..." : "Update"}
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

            <h1 className="text-3xl font-bold mb-4 text-center">
              {title || "Untitled"}
            </h1>

            {previewThumbnail && (
              <Image
                src={previewThumbnail}
                alt="Preview Thumbnail"
                width={1120}
                height={480}
                className="rounded-lg mb-6 w-[1120px] h-[480px] object-cover"
              />
            )}

            <div className="prose max-w-none">
              {parse(content) || "No content yet."}
            </div>
          </section>

          <footer className="bg-blue-500 text-white py-5 h-[100px] text-center">
            <p>&copy; 2025 Blog Genzet. All rights reserved.</p>
          </footer>
        </div>
      )}
    </div>
  );
}
