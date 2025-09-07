"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import CustomInput from "../utils/customInput";
import { LoginData } from "./types/formTypes";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include", // if Django uses sessions/cookies
      });
      if (!res.ok) throw new Error("Login failed");
      alert("Logged in successfully!");
    } catch (err) {
      console.error(err);
      alert("Error logging in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/background2.png')] bg-cover bg-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Login</h2>

        <CustomInput
          label="Email"
          type="email"
          error={errors.email}
          {...register("email", { required: "Email is required" })}
        />
        <CustomInput
          label="Password"
          type="password"
          error={errors.password}
          {...register("password", { required: "Password is required" })}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="mt-4 text-center text-gray-600">
          Don&apos;t have an account?
          &nbsp;
          <Link href="/" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
