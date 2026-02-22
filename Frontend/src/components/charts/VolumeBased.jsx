import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * VolumeCharts Component
 * @param {Object} data - The processed data for the specific view (User, Repo, or Org)
 * @param {string} repos - The repository name or "All" for all repositories (Default "All")
 */
export default function VolumeCharts({ data, repos = "All", user = null }) {
    //If no data is available yet, return a loading state or null
    if (!data) return <div className="p-4 text-center">Loading Chart Data...</div>;
    
    if (repos == "All"){
        var title = "Organization Level Volume Data";
    }
    else if(user != null){
        var title = `User Level Volume Data: ${repos} for ${user}`
    }
    else {
        var title = `Repository Level Volume Data: ${repos}`;
    }
   const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: { color: "#ffffff" },
    },
    title: {
      display: true,
      text: title,
      color: "#ffffff",
      align: "start",
      font: {
        size: 18,
        weight: "600"
      },
      padding: {
        bottom: 16
      }
    },
  },
  scales: {
    x: {
      ticks: { color: "#ffffff" },
      grid: { color: "rgba(255, 255, 255, 0.08)" },
    },
    y: {
      beginAtZero: true,
      ticks: { color: "#ffffff" },
      grid: { color: "rgba(255, 255, 255, 0.08)" },
    },
  },
};

    const chartData = {
        labels: Object.keys(data), //e.g, ["Total Issues", "Total PRs", "Total Commits"]
        datasets: [
            {
                label: 'Volume',
                data: Object.values(data),
                backgroundColor: 'rgba(54, 162, 235, 0.85)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
    <div
        className="chart-container"
        style={{
         height: "100%",
         width: "100%",
         display: "flex",
         flexDirection: "column",
         paddingTop: "16ps",
         paddingLeft: "16px",
         paddingRight: "16px",
        }}
    >
        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
         <Bar options={chartOptions} data={chartData} />
        </div>
    </div>
);
    
    /*return (
    <div className="chart-container p-4 rounded-lg shadow h-full w-full flex flex-col">
      <div style={{ flex: 1, minHeight: 0 }}>
        <Bar options={chartOptions} data={chartData} />
      </div>
    </div>
  );*/
}