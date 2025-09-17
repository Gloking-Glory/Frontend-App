"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "@/app/api/mutations/auth";
import toast from "react-hot-toast";
import Loader from "../utils/loader";
import CustomInput from "../utils/customInput";
import { g } from "framer-motion/client";


export type SearchType = {
  search: string;
};

export type NameType = {
  firstname: string;
};

export type ApiNameType = {
  firstname: string;
};

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchType>();

  const [createAccount, { loading }] = useMutation(SIGNUP_MUTATION);
  const router = useRouter();
  const apiUrl = "https://api.mockae.com/fakeapi/users";

  const myArr = [ 1, 2, 3, 4 ];
  const [ a, b, c, d ] = myArr;
  const info = { name: 'Ade', school: 'Back' };
  const myInfo = { name: 'Shola', age: 38, city: 'Ibadan' };
  const { school, name: infoName } = info;
  const { name: myName, age, city } = myInfo;

  const onSubmit = async (data: SearchType) => {
    console.log(data);
    const { search } = data;
    console.log(search);
    const { data: queryData, loading, error } = useQuery(
      ['users', search],
      async () => {
        const res = await fetch(apiUrl);
        const data: NameType[] = await res.json();

        console.log(data);

        const filtered = data.find(
          (name: NameType) => name.firstname === search
        );

        return filtered;
      }
    );
    // await fetch(apiUrl)
    //   .then(res => {
    //     if (!res.ok) return alert ('Error Fetching');
    //     return res.json();
    //   })
    //   .then(data => {
    //     console.log(data);
    //     const filteredData = data.find 
    //   });
  };


  const functionExample = (func: SearchType) => {
    const { e, f, g } = func; 
    console.log(func)
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/background2.png')] bg-cover bg-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Search Here</h2>
        {functionExample({'e', 'f', 'g'})}

        <CustomInput
          label="Search here"
          error={errors.search}
          {...register("search", { required: "Search is required" })}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          disabled={loading}
        >
          {loading ? <Loader />
            : "Search here"
            }
        </button>
      </form>
    </div>
  );
}
