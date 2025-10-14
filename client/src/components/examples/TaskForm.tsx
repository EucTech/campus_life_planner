import { TaskForm } from "../TaskForm";

export default function TaskFormExample() {
  return (
    <div className="p-4 max-w-2xl">
      <TaskForm
        onSubmit={(data) => console.log("Form submitted:", data)}
        onCancel={() => console.log("Form cancelled")}
      />
    </div>
  );
}
