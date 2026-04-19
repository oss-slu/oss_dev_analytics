import { doc, documentSnapshotFromJSON, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

/**
 * Determines if user has logged in previously and has a document in the "users" collection of Firestore. If so, returns the user document data. If not, returns null.
 * @param {string} userId 
 * @returns: User document if it exists or NULL
 */

export const getTeamStatsAccounts = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } 
  } 
   catch(error) {
      console.error("Error fetching user document:", error);
      return null;
    }
};
/**
 * Fetches the base metrics for a given repository from the "repos" collection in Firestore. Returns the base metrics object if it exists, or null if it doesn't or if there's an error.
 * @param {string} repoName - The name of the repository to fetch metrics for.
 * @returns {object|null} - The base metrics object for the repository, or null if not found or on error.
 */

export const fetchRepoBaseMetrics = async(repoName) => {
    try {
        const repoRef = doc(db, "repos", repoName);
        const repoSnap = await getDoc(repoRef);

        if (repoSnap.exists()) {
            return repoSnap.data().baseMetrics;
        }
    } catch (error) {
        console.error("Error fetching repository base metrics:", error);
        return null;
    }   
}
/**
 * Updates the metrics preferences for a given user in the "users" collection in Firestore.
 * @param {string} userId 
 * @param {object} preferences 
 *     preferences = {
 *      trackedRepos: ["repo1", "repo2"],
 *     trackedMetrics: ["metric1", "metric2"] } 
 * @returns: true if update successful, false if error
 */

export const updateUserMetrics = async (userId, preferences) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { trackedRepos: preferences.trackedRepos, trackedMetrics: preferences.trackedMetrics }, { merge: true });
    return true;
    } catch (error) {  
      console.error("Error updating user metrics:", error);
      return false;
    }
};
/**
 * 
 * @param {string} repoName 
 * @param {string[]} metrics 
 * @returns True if update was successful, else returns False
 */

export const updateRepoBaseMetrics = async (repoName, metrics) => {
    try {
        const repoRef = doc(db, "repos", repoName);
        await updateDoc(repoRef, { baseMetrics: metrics });
        return true;
    } catch (error) {
        console.error("Error updating repository base metrics:", error);
        return false;
    }
};


