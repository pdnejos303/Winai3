// Path: src/components/ai/TextToTaskModal.tsx
"use client";
import { useState } from "react";

export default function TextToTaskModal() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateTasks = async () => {
    setLoading(true);
    const res = await fetch("/api/ai-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: text }),
    });
    const data = await res.json();
    setTasks(data.tasks);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Text To Task</h2>
      <textarea
        className="w-full p-4 border rounded-lg"
        rows={4}
        placeholder="พิมพ์สิ่งที่ต้องทำ เช่น 'พรุ่งนี้ส่งรายงาน ไปซื้อของ เข้าประชุม'"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={generateTasks}
        className="px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "กำลังสร้าง..." : "Generate Task"}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task, i) => (
          <div key={i} className="p-4 rounded-xl shadow border space-y-2">
            <h3 className="text-lg font-bold">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <p className="text-sm">🗓 {task.dueDate}</p>
            <button className="mt-2 px-4 py-1 bg-green-500 text-white rounded">เพิ่มงาน</button>
          </div>
        ))}
      </div>
    </div>
  );
}
