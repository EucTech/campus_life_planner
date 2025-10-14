import { StatsCard } from "../StatsCard";
import { Clock, ListTodo, Tag, TrendingUp } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <StatsCard title="Total Tasks" value={12} icon={ListTodo} trend="+3 this week" trendUp />
      <StatsCard title="Total Hours" value="24.5" icon={Clock} trend="12 hours remaining" />
      <StatsCard title="Top Tag" value="Study" icon={Tag} />
      <StatsCard title="Completion Rate" value="75%" icon={TrendingUp} trend="+5% from last week" trendUp />
    </div>
  );
}
