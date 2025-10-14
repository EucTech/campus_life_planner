import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskFormData {
  title: string;
  dueDate: string;
  duration: string;
  tag: string;
}

interface TaskFormProps {
  onSubmit?: (data: TaskFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<TaskFormData>;
}

export function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || "",
    dueDate: initialData?.dueDate || "",
    duration: initialData?.duration || "",
    tag: initialData?.tag || "Assignment",
  });

  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

  const validate = () => {
    const newErrors: Partial<TaskFormData> = {};

    if (!/^\S(?:.*\S)?$/.test(formData.title)) {
      newErrors.title = "Title cannot have leading/trailing spaces";
    }

    if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(formData.dueDate)) {
      newErrors.dueDate = "Invalid date format (YYYY-MM-DD)";
    }

    if (!/^(0|[1-9]\d*)$/.test(formData.duration)) {
      newErrors.duration = "Duration must be a valid number";
    }

    if (!/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/.test(formData.tag)) {
      newErrors.tag = "Tag can only contain letters, spaces, and hyphens";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit?.(formData);
      console.log("Form submitted:", formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Complete Math Assignment"
            data-testid="input-title"
          />
          {errors.title && (
            <p className="text-sm text-destructive" role="status">
              {errors.title}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date (YYYY-MM-DD) *</Label>
          <Input
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            placeholder="2025-10-20"
            data-testid="input-due-date"
          />
          {errors.dueDate && (
            <p className="text-sm text-destructive" role="status">
              {errors.dueDate}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes) *</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="60"
            data-testid="input-duration"
          />
          {errors.duration && (
            <p className="text-sm text-destructive" role="status">
              {errors.duration}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tag">Tag *</Label>
          <Select value={formData.tag} onValueChange={(value) => setFormData({ ...formData, tag: value })}>
            <SelectTrigger id="tag" data-testid="select-tag">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Assignment">Assignment</SelectItem>
              <SelectItem value="Study">Study</SelectItem>
              <SelectItem value="Project">Project</SelectItem>
              <SelectItem value="Exam">Exam</SelectItem>
              <SelectItem value="Reading">Reading</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.tag && (
            <p className="text-sm text-destructive" role="status">
              {errors.tag}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" data-testid="button-submit">
          {initialData ? "Update Task" : "Add Task"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
