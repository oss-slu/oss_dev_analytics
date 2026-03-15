/*
    Component displaying high-level summary statistics cards.
    Args:
        closeData (Array): Formatted time-to-close data.
        mergeData (Array): Formatted time-to-merge data.
        volumeData (Object): Aggregated volume metrics.
    Returns:
        JSX.Element: A grid of stat cards.
*/
const StatSummaryGrid = ({ closeData, mergeData, volumeData }) => {
  const avgClose = closeData.length ? (closeData.reduce((acc, curr) => acc + curr.value, 0) / closeData.length).toFixed(2) : 0;
  const avgMerge = mergeData.length ? (mergeData.reduce((acc, curr) => acc + curr.value, 0) / mergeData.length).toFixed(2) : 0;

  return (
    <div className="summary-grid">
      <div className="stat-card">
        <h3 className="stat-label">Avg Close Time</h3>
        <p className="stat-value">{avgClose} hrs</p>
      </div>
      <div className="stat-card">
        <h3 className="stat-label">Avg Merge Time</h3>
        <p className="stat-value">{avgMerge} hrs</p>
      </div>
      <div className="stat-card">
        <h3 className="stat-label">Issues Opened</h3>
        <p className="stat-value">{volumeData["Issues Opened"] || 0}</p>
      </div>
      <div className="stat-card">
        <h3 className="stat-label">PRs Merged</h3>
        <p className="stat-value">{volumeData["PRs Merged"] || 0}</p>
      </div>
    </div>
  );
};

export default StatSummaryGrid;