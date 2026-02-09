import { Link } from "react-router-dom";

export const Navbar = () => {
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
          <li>
            <Link to="/other" style={styles.link}>
              Other
            </Link>
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
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
};
