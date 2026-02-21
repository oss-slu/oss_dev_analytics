// TimeBased.jsx
// Reusable chart for time-based metrics
// Responsible for transforming data + rendering chart

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/**
 * TimeBased Component
 * @param {Array} data - Array of objects [{ label: string, value: number }]
 * @param {string} repos - Repository name or "All" (default "All")
 * @param {string|null} user - Optional user filter
 */
export default function TimeBased({ data, repos = "All", user = null }) {

  // Loading state (same style as VolumeCharts)
  if (!data) {
    return <div className="p-4 text-center">Loading Chart Data...</div>;
  }

  // Title logic (mirrors VolumeCharts structure)
  let title;

  if (repos === "All") {
    title = "Organization Level Time-Based Data";
  } else if (user) {
    title = `User Level Time-Based Data: ${repos} for ${user}`;
  } else {
    title = `Repository Level Time-Based Data: ${repos}`;
  }

  return (
    <div className="chart-container bg-white p-4 rounded-lg shadow">
      <h3 className="text-center font-semibold mb-4">{title}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}