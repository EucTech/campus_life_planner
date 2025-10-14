import { useState } from "react";
import { TaskCard, Task } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, ArrowUpDown } from "lucide-react";

export default function Tasks() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "title" | "duration">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  //todo: remove mock functionality
  const tasks: Task[] = [
    {
      id: "1",
      title: "Complete Math Assignment",
      dueDate: "2025-10-15",
      duration: 120,
      tag: "Assignment",
      status: "urgent",
      createdAt: "2025-10-14T10:00:00Z",
      updatedAt: "2025-10-14T10:00:00Z",
    },
    {
      id: "2",
      title: "Study for Physics Exam",
      dueDate: "2025-10-17",
      duration: 180,
      tag: "Study",
      status: "dueSoon",
      createdAt: "2025-10-14T11:00:00Z",
      updatedAt: "2025-10-14T11:00:00Z",
    },
    {
      id: "3",
      title: "Project Presentation Prep",
      dueDate: "2025-10-20",
      duration: 90,
      tag: "Project",
      status: "onTrack",
      createdAt: "2025-10-14T12:00:00Z",
      updatedAt: "2025-10-14T12:00:00Z",
    },
    {
      id: "4",
      title: "Read Chemistry Chapter 5",
      dueDate: "2025-10-18",
      duration: 60,
      tag: "Reading",
      status: "dueSoon",
      createdAt: "2025-10-14T13:00:00Z",
      updatedAt: "2025-10-14T13:00:00Z",
    },
  ];

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    console.log("Sort by:", field, sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage your assignments and deadlines
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-task">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              onSubmit={(data) => {
                console.log("Task added:", data);
                setIsFormOpen(false);
              }}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <SearchBar
        onSearch={(pattern, isRegex, caseInsensitive) =>
          console.log("Search:", { pattern, isRegex, caseInsensitive })
        }
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort("date")}
          data-testid="button-sort-date"
        >
          <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
          Date
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort("title")}
          data-testid="button-sort-title"
        >
          <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
          Title
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort("duration")}
          data-testid="button-sort-duration"
        >
          <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
          Duration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={(task) => console.log("Edit:", task)}
            onDelete={(id) => console.log("Delete:", id)}
          />
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks yet. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}
