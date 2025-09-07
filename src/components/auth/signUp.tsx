"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import CustomInput from "../utils/customInput";
import { SignupData } from "./types/formTypes";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupData>();

  const onSubmit = async (data: SignupData) => {
    try {
      const res = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Signup failed");
      alert("Account created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error signing up");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/background2.png')] bg-cover bg-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Create Account</h2>

        <CustomInput
          label="Username"
          error={errors.username}
          {...register("username", { required: "Username is required" })}
        />
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
          {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
        />
        <CustomInput
          label="Confirm Password"
          type="password"
          error={errors.confirmPassword}
          {...register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) => value === watch("password") || "Passwords must match",
          })}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?
          &nbsp;
          <Link href="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
