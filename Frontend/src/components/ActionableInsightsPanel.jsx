import React from "react";

const ActionableInsightsPanel = ({ insights, isHealthy }) => {
  if (isHealthy) {
    return (
      <div className="card-blue" style={{ marginBottom: "20px" }}>
        <h2 className="card-title" style={{ marginBottom: "10px" }}>
          Actionable Insights
        </h2>
        <p style={{ color: "#16a34a", fontWeight: "500" }}>
          Everything looks good 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="card-blue" style={{ marginBottom: "20px" }}>
      <h2 className="card-title" style={{ marginBottom: "10px" }}>
            Actionable Insights
      </h2>

      {insights?.map((item, index) => (
        <div
          key={index}
          style={{
            background: "#f3f4f6",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "12px",
            borderLeft: "4px solid #dc2626"
          }}
        >
          <h3 style={{ marginBottom: "4px", color: "#111827" }}>
            {item.metric}
          </h3>

          <p style={{ marginBottom: "8px", color: "#374151" }}>
            {item.message}
          </p>

          <div style={{ marginBottom: "6px" }}>
            <strong>Actions:</strong>
            <ul style={{ marginTop: "4px", paddingLeft: "18px" }}>
              {item.actions?.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Resources:</strong>
            <ul style={{ marginTop: "4px", paddingLeft: "18px" }}>
              {item.resources?.map((res, i) => (
                <li key={i}>
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#2563eb" }}
                  >
                    {res}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActionableInsightsPanel;