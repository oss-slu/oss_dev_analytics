import { doc, getDocs, setDoc, getDoc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase";

/**
 * Determines if user has logged in previously and has a document in the "users" collection of Firestore. If so, returns the user document data. If not, returns null.
 * @param {Object} authUser - The authenticated user object returned from Firebase Authentication after a successful login. 
 * @returns: User document if it exists or NULL
 */

export const fetchOrCreateUserDocument = async (authUser) => {
  try {
    const userRef = doc(db, "users", authUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } 
    const githubUsername = authUser.reloadUserInfo.screenName || "";
    const newUserDoc = {
        displayName: authUser.displayName || "Developer",
        email: authUser.email || "",
        githubUsername: githubUsername,
        trackedRepos: [],
        trackedMetrics: []
    }
    await setDoc(userRef, newUserDoc);
    return newUserDoc;
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

/**
 * 
 * @returns List of available repositories in the "repos" collection of Firestore. If there's an error, returns an empty list.
 * This is used to populate the dropdown of repositories a user can select from when setting up their dashboard.
 */
export const fetchAvailableRepos = async () => {
    try {
        const reposSnapshot = await getDocs(collection(db, "repos"));
        const repos = [];

        reposSnapshot.forEach((doc) => {
            repos.push(doc.id);
        });

        // Fallback so setup still works if Firestore repos collection is empty
        if (repos.length === 0) {
            return ["oss_dev_analytics"];
        }

        return repos;
    } catch (error) {
        console.error("Error fetching available repositories:", error);

        // Fallback for local testing
        return ["oss_dev_analytics"];
    }
};
