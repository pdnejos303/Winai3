// FILE: src/lib/gptGenerateTasks.ts
export async function generateTasksFromText(input: string) {
  const res = await fetch("/api/ai-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });

  if (!res.ok) throw new Error("Failed to generate tasks");

  const data = await res.json();
  return data.tasks as {
    title: string;
    description: string;
    dueDate: string;
  }[];
}
