import { useState } from "react";
import { TaskCard, Task } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, ArrowUpDown } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Tasks() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "title" | "duration">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchPattern, setSearchPattern] = useState("");
  const [isRegex, setIsRegex] = useState(false);
  const [caseInsensitive, setCaseInsensitive] = useState(true);

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/tasks", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task created successfully" });
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create task", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest(`/api/tasks/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task updated successfully" });
      setEditingTask(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update task", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/tasks/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task deleted successfully" });
      setDeletingTaskId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete task", variant: "destructive" });
    },
  });

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  let filteredTasks = [...tasks];

  if (searchPattern) {
    try {
      if (isRegex) {
        const regex = new RegExp(searchPattern, caseInsensitive ? "i" : "");
        filteredTasks = filteredTasks.filter(
          (task) =>
            regex.test(task.title) ||
            regex.test(task.tag) ||
            regex.test(task.dueDate)
        );
      } else {
        const pattern = caseInsensitive
          ? searchPattern.toLowerCase()
          : searchPattern;
        filteredTasks = filteredTasks.filter((task) => {
          const title = caseInsensitive ? task.title.toLowerCase() : task.title;
          const tag = caseInsensitive ? task.tag.toLowerCase() : task.tag;
          return title.includes(pattern) || tag.includes(pattern);
        });
      }
    } catch (e) {
    }
  }

  filteredTasks.sort((a, b) => {
    let comparison = 0;
    if (sortBy === "date") {
      comparison = a.dueDate.localeCompare(b.dueDate);
    } else if (sortBy === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === "duration") {
      comparison = a.duration - b.duration;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSubmit = (data: any) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

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
              <DialogDescription>
                Fill in the details below to create a new task
              </DialogDescription>
            </DialogHeader>
            <TaskForm
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <SearchBar
        onSearch={(pattern, regex, caseSensitive) => {
          setSearchPattern(pattern);
          setIsRegex(regex);
          setCaseInsensitive(caseSensitive);
        }}
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort("date")}
          data-testid="button-sort-date"
        >
          <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
          Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort("title")}
          data-testid="button-sort-title"
        >
          <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
          Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort("duration")}
          data-testid="button-sort-duration"
        >
          <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
          Duration {sortBy === "duration" && (sortOrder === "asc" ? "↑" : "↓")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={(task) => {
              setEditingTask(task);
            }}
            onDelete={(id) => setDeletingTaskId(id)}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchPattern
              ? "No tasks match your search"
              : "No tasks yet. Add one to get started!"}
          </p>
        </div>
      )}

      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the task details below
            </DialogDescription>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              initialData={{
                title: editingTask.title,
                dueDate: editingTask.dueDate,
                duration: editingTask.duration.toString(),
                tag: editingTask.tag,
              }}
              onSubmit={handleSubmit}
              onCancel={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingTaskId} onOpenChange={(open) => !open && setDeletingTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingTaskId && deleteMutation.mutate(deletingTaskId)}
              data-testid="button-confirm-delete"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
