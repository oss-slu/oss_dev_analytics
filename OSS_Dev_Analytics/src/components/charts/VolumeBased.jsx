import {Bar} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
export default function VolumeCharts({users = "Team", repo = "All"}){
    /*
        Volume based charts for the Team Stats Page
        Parameters:
            - user(s) (string): Gathered from dropdown (default team), either specific user or "Team" 
            - repo (string): Gathered from dropdown (default whole organization) Repository name for chart title
        Returns:
            - JSX element containing volume based charts
    */ 
    return{
        
    }
}