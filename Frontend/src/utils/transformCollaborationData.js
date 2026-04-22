/*
    This function prepares the data for the chart

    Right now we don't have exact "collaboration" metrics,
    so I'm using existing fields as a rough approximation.
    This can be updated later once we have real review/comment data.

*/

export const transformCollaborationData = (data) => {
    if (!Array.isArray(data)) return [];
    
    return data
        .map((user) => {
            // Using available fields as a proxy for collaboration
            const prReviews = user.pull_requests?.total_prs_merged || 0;
            const issueComments = user.issues?.total_issues_closed || 0;
            const prComments = user.pull_requests?.total_prs_opened || 0;

            /*
                basic scoring logic:
                - PR reviews weighted higher (more direct collaboration)
                - issue comments medium
                - PR comments slightly lower
            */
            const collaborationScore = 
                prReviews * 3 +
                issueComments * 2 +
                prComments * 1;

            return {
                name: user.name || "Unknown",
                prReviews,
                issueComments,
                prComments,
                collaborationScore,
            };
        })
        // Sort so highest score shows first
        .sort((a, b) => b.collaborationScore - a.collaborationScore);
};