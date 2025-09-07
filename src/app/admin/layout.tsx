"use client";

import Link from "next/link";
import { MdLogout } from "react-icons/md";
import { FiTag } from "react-icons/fi";
import { LuNewspaper } from "react-icons/lu";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import axios from "axios";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [username, setUserName] = useState("");
  const pathname = usePathname();
  const initial = username ? username.charAt(0).toUpperCase() : "?";
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  let pageTitle = "";
  if (pathname.includes("/admin/articles")) pageTitle = "Articles";
  else if (pathname.includes("/admin/category")) pageTitle = "Category";

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("https://test-fe.mysellerpintar.com/api/articles");
        const data = res.data;
        if (data.data && data.data.length > 0) {
          setUserName(data.data[0].user.username);
        }
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      }
    };
    fetchArticles();
  }, []);

  // click outside user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white p-5 flex flex-col">
        <div className="mb-5">
          <Image src="/images/logo.png" alt="logo" width={134} height={64} />
        </div>
        <nav className="flex flex-col gap-3">
          <Link
            href="/admin/articles"
            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-500 ${
              pathname.includes("/admin/articles") ? "bg-blue-500" : ""
            }`}
          >
            <LuNewspaper size={20} />
            <span>Articles</span>
          </Link>
          <Link
            href="/admin/category"
            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-500 ${
              pathname.includes("/admin/category") ? "bg-blue-500" : ""
            }`}
          >
            <FiTag size={20} />
            <span>Category</span>
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 hover:bg-blue-500 p-2 rounded text-white"
          >
            <MdLogout size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-lg font-bold">{pageTitle}</h1>

          <div className="relative" ref={userMenuRef}>
            <div
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-500 font-bold">
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

        <main className="flex-1 bg-gray-100 p-6">{children}</main>

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
      </div>
    </div>
  );
}
