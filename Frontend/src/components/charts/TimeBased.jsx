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
 * @param {string} title - Optional custom title for the chart
 */
export default function TimeBased({ data, repos = "All", user = null, titleCustom = null}) {

  // Loading state (same style as VolumeCharts)
  if (!data) {
    return <div className="p-4 text-center">Loading Chart Data...</div>;
  }
  let title;
  // Title logic (mirrors VolumeCharts structure)
  if (titleCustom) {
    title = titleCustom;
  }
  else{
    if (repos === "All") {
      title = "Time-Based Data";
  } else if (user) {
      title = `User Level Time-Based Data: ${repos} for ${user}`;
  } else {
      title = `Repository Level Time-Based Data: ${repos}`;
  }
  }


  return (
    <div className="chart-container"/*className="chart-container bg-white p-4 rounded-lg shadow"*/>
      <h3 className="text-center font-semibold mb-4">{title}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="label" 
          tick={{ fill: "#000000"}}/>
          <YAxis 
          tick={{ fill: "#000000"}}/>
          <Tooltip />
          <Bar dataKey="value" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}