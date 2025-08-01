// FILE: src/components/task/generator/TaskGenerateForm.tsx
"use client";

import { useState } from "react";
import { generateTasksFromText } from "@/lib/gptGenerateTasks";
import { AITask } from "@/types/ai-task";
import TaskPreviewList from "./TaskPreviewList";
import TaskGenerateButton from "./TaskGenerateButton";

export default function TaskGenerateForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const generated = await generateTasksFromText(input);
      setTasks(generated);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold text-gray-800">AI Task Generator</h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={5}
        className="w-full border rounded-md p-3 text-sm"
        placeholder="Describe your work, plans, or goals in a paragraph..."
      />

      <TaskGenerateButton onClick={handleGenerate} loading={loading} />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <TaskPreviewList tasks={tasks} />
    </div>
  );
}
