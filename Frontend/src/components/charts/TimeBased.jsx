// Resuable chart component for time-based metrics
// This component does NOT care where the data comes from
// It only receives already-filtered / transformed data via props

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { transformTimeData } from "../../utils/TransformTimeData";

const TimeBased = ({
    rawData,
    metric,
    chartType = "line",
    scope,
    sprintId = null,
    title
}) => {
    // Converting raw test_data.json into chart-friendly format
    const chartData = transformTimeData({
        rawData,
        metric,
        scope,
        sprintId
    });

    return (
        <div className="chart-container">
            <h3>{title}</h3>

            <ResponsiveContainer width="100%" height={300}>
                {chartType === "bar" ? (
                    // Bar chart used where comparisons make more sens
                    <BarChart data={chartData}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#4F46E5" />
                    </BarChart>
                ) : (
                    // Line chart used for trends over time
                    <LineChart data={chartData}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#4F46E5"
                          strokeWidth={2}
                        />
                    </LineChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default TimeBased;