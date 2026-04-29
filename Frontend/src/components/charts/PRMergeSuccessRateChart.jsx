import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import { getPRMergeRates } from "../../utils/prMergeRateHelper";

const PRMergeSuccessRateChart = ({ selectedTeam }) => {
  const data = getPRMergeRates(selectedTeam);

  return (
    <div>
      <h3>
        PR Merge Success Rate{" "}
        <span
          style={{
            position: "relative",
            display: "inline-block",
            marginLeft: "6px"
          }}
        >
          <span
            tabIndex="0"
            aria-label="PR Merge Success Rate info"
            style={{ 
              cursor: "pointer", 
              border: "1px solid black", 
              borderRadius: "50%", 
              padding: "2px 6px", 
              fontSize: "12px",
              display: "inline-block" 
            }}
            onMouseEnter={(e) => {
              const tooltip = e.currentTarget.nextElementSibling;
              if (tooltip) {
                tooltip.style.visibility = "visible";
                tooltip.style.opacity = "1";
              }
            }}
            onMouseLeave={(e) => {
              const tooltip = e.currentTarget.nextElementSibling;
              if (tooltip) {
                tooltip.style.visibility = "hidden";
                tooltip.style.opacity = "0";
              }
            }}
          > 
            i
          </span>

          <span
            style={{
              visibility: "hidden",
              opacity: 0,
              transition: "opacity 0.2s ease",
              position: "absolute",
              top: "28px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#f9fafb",
              color: "#374151",
              padding: "8px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "1.4",
              width: "260px",
              zIndex: 1000,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "left",
              border: "1px solid #e5e7eb"
            }}
          >
            This chart compares each contributor’s lifetime PR merge success rate with their recent sprint performance. It helps show both long-term consistency and current activity.
          </span>
        </span>
      </h3>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={data} barGap={10}>
            <XAxis dataKey="contributor" />
            <YAxis tickFormatter={(value) => `${value * 100}%`} />
            <Tooltip formatter={(value) => `${(value * 100).toFixed(0)}%`} />
            <Legend />
            <Bar dataKey="lifetimeRate" name="Lifetime" fill="#4F46E5" />
            <Bar dataKey="sprintRate" name="Sprint" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PRMergeSuccessRateChart;