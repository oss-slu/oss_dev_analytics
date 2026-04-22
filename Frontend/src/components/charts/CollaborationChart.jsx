import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

/*
    Custom tooltip so we can show more than just the score
    This makes the chart more useful when you hover over a bar
*/
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;

        return (
            <div
                style={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "8px",
                }}
            >
                <p><strong>{data.name}</strong></p>
                <p>Score: {data.collaborationScore}</p>
                <p>PR Reviews: {data.prReviews}</p>
                <p>Issue Comments: {data.issueComments}</p>
                <p>PR Comments: {data.prComments}</p>
            </div>
        );
    }

    return null;
};

/*
    Main chart component
    Using a simple BarChart since it's easy to compare repositories
*/
const CollaborationChart = ({ data }) => {
    return (
        <div style={{ width: "100%", height: 400 }}>
            {/* chart title */}
            <h3 style={{ textAlign: "center", marginBottom: "16px" }}>
                Collaboration Index
            </h3>

            {/* makes the chart responsive */}
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 10, bottom: 90 }}
                >
                    {/* light grid for readability */}
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* container names on x-axis */}
                    <XAxis
                        dataKey="name"
                        angle={-90}
                        textAnchor="start"
                        interval={0}
                        height={20}
                        tickMargin={15}
                        tick={{ fontWeight: "bold" }}
                    />

                    {/* score on y-axis */}
                    <YAxis />

                    {/* tooltip shows extra details */}
                    <Tooltip content={<CustomTooltip />} />

                    {/* actual bar */}
                    <Bar
                        dataKey="collaborationScore"
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]} // Slightly rounded top
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CollaborationChart