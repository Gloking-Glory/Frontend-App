"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import Loader from "../utils/loader";
import { CREATE_STUDENT } from "@/app/api/mutations/students";
import { GET_STUDENTS } from "@/app/api/queries/students";
import { Student, StudentFormValues } from "./types/studentType";

export default function StudentForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors } } = useForm<StudentFormValues>({
    defaultValues: { score: "", grade: "" }
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // compute grade automatically whenever score changes
  const score = watch("score");
  useEffect(() => {
    const gradeLevel = Number(score || 0);
    // grade mapping (configurable): >=70 A, >=60 B, >=50 C, >=45 D, else F
    let finalGrade = "";
    if (!score && score !== 0) { finalGrade = ""; }
    else if (gradeLevel >= 70) finalGrade = "A";
    else if (gradeLevel >= 60) finalGrade = "B";
    else if (gradeLevel >= 50) finalGrade = "C";
    else if (gradeLevel >= 45) finalGrade = "D";
    else finalGrade = "F";
    setValue("grade", finalGrade);
  }, [score, setValue]);

  // update preview when file selected
  useEffect(() => {
    const files = (watch("picture") as FileList) || undefined;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [watch("picture")]);

  const [createStudent, { loading }] = useMutation(CREATE_STUDENT);

  async function uploadImage(file: File): Promise<string | null> {
    // Upload file to your Django upload endpoint; returns URL string
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload-image/", { method: "POST", body: fd }); // create this endpoint in Django (see backend steps)
    if (!res.ok) throw new Error("Image upload failed");
    const json = await res.json();
    return json.url; // expected { url: "https://..." }
  }

  const onSubmit = async (data: StudentFormValues) => {
    let pictureUrl: string | null = null;

    if (data.picture && data.picture[0]) {
      setUploading(true);
      pictureUrl = await uploadImage(data.picture[0]);
      setUploading(false);
    }

    const variables = {
      name: data.name,
      email: data.email,
      username: data.username,
      matricNo: data.matricNo,
      pictureUrl,
      department: data.department || null,
      course: data.course || null,
      grade: data.grade || null,
      score: data.score ? Number(data.score) : null,
    };

    await createStudent({
      variables,
      // update cache: prepend new student to GET_STUDENTS list
      update(cache, { data }) {
        const newStudent = data?.createStudent;
        if (!newStudent) return;
        try {
          const existing = cache.readQuery<{ students: Student[] }>({
            query: GET_STUDENTS,
          });

          cache.writeQuery({
            query: GET_STUDENTS,
            data: { students: [newStudent, ...(existing?.students || [])] },
          });
        } catch {
          // if cache empty, write fresh
          cache.writeQuery({
            query: GET_STUDENTS,
            data: { students: [newStudent] },
          });
        }
      },
      optimisticResponse: {
        createStudent: {
          __typename: "Student",
          id: "temp-id-" + Math.random().toString(36).slice(2, 9),
          ...variables,
        },
      },
    }).then(({ data }) => {
      toast.success("Student created");
      reset({ score: "", grade: "" });
      setPreview(null);
      console.log(data)
    }).catch ((err: unknown) => {
      console.error(err);
      if (err instanceof Error) toast.error(err.message || "Create failed");
      setUploading(false);
    });
  };  

  return (
    <div className="min-h-screen flex items-start justify-center p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-orange-200 text-black p-6 rounded-xl shadow-md max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">Register Student</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input {...register("name", { required: "Name required" })} placeholder="Full name" className="p-2 border rounded" />
          <input {...register("email", { required: "Email required" })} placeholder="Email" type="email" className="p-2 border rounded" />
          <input {...register("username", { required: "Username required" })} placeholder="Username" className="p-2 border rounded" />
          <input {...register("matricNo", { required: "Matric No required" })} placeholder="Matric No" className="p-2 border rounded" />

          <select {...register("department")} className="p-2 border rounded">
            <option value="">Select department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Physics">Physics</option>
            <option value="Biology">Biology</option>
          </select>

          <input {...register("course")} placeholder="Course" className="p-2 border rounded" />

          <input {...register("score", { valueAsNumber: true })} placeholder="Score (number)" type="number" className="p-2 border rounded" />
          <input {...register("grade")} placeholder="Grade (auto)" readOnly className="p-2 border rounded" />
        </div>

        <div className="mt-3 flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Photo</label>
            <input type="file" accept="image/*" {...register("picture")} />
          </div>

          <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
            {preview ? (
              // simple img preview. If you prefer Next/Image, replace it here
              <img src={preview} alt="preview" className="object-cover w-full h-full" />
            ) : (
              <span className="text-xs text-gray-400">No photo</span>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
          >
            {(loading || uploading) ? <><Loader /> Saving...</> : "Save Student"}
          </button>
        </div>
        {/* inline field errors (simple) */}
        <div className="mt-2 text-sm text-red-600">
          {errors.name?.message && <div>{errors.name.message}</div>}
          {errors.email?.message && <div>{errors.email.message}</div>}
        </div>
      </form>
    </div>
  );
}
