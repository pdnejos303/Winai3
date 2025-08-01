// FILE: src/components/task/generator/TaskPreviewList.tsx
import { AITask } from "@/types/ai-task";

interface Props {
  tasks: AITask[];
}

export default function TaskPreviewList({ tasks }: Props) {
  if (tasks.length === 0) return null;

  return (
    <div className="space-y-3 pt-4 border-t">
      <h3 className="text-lg font-semibold text-gray-700">Generated Tasks:</h3>
      <ul className="space-y-2">
        {tasks.map((task, idx) => (
          <li
            key={idx}
            className="p-3 bg-gray-100 rounded-md text-sm text-gray-800"
          >
            <strong>{task.title}</strong> – {task.description}
            <div className="text-xs text-gray-500">Due: {task.dueDate}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
