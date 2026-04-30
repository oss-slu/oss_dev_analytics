import React from "react";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const ContributorImpactChart = ({ data }) => {

  return (
    <div className="bg-[#F5F7FB] rounded-xl p-5 shadow-sm w-full">
      <h3 className="text-[#1F3A68] font-semibold text-md mb-4">
        Contributor Impact Map
      </h3>

      {/* Chart Container */}
      <div className="bg-white rounded-lg p-4">
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart>
            <CartesianGrid stroke="#E5E7EB" />

            <XAxis
              type="number"
              dataKey="commits"
              name="Commits"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              label={{
                value: "Commits (Experience)",
                position: "insideBottom",
                offset: -5,
                fill: "#6B7280",
                fontSize: 12,
              }}
            />

            <YAxis
              type="number"
              dataKey="issuesClosed"
              name="Issues Closed"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              label={{
                value: "Issues Closed",
                angle: -90,
                position: "insideLeft",
                fill: "#6B7280",
                fontSize: 12,
              }}
            />

            <ZAxis
              type="number"
              dataKey="prsOpened"
              range={[40, 300]}
              name="PRs Opened"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value, name) => [value, name]}
              labelFormatter={(label, payload) =>
                payload?.[0]?.payload?.name || ""
              }
            />

            <Scatter data={data} fill="#3B82F6" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Each bubble represents a contributor. Larger bubbles indicate more pull
        requests opened, while position reflects experience (commits) and impact
        (issues closed).
      </div>
    </div>
  );
};
