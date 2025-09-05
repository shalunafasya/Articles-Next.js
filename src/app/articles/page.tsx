"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Article } from "@/types/article";
import Link from "next/link";

export default function Articles() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(0);
  const [username, setUserName] = useState("");

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch articles + username
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

        // Ambil username dari artikel pertama
        if (data.data && data.data.length > 0) {
          setUserName(data.data[0].user.username);
        }
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      }
    };

    fetchArticles();
  }, []);

  const initial = username ? username.charAt(0).toUpperCase() : "?";

  return (
    <main>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 mx-auto h-[96px] flex items-center justify-between px-[60px] transition-colors duration-300 z-50 ${
          isScrolled ? "bg-blue-500 shadow-md" : "bg-transparent"
        }`}
      >
        <div>
          <Image src="/images/logo.png" alt="logo" width={134} height={64} />
        </div>
        <div className="flex items-center gap-2">
          {/* Avatar bulat */}
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 font-bold">
            {initial}
          </div>
          {/* Nama user */}
          <span className="text-white">{username}</span>
        </div>
      </header>

      {/* HERO */}
      <section className="w-full">
        <div className="h-[500px] bg-cover bg-center bg-[url('/images/bg.jpg')]">
          <div className="bg-blue-500/80 h-[500px] flex items-center justify-center">
            <div className="container mx-auto flex flex-col max-w-[730px] items-center text-white text-center px-2">
              <p className="text-[16px]">Blog Genzet</p>
              <h1 className="text-2xl font-bold text-[48px] leading-tight">
                The Journal : Design Resources, Interviews, and Industry News
              </h1>
              <p className="text-[24px] mb-4">
                Your daily dose of design insights!
              </p>

              {/* Search + Select */}
              <div className="bg-blue-500 text-gray-500 rounded-lg px-2 py-2">
                <div className="flex items-center mx-auto rounded-lg overflow-hidden shadow-md bg-white space-x-2">
                  <select className="px-4 py-3 text-gray-700 bg-white border-none outline-none">
                    <option>Select category</option>
                    <option>Design</option>
                    <option>Tech</option>
                    <option>Business</option>
                  </select>

                  <div className="flex items-center flex-1 border-l">
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
                      className="w-full px-4 py-3 outline-none border-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ARTICLES */}
        <div className="bg-white py-12">
          <div className="container mx-auto">
            <div className="container mx-auto px-4 py-4 text-gray-600">
              {limit > 0 && (
                <p>
                  Showing : {articles.length} of {total} articles
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <Link key={article.id} href={`/articles/${article.id}`}>
                    <div className="rounded-lg bg-white shadow-md hover:shadow-lg transition overflow-hidden">
                      {article.imageUrl && (
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          width={500}
                          height={300}
                          className="object-cover h-48 w-full"
                        />
                      )}

                      <div className="p-5">
                        <p className="text-sm text-gray-500">
                          {new Date(article.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>

                        <h2 className="text-lg font-semibold mt-2">
                          {article.title}
                        </h2>

                        <p className="text-sm text-gray-600 mt-2">
                          {article.content?.slice(0, 100)}...
                        </p>

                        <div className="flex gap-2 mt-3 flex-wrap">
                          <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                            {article.category.name || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center col-span-3 text-gray-500">
                  No articles found
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
