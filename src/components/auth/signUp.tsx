"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import CustomInput from "../utils/customInput";
import { SignupData } from "./types/formTypes";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "@/app/api/mutations/auth";
import AlertModal from "../utils/alertModal";
import Loader from "../utils/loader";
import toast from "react-hot-toast";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupData>();

  const [createAccount, { loading }] = useMutation(SIGNUP_MUTATION);
  const router = useRouter();
  const [successModal, setSuccessModal] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [username, setUsername] = useState("");

  const onSubmit = async (data: SignupData) => {
    const { username, email, password } = data;

    await createAccount({
      variables: {
        username, email, password
      },
    })
      .then(({ data: signupRes }) => {
        const {
          signup: { message },
        } = signupRes;
        setUsername(username);
        toast.success(message);
        setSuccessModal(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      })
      .catch((err) => {
        setSignupError(err?.message);
        setErrorModal(true);
        toast.error(err?.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/background2.png')] bg-cover bg-center px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          bg-white 
          p-6 sm:p-8 lg:p-10 
          rounded-2xl shadow-lg 
          w-full 
          max-w-sm sm:max-w-md lg:max-w-lg
        "
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center text-blue-600">
          Create Account
        </h2>

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
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "At least 6 characters" },
          })}
        />
        <CustomInput
          label="Confirm Password"
          type="password"
          error={errors.confirmPassword}
          {...register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) =>
              value === watch("password") || "Passwords must match",
          })}
        />

        <button
          type="submit"
          className="
            w-full bg-blue-600 text-white 
            py-2 sm:py-3 
            rounded-lg 
            hover:bg-blue-700 
            transition 
            cursor-pointer 
            text-sm sm:text-base lg:text-lg
          "
          disabled={loading}
        >
          {loading ? <Loader /> : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-gray-600 text-sm sm:text-base">
          Already have an account?
          &nbsp;
          <Link href="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </form>

      <AlertModal
        isOpen={successModal}
        title="Signup Successful"
        subtitle={`Thank you ${username} for signing up!`}
        type="success"
        onClose={() => setSuccessModal(false)}
      />

      <AlertModal
        isOpen={errorModal}
        title="Error Signup"
        subtitle={signupError}
        type="error"
        onClose={() => setErrorModal(false)}
      />
    </div>
  );
}
