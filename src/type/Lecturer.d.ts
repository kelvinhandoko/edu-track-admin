import { type api } from "@/trpc/server";

type Lecturer = {
  id: string;
  name: string;
  bio: string;
  userId: string;
  profile: Profile;
};

type LecturerPayload = Pick<Lecturer, "bio" | "name"> &
  Partial<Pick<Lecturer, "id">>;

type FindLecturer = Awaited<ReturnType<typeof api.lecturer.find.query>>;
