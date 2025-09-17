export type Student = {
  id: string;
  name: string;
  email: string;
  username: string;
  matricNo: string;
  pictureUrl?: string | null;
  department?: string | null;
  course?: string | null;
  grade?: string | null;
  score?: number | null;
};

export type StudentFormValues = {
  name: string;
  email: string;
  username: string;
  matricNo: string;
  picture?: FileList;
  department: string;
  course: string;
  score: number | "" | null;
  grade: string;
};
