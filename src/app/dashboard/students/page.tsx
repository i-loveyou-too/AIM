import { StudentDirectory } from "@/components/students/student-directory";
import { students } from "@/lib/mock-data/index";

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <StudentDirectory students={students} />
    </div>
  );
}
