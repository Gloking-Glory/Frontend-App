"use client";

import { Student } from "./types/studentType";

export default function StudentTable({
  students,
  onEdit,
  onDelete,
}: {
  students: Student[];
  onEdit: (s: Student) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-auto bg-orange-200 p-4 text-black rounded shadow">
      <table className="min-w-full divide-y">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">Matric No</th>
            <th className="px-4 py-2 text-left">Department</th>
            <th className="px-4 py-2 text-left">Course</th>
            <th className="px-4 py-2 text-left">Score</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {students.map((s) => (
            <tr key={s.id}>
              <td className="px-4 py-2">{s.name}</td>
              <td className="px-4 py-2">{s.email}</td>
              <td className="px-4 py-2">{s.username}</td>
              <td className="px-4 py-2">{s.matricNo}</td>
              <td className="px-4 py-2">{s.department}</td>
              <td className="px-4 py-2">{s.course}</td>
              <td className="px-4 py-2">{s.score}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(s)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => onDelete(s.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
