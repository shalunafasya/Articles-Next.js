"use client";

import { notFound } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Article } from "@/types/article";
import Link from "next/link";
import { useRef } from "react";
import parse from "html-react-parser";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";


export default function ArticleDetail() {
  const [article, setArticle] = useState<Article | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [recommended, setRecommended] = useState<Article[]>([]);
  const [username, setUsername] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const params = useParams(); 
  const initial = username ? username.charAt(0).toUpperCase() : "?";



  const userMenuRef = useRef<HTMLDivElement>(null);

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
    const fetchArticle = async () => {
      try {
        const res = await axios.get<Article>(
          `https://test-fe.mysellerpintar.com/api/articles/${params.id}`
        );
        setArticle(res.data);
      } catch (err) {
        console.error(err);
        notFound();
      }
    };
    fetchArticle();
    fetchProfile();
  }, [params?.id]);

  useEffect(() => {
    if (!article) return;

    const fetchRecommended = async () => {
      try {
        const res = await axios.get(
          "https://test-fe.mysellerpintar.com/api/articles"
        );
        const sameCategory = res.data.data
          .filter(
            (a: Article) =>
              a.categoryId === article.categoryId && a.id !== article.id
          )
          .slice(0, 3);
        setRecommended(sameCategory);

      } catch (err) {
        console.error(err);
      }
    };

    fetchRecommended();
  }, [article]);

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

  if (!article) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <main>
      <header
        className={`fixed top-0 left-0 right-0 mx-auto h-[80px] flex items-center justify-between px-4 sm:px-6 lg:px-16 transition-colors duration-300 z-50 ${
          isScrolled
            ? "bg-white shadow-md border-b border-gray-200"
            : "bg-white shadow-md border-b border-gray-200"
        }`}
      >
        <div>
          <Image
            src="/images/logocolor.png"
            alt="logo"
            width={100}
            height={48}
          />
        </div>
        <div>
          <Image src="/images/logo.png" alt="logo" width={134} height={64} />
        </div>
        <div className="relative" ref={userMenuRef}>
          <div
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-500 font-bold">
              {initial}
            </div>
            <span className="text-black">{username}</span>
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
            <p className="mb-4 text-gray-700">
              Are you sure you want to logout?
            </p>
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

      <section className="container mx-auto flex flex-col max-w-[1120px] py-30 justify-center">
        <div className="py-8 px-2">
          <p className="text-center text-sm text-gray-500 mb-6">
            {new Date(article.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            . Created by Admin
          </p>

          <h1 className="text-3xl font-bold mb-4 text-center">
            {article.title}
          </h1>

          {article.imageUrl && (
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={1120}
              height={480}
              className="rounded-lg mb-6 w-[1120px] h-[480px]"
            />
          )}

          <div className="prose max-w-none text-sm sm:text-base">{parse(article.content)}</div>
        </div>

        <div className="p-3">
          <h1 className="font-bold mb-4">Other Articles</h1>

          {recommended.length === 0 ? (
            <p className="text-gray-500 italic">
              Belum ada artikel lain yang bisa ditampilkan.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((rec) => (
                <Link key={rec.id} href={`/articles/${rec.id}`}>
                  <div className="rounded-lg bg-white hover:shadow-lg transition overflow-hidden">
                    <div className="h-[240px]">
                      {rec.imageUrl && (
                        <Image
                          src={rec.imageUrl}
                          alt={rec.title}
                          width={500}
                          height={300}
                          className="object-cover rounded-b-lg w-[500px] h-[240px]"
                        />
                      )}
                    </div>
                    <div className="py-5">
                      <p className="text-sm text-gray-500">
                        {new Date(rec.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>

                      <h2 className="text-lg font-semibold mt-2">
                        {rec.title}
                      </h2>

                      <p className="text-sm text-gray-600 mt-2">
                        {parse(rec.content?.slice(0, 100))}...
                      </p>

                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                          {rec.category.name || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
