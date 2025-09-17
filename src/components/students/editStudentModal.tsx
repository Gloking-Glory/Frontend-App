"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Student, StudentFormValues } from "./types/studentType";
import Loader from "../utils/loader";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null;
  onSave: (values: Partial<Student>) => Promise<void>;
};

export default function EditStudentModal({ isOpen, onClose, student, onSave }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue
} = useForm<StudentFormValues>();
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (student) {
      reset({
        name: student.name,
        email: student.email,
        username: student.username,
        matricNo: student.matricNo,
        department: student.department ?? "",
        course: student.course ?? "",
        score: student.score,
        grade: student.grade ?? "",
      });
      setPreview(student.pictureUrl || null);
    } else {
      reset({
        name: "",
        email: "",
        username: "",
        matricNo: "",
        department: "",
        course: "",
        score: "",
        grade: "",
      });
      setPreview(null);
    }
  }, [student, reset]);

  useEffect(() => {
    const files = watch("picture");
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watch("picture")]);

  if (!isOpen) return null;

  const handle = handleSubmit(async (vals) => {
    setSaving(true);
    try {
      // If picture updated, upload it first (same upload as StudentForm)
      let pictureUrl = student?.pictureUrl;
      if (vals.picture && vals.picture[0]) {
        const fd = new FormData();
        fd.append("file", vals.picture[0]);
        const res = await fetch("/api/upload-image/", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Upload failed");
        const j = await res.json();
        pictureUrl = j.url;
      }
      const payload: Partial<Student> = {
        id: student?.id,
        name: vals.name,
        email: vals.email,
        username: vals.username,
        matricNo: vals.matricNo,
        department: vals.department,
        course: vals.course,
        grade: vals.grade,
        score: vals.score ? Number(vals.score) : null,
        pictureUrl,
      };
      await onSave(payload);
      toast?.success?.("Saved");
      onClose();
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) toast?.error?.(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold">Edit Student</h4>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <form onSubmit={handle}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input {...register("name")} placeholder="Name" className="p-2 border rounded" />
            <input {...register("email")} placeholder="Email" className="p-2 border rounded" />
            <input {...register("username")} placeholder="Username" className="p-2 border rounded" />
            <input {...register("matricNo")} placeholder="Matric No" className="p-2 border rounded" />
            <input {...register("department")} placeholder="Department" className="p-2 border rounded" />
            <input {...register("course")} placeholder="Course" className="p-2 border rounded" />
            <input {...register("score")} placeholder="Score" type="number" className="p-2 border rounded" />
            <input {...register("grade")} placeholder="Grade" className="p-2 border rounded" />
            <div>
              <label className="block mb-1">Photo</label>
              <input type="file" {...register("picture")} />
            </div>
            <div className="w-24 h-24 rounded overflow-hidden">
              {preview ? <img src={preview} className="object-cover w-full h-full" alt="preview" /> : <div className="text-gray-400">No image</div>}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
              {saving ? <><Loader /> Saving...</> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
