import { StatsCard } from "@/components/StatsCard";
import { TaskCard, Task } from "@/components/TaskCard";
import { BarChart } from "@/components/BarChart";
import { Clock, ListTodo, Tag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
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
  ];

  const chartData = [
    { label: "Mon", value: 4 },
    { label: "Tue", value: 7 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 8 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 2 },
    { label: "Sun", value: 6 },
  ];

  const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);

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
          trend="+3 this week"
          trendUp
        />
        <StatsCard
          title="Total Hours"
          value={`${(totalDuration / 60).toFixed(1)}h`}
          icon={Clock}
          trend="12h remaining"
        />
        <StatsCard title="Top Tag" value="Study" icon={Tag} />
        <StatsCard
          title="Completion Rate"
          value="75%"
          icon={TrendingUp}
          trend="+5% from last week"
          trendUp
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Recent Tasks</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(task) => console.log("Edit:", task)}
                onDelete={(id) => console.log("Delete:", id)}
              />
            ))}
          </div>
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
                style={{ width: `${(totalDuration / 500) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
