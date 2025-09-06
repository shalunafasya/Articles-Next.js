"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Article } from "@/types/article";
import Link from "next/link";
import Image from "next/image";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(0);
  const [username, setUserName] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          "https://test-fe.mysellerpintar.com/api/articles"
        );

        const data = res.data;
        setArticles(data.data || []);
        setTotal(data.total || 0);
        setLimit(data.limit || 0);

        if (data.data && data.data.length > 0) {
          setUserName(data.data[0].user.username);
        }
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow">
      <p className="p-6">Total Articles : {total}</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border w-[225px]">Thumbnails</th>
              <th className="p-2 border w-[225px]">Title</th>
              <th className="p-2 border w-[225px]">Category</th>
              <th className="p-2 border w-[225px]">Created At</th>
              <th className="p-2 border w-[225px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {articles.length > 0 ? (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 h-[84px]">
                  <td className="p-2 border text-center">
                    {article.imageUrl && (
                      <Image
                        src={article.imageUrl || "/images/article1.jpg"}
                        alt={article.title}
                        width={120}
                        height={80}
                        className="object-cover rounded w-[60px] h-[60px] mx-auto"
                      />
                    )}
                  </td>
                  <td className="p-2 border text-gray-500">{article.title}</td>
                  <td className="p-2 border text-center text-gray-500">
                    {article.category?.name || "No category"}
                  </td>
                  <td className="p-2 border text-cente text-gray-500r">
                    <p className="text-center text-sm text-gray-500 mb-6">
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
                    </p>
                  </td>
                  <td className="p-2 border text-center space-x-2">
                    <Link
                      href={`/articles/${article.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Preview
                    </Link>
                    <button className="text-blue-500 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-500 hover:underline">
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
    </div>
  );
}
