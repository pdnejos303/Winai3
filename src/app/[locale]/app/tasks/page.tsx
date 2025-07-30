// Path: src/app/[locale]/app/tasks/page.tsx
import TaskGrid from "@/components/task/TaskGrid";
import TaskViewSwitcher from "@/components/task/TaskViewSwitcher";

export const metadata = { title: "Tasks" };

export default function TasksPage() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <TaskViewSwitcher />
    </main>
  );
}
