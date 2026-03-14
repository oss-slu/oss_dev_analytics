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
  {/* Calculate averages from the arrays for the top-level cards */}
  const avgClose = closeData.length ? (closeData.reduce((acc, curr) => acc + curr.value, 0) / closeData.length).toFixed(2) : 0;
  const avgMerge = mergeData.length ? (mergeData.reduce((acc, curr) => acc + curr.value, 0) / mergeData.length).toFixed(2) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <div className="bg-[#dde3ef] p-5 rounded-lg shadow-sm text-center">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Avg Close Time</h3>
        <p className="text-3xl font-bold text-[#123f8b]">{avgClose} hrs</p>
      </div>
      <div className="bg-[#dde3ef] p-5 rounded-lg shadow-sm text-center">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Avg Merge Time</h3>
        <p className="text-3xl font-bold text-[#123f8b]">{avgMerge} hrs</p>
      </div>
      <div className="bg-[#dde3ef] p-5 rounded-lg shadow-sm text-center">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Issues Opened</h3>
        <p className="text-3xl font-bold text-[#123f8b]">{volumeData["Issues Opened"] || 0}</p>
      </div>
      <div className="bg-[#dde3ef] p-5 rounded-lg shadow-sm text-center">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">PRs Merged</h3>
        <p className="text-3xl font-bold text-[#123f8b]">{volumeData["PRs Merged"] || 0}</p>
      </div>
    </div>
  );
};

export default StatSummaryGrid;