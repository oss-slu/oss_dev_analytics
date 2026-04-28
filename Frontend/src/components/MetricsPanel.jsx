import { useState } from "react";

// Helper to make metric names look nicer
const formatMetricName = (metric) => {
  return metric
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const MetricsPanel = ({ selectedMetrics = [] }) => {
  // TEMPORARY split (until backend supports assigned vs custom)
  const assignedMetrics = selectedMetrics.slice(0, 2);
  const [myMetrics, setMyMetrics] = useState(selectedMetrics.slice(2));

  // Remove metric (only for "My Metrics")
  const handleRemoveMetric = (metricToRemove) => {
    setMyMetrics((prev) =>
      prev.filter((metric) => metric !== metricToRemove)
    );
  };

  return (
    <section style={{ marginTop: "20px" }}>
      <h2 className="section-heading">Developer Metrics</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* Assigned Metrics */}
        <div style={{ background: "#f3f4f6", padding: "15px", borderRadius: "10px" }}>
          <h3>Assigned Metrics</h3>
          <p style={{ fontSize: "0.9rem", color: "gray" }}>
            Required metrics assigned by the tech lead
          </p>

          {assignedMetrics.map((metric) => (
            <div
              key={metric}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#e5e7eb",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              <div>
                <strong>{formatMetricName(metric)}</strong>
                <p style={{ fontSize: "0.8rem", color: "gray" }}>
                  Assigned by Tech Lead
                </p>
              </div>

              <button disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
                Locked
              </button>
            </div>
          ))}
        </div>

        {/* My Metrics */}
        <div style={{ background: "#ffffff", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <h3>My Metrics</h3>
          <p style={{ fontSize: "0.9rem", color: "gray" }}>
            Custom metrics you selected
          </p>

          {myMetrics.map((metric) => (
            <div
              key={metric}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f9fafb",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              <strong>{formatMetricName(metric)}</strong>

              <button onClick={() => handleRemoveMetric(metric)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsPanel;