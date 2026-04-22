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
      <h3>PR Merge Success Rate</h3>

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