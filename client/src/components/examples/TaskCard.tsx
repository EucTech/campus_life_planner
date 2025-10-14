import { TaskCard } from "../TaskCard";

export default function TaskCardExample() {
  const task = {
    id: "1",
    title: "Complete Math Assignment",
    dueDate: "2025-10-20",
    duration: 120,
    tag: "Assignment",
    status: "dueSoon" as const,
    createdAt: "2025-10-14T10:00:00Z",
    updatedAt: "2025-10-14T10:00:00Z",
  };

  return (
    <div className="p-4 max-w-md">
      <TaskCard
        task={task}
        onEdit={(task) => console.log("Edit task:", task)}
        onDelete={(id) => console.log("Delete task:", id)}
      />
    </div>
  );
}
