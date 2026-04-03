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
 * @param {string|null} user - The username for user-level data (Default null)
 * @param {string} title - Optional custom title for the chart
 */
export default function VolumeCharts({ data, repos = "All", user = null, titleCustom = null}) {
    //If no data is available yet, return a loading state or null
    if (!data) return <div className="p-4 text-center">Loading Chart Data...</div>;
    
    if (titleCustom) {
        let title = titleCustom;
    }

    if (repos === "All"){
        /*var*/ title = "Volume-Based Data";
    }
    else if(user != null){
        /*var*/ title = `User Level Volume Data: ${repos} for ${user}`
    }
    else {
        /*var*/ title = `Repository Level Volume Data: ${repos}`;
    }
   const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: { left: 12, right: 12, bottom: 8, top: 4 },
  },
  plugins: {
    legend: {
      position: "top",
      labels: { color: "#0a0909" },
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: { color: "#0e0d0d" },
      grid: { color: "rgba(255, 255, 255, 0.08)" },
    },
    y: {
      beginAtZero: true,
      ticks: { color: "#0e0e0e" },
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
      <div className="chart-container" style={{ height: "100%", display: "flex", flexDirection: "column"}}>
        {<h3 className="text-center font-semibold mb-4">{title}</h3>}
        <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
          <Bar options={chartOptions} data={chartData} />
        </div>
      </div>
    );
   
}
    