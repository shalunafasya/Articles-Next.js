"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

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
      <div className="bg-blue-500 rounded-2xl shadow-2xl flex w-2/3 max-w-4xl text-center text-white">
        {/* Left Section */}
        <div className="w-2/5 flex flex-col items-center justify-center px-10">
          <h2 className="text-3xl font-bold mb-2">Hello, User!</h2>
          <div className="border-2 w-10 border-white inline-block mb-2"></div>
          <p className="mb-2">Already have an account?</p>
          <a
            href="/login"
            className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-blue-500"
          >
            Login
          </a>
        </div>

        {/* Register Form */}
        <div className="w-3/5 bg-white text-blue-500 rounded-tr-2xl rounded-br-2xl py-10 px-12">
          <div className="text-left font-bold">
            <span className="text-black">Logo</span>Ipsum
          </div>
          <div className="py-10">
            <h2 className="text-3xl font-bold text-blue-500 mb-2">Register</h2>
            <div className="border-2 w-10 border-blue-500 inline-block mb-2"></div>
            <p className="text-1xl text-black font-bold my-3">
              Hello, Welcome to our page 👋
            </p>
            <p className="text-gray-500 my-3">
              Fill up personal information and start journey with us
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
              <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                <input
                  type="text"
                  placeholder="Username"
                  {...register("username")}
                  className="bg-gray-100 outline-none text-sm flex-1"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs">{errors.username.message}</p>
              )}

              <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className="bg-gray-100 outline-none text-sm flex-1"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}

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
                className="border-2 border-blue-500 text-blue-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-500 hover:text-white"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
