"use client";

import { FaUser } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await axios.post(
        "https://test-fe.mysellerpintar.com/api/auth/login",
        {
          username: data.username,
          password: data.password,
        }
      );

      const { token, username, role } = response.data;
      Cookies.set("token", token, { path: "/" });


      toast.success(`Welcome, ${username}`);

      router.push(role === "Admin" ? "/admin/articles" : "/articles");

    } catch (err: unknown) {
      console.error("Login error:", err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Login failed");
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl text-center">
        {/* Left Section */}
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
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
              <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                <FaUser className="text-gray-400 m-2" />
                <input
                  type="text"
                  placeholder="Username"
                  {...register("username")}
                  defaultValue=""
                  className="bg-gray-100 outline-none text-sm flex-1"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs">{errors.username.message}</p>
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

        {/* Right Section */}
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