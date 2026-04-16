import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";

const provider = new GithubAuthProvider();

const Login = () => {
  const navigate = useNavigate();

  const signInWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      // User signed in successfully
      const user = result.user;

      // Safer logging
      console.log("User ID:", user.uid);

      // UPDATE: Redirects to Home 
      navigate("/");
    } catch (error) {
      console.error("Error during sign-in:", error.message);
      alert("Failed to sign in. Please try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>GitHub Authentication</h1>

        <p style={styles.subtitle}>
          Click the button below to sign in with GitHub:
        </p>

        <button onClick={signInWithGitHub} style={styles.button}>
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F5F9",
    fontFamily: "Inter, sans-serif",
  },

  card: {
    backgroundColor: "#E6EBF3",
    padding: "50px 60px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
    width: "380px",
  },

  title: {
    color: "#1F4C8F",
    marginBottom: "10px",
    fontSize: "24px",
  },

  subtitle: {
    color: "#5B6B84",
    marginBottom: "30px",
  },

  button: {
    backgroundColor: "#1F4C8F",
    color: "white",
    border: "none",
    padding: "14px 22px",
    fontSize: "16px",
    borderRadius: "10px",
    cursor: "pointer",
    width: "100%",
  },
};
