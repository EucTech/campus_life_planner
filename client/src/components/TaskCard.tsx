import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  duration: number;
  tag: string;
  status: "urgent" | "dueSoon" | "onTrack" | "completed";
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const statusColors = {
    urgent: "border-l-status-urgent",
    dueSoon: "border-l-status-dueSoon",
    onTrack: "border-l-status-onTrack",
    completed: "border-l-status-completed",
  };

  const statusLabels = {
    urgent: "Due within 24h",
    dueSoon: "Due within 3 days",
    onTrack: "On Track",
    completed: "Completed",
  };

  return (
    <Card className={cn("border-l-4", statusColors[task.status], "hover-elevate transition-shadow")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold" data-testid={`task-title-${task.id}`}>
            {task.title}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit?.(task)}
              data-testid={`button-edit-${task.id}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete?.(task.id)}
              data-testid={`button-delete-${task.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {task.duration} min
          </Badge>
          <Badge variant="secondary">{task.tag}</Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span data-testid={`task-due-${task.id}`}>{task.dueDate}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {statusLabels[task.status]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
