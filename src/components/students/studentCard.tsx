"use client";
import Image from "next/image";
import { Student } from "./types/studentType";

export default function StudentCard({ student }: { student: Student }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex gap-4 items-center">
      <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
        {student.pictureUrl ? (
          <Image src={student.pictureUrl} alt={student.name} width={96} height={96} className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Img</div>
        )}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{student.name} <span className="text-sm text-gray-500">({student.username})</span></div>
        <div className="text-sm text-gray-600">{student.department} — {student.course}</div>
        <div className="text-sm text-gray-700 mt-2">Matric: {student.matricNo}</div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold">{student.grade}</div>
        <div className="text-sm text-gray-600">{student.score}</div>
      </div>
    </div>
  );
}
