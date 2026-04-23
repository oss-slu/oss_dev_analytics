import { Link } from "react-router-dom";
import loginProfile from "./loginprofile.png";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); 
  }, []);

  const githubData = user?.providerData?.[0];
// to collect and return their github username and picture
  const displayName =
    githubData?.displayName ||
    user?.reloadUserInfo?.screenName ||
    "GitHub User";

  const photoURL = githubData?.photoURL || loginProfile;

  return (
    <div style={styles.wrapper}>
      <nav style={styles.nav}>
        <div style={styles.logoContainer}>
          <div style={styles.logoSmall}>
            Open
            <br />
            Source
            <br />
            with
          </div>
          <div style={styles.logoBig}>SLU</div>
        </div>

        <ul style={styles.navLinks}>
          <li>
            <Link to="/" style={styles.link}>
              Home
            </Link>
          </li>

          <li>
            <Link to="/team-stats" style={styles.link}>
              Team
            </Link>
          </li>
        
          <li style={{ textAlign: "center" }}>
            <Link to={user ? "/" : "/login"} style={styles.link}> 
              <img src={photoURL} alt="Profile" style={styles.profileImg} />
            </Link>

            {user && (
              <div style={styles.userInfo}>
                <div style={styles.username}>{displayName}</div>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

const styles = {
  wrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    width: "100%",
    backgroundColor: "#123f8b",
    color: "white",
    borderRadius: "18px",
    fontFamily: '"Times New Roman", Times, serif',
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoSmall: {
    fontSize: "12px",
    lineHeight: "12px",
    textAlign: "right",
  },
  logoBig: {
    fontSize: "36px",
    fontWeight: "bold",
    letterSpacing: "2px",
  },
  navLinks: {
    display: "flex",
    listStyle: "none",
    gap: "40px",
    margin: 0,
    padding: 0,
    fontSize: "1.2rem",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  profileImg: {
    width: "40px",
    height: "40px",
    objectFit: "cover",
    cursor: "pointer",
    borderRadius: "50%",
  },
  signedInText: {
    fontSize: "12px",
    marginTop: "5px",
    color: "#A8D0FF",
  },
  username: {
    fontSize: "12px",
    color: "#A8D0FF",
    maxWidth: "80px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

