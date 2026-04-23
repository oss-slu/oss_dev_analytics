import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

/*
    Custom tooltip so we can show more than just the score.
    This is mainly used for the home page version where we compare repos.
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
                <p>PR Reviews: {data.prReviews}</p>
                <p>Issue Comments: {data.issueComments}</p>
                <p>PR Comments: {data.prComments}</p>
            </div>
        );
    }

    return null;
};

/*
    Main chart component.
    Home mode compares multiple repos.
    Team mode shows one selected repo's collaboration profile.
*/
const CollaborationChart = ({
    data,
    mode = "home",
    title = "Collaboration Index (Radar)",
}) => {
    return (
        <div style={{ width: "100%", height: 500 }}>
            <h3 style={{ textAlign: "center", marginBottom: "16px" }}>
                {title}
            </h3>

            <ResponsiveContainer width="100%" height="100%">
                {mode === "team" ? (
                    <RadarChart data={data}>
                        <PolarGrid stroke="#9ca3af" />
                        <PolarAngleAxis
                            dataKey="metric"
                            tick={{ fontSize: 12, fontWeight: "bold", fill: "#111827" }}
                        />
                        <PolarRadiusAxis tick={{ fill: "#111827" }} />
                        <Tooltip />
                        <Radar
                            name="Selected Repo"
                            dataKey="value"
                            stroke="#1d4ed8"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                ) : (
                    <RadarChart data={data}>
                        <PolarGrid stroke="#9ca3af" />
                        <PolarAngleAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fontWeight: "bold", fill: "#111827" }}
                        />
                        <PolarRadiusAxis tick={{ fill: "#111827" }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Radar
                            name="PR Reviews"
                            dataKey="prReviews"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.35}
                        />
                        <Radar
                            name="Issue Comments"
                            dataKey="issueComments"
                            stroke="#1d4ed8"
                            fill="#1d4ed8"
                            fillOpacity={0.25}
                        />
                        <Radar
                            name="PR Comments"
                            dataKey="prComments"
                            stroke="#60a5fa"
                            fill="#60a5fa"
                            fillOpacity={0.2}
                        />
                    </RadarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default CollaborationChart;