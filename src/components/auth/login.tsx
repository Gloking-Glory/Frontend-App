"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import CustomInput from "../utils/customInput";
import { LoginData } from "./types/formTypes";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { LOGIN_MUTATION } from "@/app/api/mutations/auth";
import { useState } from "react";
import AlertModal from "../utils/alertModal";
import toast from "react-hot-toast";
import Loader from "../utils/loader";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loginError, setLoginError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const onSubmit = async (data: LoginData) => {
    const { username, password } = data;
    setUsername(username);
    await login({
      variables: {
        username, password
      } 
    }).then(({ data: loginRes }) => {
      console.log(loginRes);
      const { login: { token } } = loginRes;
      setSuccessModal(true);
      localStorage.setItem("token", token);
        // router.push("/flyCards");
    }).catch((err) => {
      console.log(err);
      setLoginError(err?.message); 
      setErrorModal(true);
      toast.error(err?.message);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/background2.png')] bg-cover bg-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Login</h2>

        {/* <CustomInput
          label="Email"
          type="email"
          error={errors.email}
          {...register("email", { required: "Email is required" })}
        /> */}
        <CustomInput
          label="Username"
          error={errors.username}
          {...register("username", { required: "Username is required" })}
        />
        <CustomInput
          label="Password"
          type="password"
          error={errors.password}
          {...register("password", { required: "Password is required" })}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          disabled={loading}
        >
          {loading ? <Loader />
             : "Login"
            }
        </button>

        <p className="mt-4 text-center text-gray-600">
          Don&apos;t have an account?
          &nbsp;
          <Link href="/" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>

      <AlertModal
        isOpen={successModal}
        title="Login Successful"
        subtitle={`Thank you for logging in! ${username}` }
        type="success"
        onClose={() => setSuccessModal(false)}
      />

      <AlertModal
        isOpen={errorModal}
        title="Error Login"
        subtitle={loginError}
        type="error"
        onClose={() => setErrorModal(false)}
      />
    </div>
  );
}
