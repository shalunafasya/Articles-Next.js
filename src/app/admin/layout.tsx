"use client";

import Link from "next/link";
import { MdLogout } from "react-icons/md";
import { FiTag } from "react-icons/fi";
import { LuNewspaper } from "react-icons/lu";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function adminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  let pageTitle = "";
  if (pathname.includes("/admin/articles")) {
    pageTitle = "Articles";
  } else if (pathname.includes("/admin/category")) {
    pageTitle = "Category";
  }

  return (
    <div className="flex min-h-screen">
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
          <Link
            href="/login"
            className="flex items-center gap-3 hover:bg-blue-500 p-2 rounded"
          >
            <MdLogout size={20} />
            <span>Logout</span>
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-lg font-bold">{pageTitle}</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              J
            </div>
            <span className="font-medium">James Dean</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
}
