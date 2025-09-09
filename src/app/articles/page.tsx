"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Article } from "@/types/article";
import Link from "next/link";
import { useRef } from 'react';
import Cookies from "js-cookie";
import parse from "html-react-parser";

export default function Articles() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(0);
  const [username, setUsername] = useState(Cookies.get("username") || "User");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const initial = username ? username.charAt(0).toUpperCase() : "?";
  

  const userMenuRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);
  const articlesPerPage = 9;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchProfile = async () => {
        try {
          const token = Cookies.get("token");
          const res = await axios.get(
            "https://test-fe.mysellerpintar.com/api/auth/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = res.data;
          setUsername(data.username);
          
        } catch (err) {
          console.error("Failed to fetch profile:", err);
        }
      };

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
          setUsername(data.data[0].user.username);
        }

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
    fetchProfile();
    fetchArticles();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredArticles = articles.filter(
    (article) =>
      (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "" || article.category?.name === selectedCategory)
  );

  const startIndex = (page - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const displayedArticles = filteredArticles.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <main>
      <header
        className={`fixed top-0 left-0 right-0 mx-auto h-[80px] flex items-center justify-between px-4 sm:px-6 lg:px-16 transition-colors duration-300 z-50 ${
          isScrolled ? "bg-blue-500 shadow-md" : "bg-transparent"
        }`}
      >
        <div>
          <Image src="/images/logo.png" alt="logo" width={100} height={48} />
        </div>
        <div className="relative" ref={userMenuRef}>
          <div
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 font-bold">
              {initial}
            </div>
            <span className="text-white">{username}</span>
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
              <Link
                href="/user_profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                My Account
              </Link>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[300px] text-center">
            <p className="mb-4 text-gray-700">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="w-full">
        <div className="h-[500px] bg-cover bg-center bg-[url('/images/bg.jpg')]">
          <div className="bg-blue-500/80 h-[500px] flex items-center justify-center">
            <div className="container mx-auto flex flex-col max-w-[730px] items-center text-white text-center px-2">
              <p className="text-[16px]">Blog Genzet</p>
              <h1 className="font-bold text-2xl sm:text-3xl lg:text-5xl leading-tight">
                The Journal : Design Resources, Interviews, and Industry News
              </h1>
              <p className="text-[20px] mb-4">
                Your daily dose of design insights!
              </p>

              <div className="bg-blue-500 text-gray-500 rounded-lg px-2 py-2">
                <div className="flex items-center mx-auto rounded-lg overflow-hidden shadow-md bg-white space-x-2">
                  <select
                    className="px-4 py-3 text-gray-700 bg-white border-none outline-none"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
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
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                      }}
                      className="w-full px-4 py-3 outline-none border-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-12">
          <div className="container mx-auto">
            <div className="container mx-auto px-4 py-4 text-gray-600">
              {limit > 0 && (
                <p>
                  Showing : {filteredArticles.length} of {total} articles
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-2">
              {displayedArticles.length > 0 ? (
                displayedArticles.map((article) => (
                  <Link key={article.id} href={`/articles/${article.id}`}>
                    <div className="bg-white hover:shadow-lg transition overflow-hidden">
                      <div className="h-[180px] sm:h-[200px] lg:h-[240px]">
                        {article.imageUrl && (
                          <Image
                            src={article.imageUrl || "/images/article1.jpg"}
                            alt={article.title}
                            width={500}
                            height={300}
                            className="object-cover rounded-b-lg w-full h-full"
                          />
                        )}
                      </div>
                      <div className="py-5 px-2">
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

                        <div className="text-sm text-gray-600 mt-2">
                          {parse(article.content?.slice(0, 100))}...
                        </div>

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

              <div className="flex justify-center mt-8 gap-2">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded disabled:opacity-50"> Previous </button>
                <span> {page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded disabled:opacity-50"> Next </button>
              </div>
            
          </div>
        </div>
      </section>
      <footer className="bottom-0 left-0 right-0 bg-blue-500 text-white py-5 h-[100px]">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Blog Genzet. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
