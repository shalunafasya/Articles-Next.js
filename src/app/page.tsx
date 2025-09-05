"use client";// app/page.tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome to My App</h1>
      <p>
        <a href="/login" className="text-blue-500 underline">Login Here</a>
      </p>
    </main>
  );
}
