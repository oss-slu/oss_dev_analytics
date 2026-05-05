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
            <CartesianGrid stroke="#E5E7EB" strokeOpacity={0.6} />

            <XAxis
              type="number"
              dataKey="timeContributing"
              name="Time Contributing"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              label={{
                value: "Contributor Activity Level",
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
              range={[30, 180]}
              name="PRs Opened"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
              }}
              formatter={(value, name) => {
                if (name === "timeContributing") 
                    return [value, "Time Contributing"];
                if (name === "issuesClosed") 
                    return [value, "Issues Closed"];
                if (name === "prsOpened") 
                    return [value, "PRs Opened"];
                return [value, name];
              }}
              labelFormatter={(label, payload) =>
                payload?.[0]?.payload?.name || "Contributor"
              } 
            />

            <Scatter 
                data={data} 
                fill="#3B82F6" 
                fillOpacity={0.65}
                stroke="#2563EB"
                strokeWidth={0.5} 
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Each bubble represents a contributor. The X-axis shows time contributing,
        the Y-axis shows issues closed, and larger bubbles indicate more pull
        requests opened.
      </div>
    </div>
  );
};