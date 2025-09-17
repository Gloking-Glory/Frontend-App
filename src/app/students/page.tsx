"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { GET_STUDENTS } from "@/app/api/queries/students";
import { Student } from "@/app/components/students/types/studentType";
import { DELETE_STUDENT, UPDATE_STUDENT } from "@/app/api/mutations/students";
import Loader from "@/app/components/utils/loader";
import StudentForm from "@/app/components/students/studentForm";
import ToggleView from "@/app/components/students/toggleView";
import StudentCard from "@/app/components/students/studentCard";
import StudentTable from "@/app/components/students/studentTable";
import EditStudentModal from "@/app/components/students/editStudentModal";
import { dummyStudents } from "./dummyStudents";

type GetStudentsResponse = {
  students: Student[];
};

export default function StudentsManagerPage() {
  const { data, loading, error } = useQuery(GET_STUDENTS);
//   const students: Student[] = data?.students || [];
  const students: Student[] = dummyStudents || [];


  const [view, setView] = useState<"cards" | "table">("cards");
  const [editing, setEditing] = useState<Student | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [updateStudentMutation] = useMutation(UPDATE_STUDENT);
  const [deleteStudentMutation] = useMutation(DELETE_STUDENT);

  async function handleEditSave(payload: Partial<Student>) {
    try {
      await updateStudentMutation({
        variables: payload,
        update(cache, { data }) {
          const updated = data?.updateStudent;
          if (!updated) return;
          // read existing
          const existing = cache.readQuery<GetStudentsResponse>({ query: GET_STUDENTS });

          if (!existing) return;
          cache.writeQuery<GetStudentsResponse>({
            query: GET_STUDENTS,
            data: {
              students: existing.students.map((s: Student) => (s.id === updated.id ? updated : s))
            }
          });
        }
      });
      toast.success("Updated");
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) toast.error(e.message || "Update failed");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete student?")) return;
    try {
      await deleteStudentMutation({
        variables: { id },
        update(cache, { data }) {
          const deletedId = data?.deleteStudent?.id;
          if (!deletedId) return;
          const existing = cache.readQuery<GetStudentsResponse>({ query: GET_STUDENTS });

          if (!existing) return;

          cache.writeQuery<GetStudentsResponse>({
            query: GET_STUDENTS,
            data: {
              students: existing.students.filter((s: Student) => s.id !== deletedId)
            }
          });
        }
      });
      toast.success("Deleted");
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) toast.error("Delete failed");
    }
  }

  return (
    <div className="p-6 space-y-6 bg-[url('/images/background.png')] bg-cover bg-center">
      <div className="grid md:grid-cols-2 gap-6">
        <StudentForm />
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Students</h3>
            <ToggleView view={view} onChange={setView} />
          </div>

          {view === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {students.map((s) => (
                <div key={s.id} onDoubleClick={() => { setEditing(s); setModalOpen(true); }}>
                  <StudentCard student={s} />
                </div>
              ))}
            </div>
          ) : (
            <StudentTable students={students} onEdit={(s) => { setEditing(s); setModalOpen(true); }} onDelete={handleDelete} />
          )}
        </div>
      </div>

      <EditStudentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={editing}
        onSave={handleEditSave}
      />
    </div>
  );
}
