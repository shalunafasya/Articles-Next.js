"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

// Schema validasi form
const registerSchema = z.object({
  username: z.string().min(2, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["User", "Admin"]),
});
type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await axios.post(
        "https://test-fe.mysellerpintar.com/api/auth/register",
        {
          username: data.username,
          password: data.password,
          role: data.role,
        }
      );

      toast.success(`Account created for ${data.username}. Please log in.`);
      router.push("/login");
    } catch (err: unknown) {
      console.error("Register error:", err);
      if (axios.isAxiosError(err)) {
        console.log("Error response:", err.response?.data);
        toast.error(err.response?.data?.message || "Registration failed");
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
        <div className="w-full py-5">
          <Image
            src="/images/logocolor.png"
            alt="Logo"
            width={100}
            height={100}
            className=" mx-auto items-center justify-center mt-10"
          ></Image>

          <div className="py-5">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
              <div className="w-64 text-left">
                <p className="font-medium">Username</p>
              </div>

              <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                <input
                  type="text"
                  placeholder="Username"
                  {...register("username")}
                  className="bg-gray-100 outline-none text-sm flex-1"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs">
                  {errors.username.message}
                </p>
              )}

              <div className="w-64 text-left">
                <p className="font-medium">Password</p>
              </div>
              <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className="bg-gray-100 outline-none text-sm flex-1"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}

              <div className="w-64 text-left">
                <p className="font-medium">Role</p>
              </div>
              <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                <select
                  {...register("role")}
                  className="bg-gray-100 outline-none text-sm flex-1"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              {errors.role && (
                <p className="text-red-500 text-xs">{errors.role.message}</p>
              )}

              <button
                type="submit"
                className="border-2 bg-blue-500 text-white rounded w-64 px-12 py-2 inline-block font-semibold hover:border-blue-500 hover:text-blue-500"
              >
                Register
              </button>
            </form>

            <p className="text-gray-500 my-3">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
