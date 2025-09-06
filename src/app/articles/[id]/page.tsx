"use client";

import { notFound } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Article } from "@/types/article";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default function ArticleDetail({ params }: Props) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [recommended, setRecommended] = useState<Article[]>([]);
  const [username, setUserName] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  }, [params.id]);

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

        const data = res.data;

        if (data.data && data.data.length > 0) {
          setUserName(data.data[0].user.username);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecommended();
  }, [article]);

  const initial = username ? username.charAt(0).toUpperCase() : "?";
  if (!article) return null;

  return (
    <main>
      <header
        className={`fixed top-0 left-0 right-0 mx-auto h-[96px] flex items-center justify-between px-[60px] transition-colors duration-300 z-50 ${
          isScrolled
            ? "bg-white shadow-md border-b border-gray-200"
            : "bg-white shadow-md border-b border-gray-200"
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
        <Link href="/user_profile">
          <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-500 font-bold">
            {initial}
          </div>
          <span className="text-gray-600">{username}</span>
        </div>
        </Link>
      </header>

      <section className="container mx-auto flex flex-col max-w-[1120px] py-30 justify-center">
        <div className="py-10">
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

          <div className="prose max-w-none">{article.content}</div>
        </div>

        <div>
          <h1 className="font-bold mb-4">Other Articles</h1>
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
            ))}
          </div>
        </div>
      </section>
      <footer className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Blog Genzet. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
