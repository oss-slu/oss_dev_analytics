import { actionableInsightsMap } from "../constants/actionableInsightsConfig";

/*
    This function checks the backend health score payload
    and returns only the metrics that need attention.

    Expected payload shape:
    {
        selected_metrics: ["issue_resolution", "pr_responsiveness"],
        metrics: {
            issue_resolution: 60,
            pr_responsiveness: 40
        },
        final_score: 68,
        status: "Needs Attention"
    }
    
    Based on the issue requirements, if a metric falls below
    a healthy threshold, we return the matching insight text 
    and resource from the config file.
*/

export const getActionableInsights = (healthScoreData) => {
    const insights = [];

    // Return empty array if payload is missing
    if (!healthScoreData || !healthScoreData.metrics) {
        return insights;
    }

    const { selected_metrics = [], metrics = {} } = healthScoreData;

    selected_metrics.forEach((metricKey) => {
        const metricValue = Number(metrics[metricKey]);
        const metricConfig = actionableInsightsMap[metricKey];

        // skip invalid values or missing config
        if (isNaN(metricValue) || !metricConfig) {
            return;
        }

        /*
            Using 80 as the healthy threshold
            Backend labels scores below 80 as no longer fully healthy,
            so these should trigger actionable feedback.
        */
       const isUnhealthy = metricValue < 80;

       if (isUnhealthy) {
        insights.push({
            metric: metricKey,
            value: metricValue,
            ...metricConfig,
        });
       }
    });

    return insights;
}