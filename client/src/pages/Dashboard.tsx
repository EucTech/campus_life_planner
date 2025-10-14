import { StatsCard } from "@/components/StatsCard";
import { TaskCard, Task } from "@/components/TaskCard";
import { BarChart } from "@/components/BarChart";
import { Clock, ListTodo, Tag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/tasks/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete task", variant: "destructive" });
    },
  });

  const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);
  const recentTasks = tasks.slice(0, 5);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const chartData = last7Days.map((date, index) => {
    const tasksOnDay = tasks.filter(
      (task) => task.createdAt.split("T")[0] === date
    ).length;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = new Date(date).getDay();
    return {
      label: days[dayOfWeek],
      value: tasksOnDay,
    };
  });

  const tagCounts = tasks.reduce((acc, task) => {
    acc[task.tag] = (acc[task.tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your academic overview.
          </p>
        </div>
        <Link href="/tasks">
          <Button data-testid="button-add-task">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={tasks.length}
          icon={ListTodo}
          trend={`${tasks.length > 0 ? "+" : ""}${tasks.length} total`}
          trendUp={tasks.length > 0}
        />
        <StatsCard
          title="Total Hours"
          value={`${(totalDuration / 60).toFixed(1)}h`}
          icon={Clock}
          trend={`${totalDuration} minutes`}
        />
        <StatsCard title="Top Tag" value={topTag} icon={Tag} />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={TrendingUp}
          trend={`${completedTasks}/${tasks.length} completed`}
          trendUp={completionRate > 50}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Recent Tasks</h2>
          {recentTasks.length > 0 ? (
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No tasks yet. Click "Add Task" to get started!
            </p>
          )}
        </div>

        <div className="space-y-4">
          <BarChart data={chartData} />
          <div
            className="mt-4 p-4 bg-card rounded-md border"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm font-medium">Duration Cap Status</p>
            <p className="text-muted-foreground text-sm mt-1">
              {totalDuration} minutes used of 500 minute weekly target
            </p>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${Math.min((totalDuration / 500) * 100, 100)}%` }}
              />
            </div>
            {totalDuration > 500 && (
              <p className="text-sm text-warning mt-2" aria-live="assertive">
                {totalDuration - 500} minutes over target!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
