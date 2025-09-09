"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function UserProfile() {
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

  const initial = username ? username.charAt(0).toUpperCase() : "?";

  useEffect(() => {
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
        setId(data.id);
        setUsername(data.username);
        setRole(data.role);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-white pt-[120px] pb-[100px] px-5">
      <header className="fixed top-0 left-0 right-0 h-[96px] flex items-center justify-between px-[60px] bg-white shadow-md border-b border-gray-200 z-50">
        <Image src="/images/logocolor.png" alt="logo" width={134} height={64} />
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-500 font-bold">
            {initial}
          </div>
          <span className="text-gray-600">{username}</span>
        </div>
      </header>

      <div className="flex flex-col items-center mt-6 gap-3">
        <h1 className="font-bold text-2xl mb-4">User Profile</h1>

        <div className="w-[68px] h-[68px] rounded-full bg-blue-200 flex items-center justify-center text-blue-500 font-bold text-xl mb-2">
          {initial}
        </div>

        <div className="bg-gray-100 w-[400px] p-2 flex items-center mb-3 rounded-md">
          <p className="font-semibold w-28 text-left">Id</p>
          <span className="mx-2">:</span>
          <span className="flex-1 text-center">{id}</span>
        </div>

        <div className="bg-gray-100 w-[400px] p-2 flex items-center mb-3 rounded-md">
          <p className="font-semibold w-28 text-left">Username</p>
          <span className="mx-2">:</span>
          <span className="flex-1 text-center">{username}</span>
        </div>

        <div className="bg-gray-100 w-[400px] p-2 flex items-center mb-3 rounded-md">
          <p className="font-semibold w-28 text-left">Role</p>
          <span className="mx-2">:</span>
          <span className="flex-1 text-center">{role}</span>
        </div>

        <button
          onClick={() => router.back()}
          className="border-2 bg-blue-500 text-white w-[400px] rounded-md px-12 py-2 font-semibold hover:bg-white hover:text-blue-500 mt-3"
        >
          Back to home
        </button>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Blog Genzet. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
