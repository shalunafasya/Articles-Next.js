"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TextEditor from "@/components/TiptapEditor";
import { fetchCategories, uploadThumbnail, addArticle } from "@/services/articleService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import parse from "html-react-parser";
import { FaTrash } from "react-icons/fa";
import { LuImagePlus } from "react-icons/lu";

const schema = z.object({
  title: z.string().min(1, "Title wajib diisi"),
  category: z.string().min(1, "Category wajib dipilih"),
  content: z.string().min(1, "Content wajib diisi"),
});

type FormData = z.infer<typeof schema>;

export default function AddArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreviewThumbnail(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  const handleDeleteThumbnail = () => {
    setThumbnail(null);
    setPreviewThumbnail("");
    setFileName("");
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      let imageUrl = "";

      if (thumbnail) {
        imageUrl = await uploadThumbnail(thumbnail);
      }

      await addArticle({
        title: data.title,
        content: data.content,
        categoryId: data.category,
        imageUrl,
      });

      alert("Article added successfully!");
      router.push("/admin/articles");
    } catch (err) {
      console.error("Add failed:", err);
      alert("Failed to add article!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-6 m-1">
      <h1 className="text-xl font-semibold mb-6">Create Article</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-medium mb-2">Thumbnail</label>
          <div className="flex items-center gap-3">
            <label
              htmlFor="fileUpload"
              className="px-4 py-10 bg-white border-gray-400 border-2 border-dashed rounded cursor-pointer hover:bg-gray-300"
            >
              <LuImagePlus className="mx-auto text-gray-500" size={24} />
              <p className="text-center underline text-gray-500">Click to select file</p>
              <p className="text-center text-gray-500">Support File Type : jpg or png</p>
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-sm text-gray-600">{fileName || "No file chosen"}</span>
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
            placeholder="Input title"
            {...register("title")}
            className="w-full border rounded-md px-3 py-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
      
        <div>
          <label className="block font-medium mb-2">Category</label>
          <select {...register("category")} className="w-full border rounded-md px-3 py-2">
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-2">Content</label>
          <TextEditor value={watch("content")} onChange={(val) => setValue("content", val)} />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              reset();
              setThumbnail(null);
              setPreviewThumbnail("");
              router.back();
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
            <button onClick={() => setShowPreview(false)} className="text-red-500 font-semibold">
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
              {watch("title") || "Untitled"}
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

            <div className="prose max-w-none">{parse(watch("content")) || "No content yet."}</div>
          </section>

          <footer className="bg-blue-500 text-white py-5 h-[100px] text-center">
            <p>&copy; 2025 Blog Genzet. All rights reserved.</p>
          </footer>
        </div>
      )}
    </div>
  );
}
