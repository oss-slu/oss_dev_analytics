import { useState } from "react";
import { updateUserMetrics } from "../utils/teamStatsAccounts";


const AVAILABLE_METRICS = [ //based on what we already have in lifetime_data.json, can be expanded as needed
 {
    id: "average_time_to_close",
    label: "Issue Resolution Time",
    desc: "Average time taken to resolve issues in the repository."
 },
 {
    id: "total_commits",
    label: "Total Commits",
    desc: "Total number of commits made to the repository."
},
{
    id: "average_velocity",
    label: "Average Velocity",
    desc: "Average number of issues resolved per sprint."
},
{
    id: "total_issues_opened",
    label: "Total Issues Opened",
    desc: "Total number of issues opened in the repository."
},
{
    id: "total_issues_closed",
    label: "Total Issues Closed",
    desc: "Total number of issues closed in the repository."
},
{
    id: "average_time_to_merge",
    label: "PR Merge Time",
    desc: "Average time taken to merge pull requests in the repository."
},
{
    id: "total_prs_opened",
    label: "Total PRs Opened",
    desc: "Total number of pull requests opened in the repository."
},
{
    id: "total_prs_merged",
    label: "Total PRs Merged",
    desc: "Total number of pull requests merged in the repository."
}
];

/**
 * Component for setting up user metrics preferences and repos.
 * @param {string} userID - The ID of the user setting up their metrics preferences.
 * @param {string[]} availableRepos - An array of repository names that the user can select from.
 * @param {function} onSetupComplete - A callback function to be called when the user completes the setup process.
 * @param {object} userDoc - The Firestore document data for the user, which may contain existing preferences to pre-populate the form.
 * @returns JSX.Element - A React component that renders the user setup interface for selecting repositories and metrics.
 */
export default function userSetup({ userId, availableRepos, onSetupComplete, userDoc }) { 
    const [selectedRepos, setSelectedRepos] = useState([]);
    const [selectedMetrics, setSelectedMetrics] = useState([]);


    //UI handlers to stop multiple submissions of new selections
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const toggleSelection = (item, selectedItems, setSelectedItems) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(i => i !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleSubmit = async () => {
        if (selectedRepos.length === 0) {
            setError("Please select at least one repository.");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        const preferences = {
            trackedRepos: selectedRepos,
            trackedMetrics: selectedMetrics
        }
        try{
            await updateUserMetrics(userId, preferences);
            onSetupComplete();
        }catch (err) {
            console.error("Error updating user metrics preferences:", err);
            setError("An error occurred while saving your preferences. Please try again.");
            setIsSubmitting(false);
        }
    };
    return (
    <div className="flex justify-center items-center min-h-[60vh] p-5">
      <div className="bg-white p-10 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-2">
          Welcome to OSS Analytics, {userDoc?.githubUsername || "Developer"}!
        </h2>
        <p className="text-gray-600 mb-8">
          Let's get your dashboard set up. Select the repositories you contribute to and the metrics you care about, your repositories will already have assigned metrics so these are optional to change but you can add more if you want! You can always come back and update your preferences later in the settings.
        </p>

        {/* --- REPOSITORY SELECTION --- */}
        <div className="mb-8 text-left">
          <h3 className="text-lg font-semibold mb-3">1. Select Your Repositories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {availableRepos?.map((repo) => (
              <label 
                key={repo} 
                className="flex items-center cursor-pointer text-base p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedRepos.includes(repo)}
                  onSetupComplete={() => toggleSelection(repo, selectedRepos, setSelectedRepos)}
                  className="mr-3 w-5 h-5 text-[#123f8b] rounded focus:ring-[#123f8b]"
                />
                <span className="font-medium text-gray-800">{repo}</span>
              </label>
            ))}
          </div>
        </div>

        {/* --- METRICS SELECTION --- */}
        <div className="mb-8 text-left">
          <h3 className="text-lg font-semibold mb-3">2. Select Personal Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {AVAILABLE_METRICS.map((metric) => (
              <label 
                key={metric.id} 
                className="flex items-start cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric.id)}
                  onSetupComplete={() => toggleSelection(metric.id, selectedMetrics, setSelectedMetrics)}
                  className="mr-3 w-5 h-5 mt-0.5 text-[#123f8b] rounded focus:ring-[#123f8b] flex-shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-base font-bold text-gray-800">{metric.label}</span>
                  <span className="text-sm text-gray-600 mt-1 leading-snug">{metric.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* --- ERROR & SUBMIT --- */}
        {error && <p className="text-red-600 font-bold mb-4">{error}</p>}
        
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className={`w-full p-3 text-white rounded-lg text-base font-bold mt-2 transition-colors ${
            isSubmitting 
              ? "bg-[#88a2ce] cursor-not-allowed" 
              : "bg-[#123f8b] hover:bg-blue-900 cursor-pointer"
          }`}
        >
          {isSubmitting ? "Saving..." : "Complete Setup"}
        </button>
      </div>
    </div>
  );
}