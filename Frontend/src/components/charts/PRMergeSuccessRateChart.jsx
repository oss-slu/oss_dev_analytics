import { useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { getPRMergeRates } from "../../utils/prMergeRateHelper";

const PRMergeSuccessRateChart = ({ selectedTeam }) => {
  const data = getPRMergeRates(selectedTeam);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <div>
      <h3>
        PR Merge Success Rate{" "}
        <span
          style={{
            position: "relative",
            display: "inline-block",
            marginLeft: "6px",
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
              display: "inline-block",
            }}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            // Changed by adding onFocus/onBlur so keyboard users (Tab key) can also
            // trigger the tooltip
            onFocus={() => setTooltipVisible(true)}
            onBlur={() => setTooltipVisible(false)}
          >
            i
          </span>

          <span
            style={{
              // Position: default below-and-centered. On narrow viewports the
              // parent flex container should be `overflow: visible`; for a
              // production app replace with Floating UI for true boundary checks.
              // Changed visibility, now driven by tooltipVisible
              visibility: tooltipVisible ? "visible" : "hidden",
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
              // Added maxWidth to prevent clipping on narrow screens.
              maxWidth: "min(260px, 90vw)",
              zIndex: 1000,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "left",
              border: "1px solid #e5e7eb",
              // Prevent the tooltip itself from receiving mouse events so
              pointerEvents: "none",
            }}
          >
            This chart compares each contributor’s lifetime PR merge success
            rate with their recent sprint performance. It helps show both
            long-term consistency and current activity.
          </span>
        </span>
      </h3>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={data} barGap={10}>
            <XAxis dataKey="contributor" />
            {/* Changed by adding .toFixed(0) to match the Tooltip formatter below.
                Without it, fractional values like 0.3333 render as "33.3333333%"
                on the Y-axis ticks, while the hover tooltip correctly shows "33%". */}
            <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
            <Tooltip formatter={(value) => `${(value * 100).toFixed(0)}%`} />
            <Legend />
            {/* Changed Sprint bar color changed from #22C55E (green) to #F59E0B
                (amber). The original green is hard to distinguish from the indigo
                (#4F46E5)*/}
            <Bar dataKey="lifetimeRate" name="Lifetime" fill="#4F46E5" />
            <Bar dataKey="sprintRate" name="Sprint" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PRMergeSuccessRateChart;
