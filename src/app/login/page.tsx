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
import Link from "next/link";
import Image from "next/image";

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
      <div className="bg-white rounded-2xl shadow-2xl flex w-[400px] text-center">
        <div className="w-full p-5">
            <Image src="/images/logocolor.png" alt="Logo" width={100} height={100} className=" mx-auto items-center justify-center mt-10"></Image>
          
          <div className="py-5">

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
                className="border-2 bg-blue-500 text-white rounded px-12 py-2 font-semibold hover:bg-white hover:text-blue-500 mt-3 w-64"
              >
                Log In
              </button>
            </form>

            <p className="text-gray-500 my-3">
              Dont have an account?{" "}<Link href="/register" className="text-blue-500">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}