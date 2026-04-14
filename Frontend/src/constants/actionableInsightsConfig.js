/*
    Mapping each backend health metric to the text/resources
    that should be shown in the Actionable Insights panel.

    This is based on the tech lead mapping matric from #176.
    More metrics can be added here later if needed.
*/

export const actionableInsightsMap = {
    issue_resolution: {
        metricLabel: "Issue Resolution",
        title: "Issue Resolution Needed Attention",
        suggestion:
            "A lower issue resolution score usually means opened issues are not being closed fast enough. Focus on clearing older open issues and prioritizing smaller tasks",
        resourceLabel: "Developer Handbook",
        resourceLink: "https://github.com/oss-slu/handbook_developer",
    },

    issue_responsiveness: {
        metricLabel: "Issue Responsiveness",
        title: "Issue Responsiveness Needs Attention",
        suggestion:
            "Issues are taking too long to close. Breaking larger issues into smaller tasks and assigning clear ownership can help reduce delays",
        resourceLabel: "Developer Handbook",
        resourceLink: "https://github.com/oss-slu/handbook_developer",
    },

    pr_responsiveness: {
        metricLabel: "PR Responsiveness",
        title: "PR Responsiveness Needs Attention",
        suggestion:
            "Pull requests are taking too long to merge. Encourage smaller PRs and more frequent reviews to keep work moving",
        resourceLabel: "Tech Lead Handbook",
        resourceLink: "https://github.com/oss-slu/handbook_tech_lead",
    },

    contributor_activity: {
        metricLabel: "Contributor Activity",
        title: "Contributor Activity Needs Attention",
        suggestion:
            "Low contributor activity can slow project progress. Encourage more regular participation and distribute work more evenly across contributors",
        resourceLabel: "Tech Lead Handbook",
        resourceLink: "https://github.com/oss-slu/handbook_tech_lead",
    },

    commit_volume: {
        metricLabel: "Commit Volume",
        title: "Commit Volume Needs Attention",
        suggestion:
            "Low commit activity may indicate stalled progress. Encourage smaller and more frequent commits so work is easier to track and review",
        resourceLabel: "Developer Handbook",
        resourceLink: "https://github.com/oss-slu/handbook_developer",
    },
};