"use client";

import { FaEnvelope } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { fakeLogin } from "@/lib/fakeAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginForm) => {
    console.log("Submit data:", data);
    try {
      const { user } = fakeLogin(data.email, data.password);
      console.log("User found:", user);
      Cookies.set("token", "dummy-token-" + user.role, { path: "/" });
      toast.success(`Welcome, ${user.name}`);
      console.log("Redirecting to:", user.role === "admin" ? "/admin/articles" : "/articles");
      router.push(user.role === "admin" ? "/admin/articles" : "/articles");

    } catch (err: unknown) {
      console.error("Login error:", err); 
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl text-center">
        <div className="w-3/5 p-5">
          <div className="text-left font-bold">
            <span className="text-blue-500">Logo</span>Ipsum
          </div>
          <div className="py-10">
            <h2 className="text-3xl font-bold text-blue-500 mb-2">
              Log in to Account
            </h2>
            <div className="border-2 w-10 border-blue-500 inline-block mb-2"></div>
            <p className="text-1xl font-bold my-3">Hello, Welcome Back 👋</p>
            <p className="text-gray-500 my-3">
              Log in to your account to read and manage articles.
            </p>

            <form
              key="login-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
              <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                <FaEnvelope className="text-gray-400 m-2" />
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register("email")}
                  defaultValue=""
                  className="bg-gray-100 outline-none text-sm flex-1"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}

              <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                <MdLock className="text-gray-400 m-2" />
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  defaultValue=""
                  className="bg-gray-100 outline-none text-sm flex-1"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}

              <button
                type="submit"
                className="border-2 border-blue-500 text-blue-500 rounded-full px-12 py-2 font-semibold hover:bg-blue-500 hover:text-white mt-3"
              >
                Log In
              </button>
            </form>
          </div>
        </div>

        <div className="w-2/5 bg-blue-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
          <h2 className="text-3xl font-bold mb-2">Hello, User!</h2>
          <div className="border-2 w-10 border-white inline-block mb-2"></div>
          <p className="mb-2">
            Fill up personal information and start journey with us
          </p>
          <a
            href="/register"
            className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-blue-500"
          >
            Register
          </a>
        </div>
      </div>
    </main>
  );
}
