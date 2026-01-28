// Utility function to shape time-based data for charts
// Handles org-level, repo-level, user-level, and sprint filtering

export const transformTimeData = ({
  rawData,
  metric,
  scope,
  sprintId
}) => {
  // Handle cases where rawData is not an array (e.g., JSON object)
  const dataArray = Array.isArray(rawData)
    ? rawData
    : rawData?.data || [];

  let filteredData = [...dataArray];

  if (scope === "repo") {
    filteredData = filteredData.filter(d => d.repo);
  }

  if (scope === "user") {
    filteredData = filteredData.filter(d => d.user);
  }

  if (sprintId) {
    filteredData = filteredData.filter(d => d.sprint === sprintId);
  }

  return filteredData.map(entry => ({
    label: sprintId ? entry.sprint : entry.date,
    value: entry.metrics?.[metric]
  }));
};