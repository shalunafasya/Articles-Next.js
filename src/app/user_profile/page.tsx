"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function UserProfile() {
  const [username, setUserName] = useState("");
  const initial = username ? username.charAt(0).toUpperCase() : "?";

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          "https://test-fe.mysellerpintar.com/api/articles"
        );

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

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <header
        className={`fixed top-0 left-0 right-0 mx-auto h-[96px] flex items-center justify-between px-[60px] transition-colors duration-300 z-50 bg-white shadow-md border-b border-gray-200"
                }`}
      >
        <div>
          <Image
            src="/images/logocolor.png"
            alt="logo"
            width={134}
            height={64}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-500 font-bold">
            {initial}
          </div>
          <span className="text-gray-600">{username}</span>
        </div>
      </header>
      <div className="flex flex-col items-center">
        <h1 className="font-bold p-5">User Profile</h1>
        <div className="w-[68px] h-[68px] rounded-full bg-blue-200 flex items-center justify-center text-blue-500 font-bold">
          {initial}
        </div>
        <div className="bg-white w-64 p-2 flex items-center mb-3"></div>
        <div className="bg-gray-100 w-[368px] p-2 flex items-center mb-3 rounded-md">
          <p className="font-semibold w-28">Username</p>
          <span className="mr-2">:</span>
          <span className="flex-1 text-center">{username}</span>
        </div>

        <div className="bg-gray-100 w-[368px] p-2 flex items-center mb-3 rounded-md">
          <p className="font-semibold w-28">Password</p>
          <span className="mr-2">:</span>
          <span className="flex-1 text-center">user123</span>
        </div>

        <div className="bg-gray-100 w-[368px] p-2 flex items-center mb-3 rounded-md">
          <p className="font-semibold w-28">Role</p>
          <span className="mr-2">:</span>
          <span className="flex-1 text-center">User</span>
        </div>
        <Link href="/articles">
        <button className="border-2 bg-blue-500 text-white w-[368px] rounded-md px-12 py-2 font-semibold hover:bg-white hover:text-blue-500 mt-3">
          Back to Home
        </button>
        </Link>
        
      </div>
      <footer className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Blog Genzet. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
