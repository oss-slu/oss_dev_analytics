/*
    Mapping each backend health metric to the problem,
    action steps, and resources shown in the Actionable Insights panel.

    This is based on the tech lead mapping matrix from #176.
    More metrics can be added here later if needed.
*/

export const actionableInsightsMap = {
    issue_resolution: {
        metricLabel: "Issue Resolution",
        problem:
            "A lower issue resolution score means opened issues are not being closed fast enough.",
        actions: [
            "Review older open issues first.",
            "Prioritize smaller issues that can be completed quickly.",
        ],
        resources: [
            {
                label: "Developer Handbook",
                link: "https://github.com/oss-slu/handbook_developer",
            },
        ],
    },

    issue_responsiveness: {
        metricLabel: "Issue Responsiveness",
        problem:
            "Issues are taking too long to close compared to a healthy threshold.",
        actions: [
            "Break larger issues into smaller tasks.",
            "Assign ownership clearly so issues do not stay open too long.",
        ],
        resources: [
            {
                label: "Developer Handbook",
                link: "https://github.com/oss-slu/handbook_developer",
            },
        ],
    },

    pr_responsiveness: {
        metricLabel: "PR Responsiveness",
        problem:
            "Pull requests are taking too long to merge, which slows down project progress.",
        actions: [
            "Encourage smaller pull requests.",
            "Review pull requests more frequently.",
        ],
        resources: [
            {
                label: "Tech Lead Handbook",
                link: "https://github.com/oss-slu/handbook_tech_lead",
            },
        ],
    },

    contributor_activity: {
        metricLabel: "Contributor Activity",
        problem:
            "Low contributor activity can reduce momentum and delay project progress.",
        actions: [
            "Encourage more regular participation from team members.",
            "Distribute work more evenly across contributors.",
        ],
        resources: [
            {
                label: "Tech Lead Handbook",
                link: "https://github.com/oss-slu/handbook_tech_lead",
            },
        ],
    },

    commit_volume: {
        metricLabel: "Commit Volume",
        problem:
            "Low commit volume may indicate stalled or inconsistent development activity.",
        actions: [
            "Encourage smaller, more frequent commits.",
            "Push progress regularly so work is easier to track and review.",
        ],
        resources: [
            {
                label: "Developer Handbook",
                link: "https://github.com/oss-slu/handbook_developer",
            },
        ],
    },
};