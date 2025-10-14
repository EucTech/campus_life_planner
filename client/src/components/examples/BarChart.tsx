import { BarChart } from "../BarChart";

export default function BarChartExample() {
  const data = [
    { label: "Mon", value: 4 },
    { label: "Tue", value: 7 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 8 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 2 },
    { label: "Sun", value: 6 },
  ];

  return (
    <div className="p-4 max-w-2xl">
      <BarChart data={data} />
    </div>
  );
}
