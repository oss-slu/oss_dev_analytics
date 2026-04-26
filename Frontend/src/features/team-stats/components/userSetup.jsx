import { useState, useEffect } from "react";
import { updateUserMetrics, fetchRepoBaseMetrics } from "../utils/teamStatsAccounts";

const AVAILABLE_METRICS = [
  { id: "average_time_to_close", label: "Issue Resolution Time", desc: "Average time taken to resolve issues in the repository." },
  { id: "total_commits", label: "Total Commits", desc: "Total number of commits made to the repository." },
  { id: "average_velocity", label: "Average Velocity", desc: "Average number of issues resolved per sprint." },
  { id: "total_issues_opened", label: "Total Issues Opened", desc: "Total number of issues opened in the repository." },
  { id: "total_issues_closed", label: "Total Issues Closed", desc: "Total number of issues closed in the repository." },
  { id: "average_time_to_merge", label: "PR Merge Time", desc: "Average time taken to merge pull requests in the repository." },
  { id: "total_prs_opened", label: "Total PRs Opened", desc: "Total number of pull requests opened in the repository." },
  { id: "total_prs_merged", label: "Total PRs Merged", desc: "Total number of pull requests merged in the repository." }
];

export default function UserSetup({ userId, availableRepos = [], onComplete, userDoc }) { 
    const [step, setStep] = useState(0);
    const [selectedRepos, setSelectedRepos] = useState([]);
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const [inheritedMetrics, setInheritedMetrics] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getBaseMetrics = async () => {
            let combined = new Set();
            for (const repo of selectedRepos) {
                const metrics = await fetchRepoBaseMetrics(repo);
                if (metrics && Array.isArray(metrics)) {
                    metrics.forEach((m) => combined.add(m));
                }
            }
            setInheritedMetrics(Array.from(combined));
        };
        
        if (selectedRepos.length > 0) {
            getBaseMetrics();
        } else {
            setInheritedMetrics([]);
        }
    }, [selectedRepos]);

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
        };

        try {
            await updateUserMetrics(userId, preferences);
            onComplete(preferences);
        } catch (err) {
            console.error("Error updating preferences:", err);
            setError("An error occurred while saving. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
    // Fixed overlay backdrop covering the whole screen
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 font-sans">
      
      {/* Center Modal Card matching your inspiration */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col h-[600px] overflow-hidden">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className="pt-8 px-10 pb-4">
          {step === 0 && (
            <>
              <h2 className="text-2xl font-bold text-[#003da5]">STEP 1: Welcome to OSS Analytics</h2>
              <p className="text-gray-600 mt-1">Let's get your dashboard set up.</p>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-[#003da5]">STEP 2: Select Your Actively Contributing Repositories</h2>
              <p className="text-gray-600 mt-1">Identify the specific projects you directly work on for customized analytics.</p>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-[#003da5]">STEP 3: Select Personal Metrics</h2>
              <p className="text-gray-600 mt-1">Choose the metrics you care about. Base metrics are inherited from your projects.</p>
            </>
          )}
        </div>

        {/* Onboarding screens, 4 total screens (including welcome screen) - content changes based on step */}
        <div className="flex-1 overflow-y-auto px-10 pb-6">
          
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="flex flex-col justify-center h-full text-center space-y-4 px-8">
              <h3 className="text-3xl font-bold text-gray-800">Hello, {userDoc?.githubUsername || "Developer"}!</h3>
              <p className="text-lg text-gray-600">
                We will walk you through selecting the repositories you contribute to and the specific metrics you want to track on your dashboard.
              </p>
            </div>
          )}

          {/* Step 1: Repository Table List */}
          {step === 1 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="w-10"></div>
                <div className="flex-1 font-bold text-sm text-gray-700">Repo Name</div>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-[320px] overflow-y-auto">
                {!availableRepos || availableRepos.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 font-medium">
                    Loading repositories from database...
                  </div>
                ) : (
                  availableRepos.map((repo) => (
                    <label 
                      key={repo} 
                      className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                        selectedRepos.includes(repo) ? "bg-[#003da5]/5" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-10">
                        <input
                          type="checkbox"
                          checked={selectedRepos.includes(repo)}
                          onChange={() => toggleSelection(repo, selectedRepos, setSelectedRepos)}
                          className="w-5 h-5 text-[#003da5] rounded border-gray-300 focus:ring-[#003da5]"
                        />
                      </div>
                      <div className="flex-1 font-medium text-gray-800">{repo}</div>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 2: Metrics */}
          {step === 2 && (
            <div className="grid grid-cols-1 gap-3">
              {AVAILABLE_METRICS.map((metric) => {
                const isInherited = inheritedMetrics.includes(metric.id);
                return (
                  <label 
                    key={metric.id} 
                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
                      isInherited 
                        ? "bg-gray-50 border-gray-200" 
                        : selectedMetrics.includes(metric.id)
                          ? "bg-[#003da5]/5 border-[#003da5]"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMetrics.includes(metric.id) || isInherited}
                      onChange={() => toggleSelection(metric.id, selectedMetrics, setSelectedMetrics)}
                      disabled={isInherited}
                      className="mt-1 mr-4 w-5 h-5 text-[#003da5] rounded border-gray-300 focus:ring-[#003da5]"
                    />
                    <div className="flex flex-col">
                      <span className={`font-bold ${isInherited ? "text-gray-500" : "text-gray-800"}`}>
                        {metric.label} {isInherited && <span className="ml-2 text-xs uppercase tracking-wider font-bold text-[#003da5] opacity-70">(Base Metric)</span>}
                      </span>
                      <span className={`text-sm mt-1 ${isInherited ? "text-gray-400" : "text-gray-600"}`}>
                        {metric.desc}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* --- FOOTER: PAGINATION & BUTTONS --- */}
        <div className="bg-white border-t border-gray-100 px-10 py-5">
          {error && <p className="text-red-600 font-bold mb-3 text-center">{error}</p>}
          
          <div className="flex justify-between items-center">
            {/* Previous Button */}
            {step > 0 ? (
              <button 
                onClick={() => { setStep(step - 1); setError(null); }}
                className="px-6 py-2 rounded-lg font-bold text-gray-600 border-2 border-gray-200 hover:bg-gray-50 transition-colors"
              >
                PREVIOUS
              </button>
            ) : <div className="w-[104px]"></div>}

            {/* Pagination Dots */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-gray-500 tracking-wider">PAGE {step + 1} OF 3</span>
              <div className="flex gap-2">
                {[0, 1, 2].map((idx) => (
                  <div 
                    key={idx} 
                    className={`w-3 h-3 rounded-full border-2 transition-colors ${
                      step === idx ? "bg-[#005570] border-[#005570]" : "bg-transparent border-gray-400"
                    }`} 
                  />
                ))}
              </div>
            </div>

            {/* Next / Continue Button */}
            {step < 2 ? (
              <button 
                onClick={() => {
                  if (step === 1 && selectedRepos.length === 0) {
                    setError("Please select at least one repository to continue.");
                    return;
                  }
                  setError(null);
                  setStep(step + 1);
                }}
                className="px-6 py-2 rounded-lg font-bold bg-[#005570] text-white hover:bg-[#003d52] transition-colors shadow-md"
              >
                CONTINUE
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg font-bold transition-colors shadow-md text-white ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#005570] hover:bg-[#003d52]"
                }`}
              >
                {isSubmitting ? "SAVING..." : "FINISH SETUP"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}