import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>OSS Analytics</div>
      <ul style={styles.navLinks}>
        <li>
          <Link to="/" style={styles.link}>Home</Link>
        </li>
        <li>
          <Link to="/team-stats" style={styles.link}>Team Stats</Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#242424',
    color: 'white',
    borderBottom: '1px solid #444'
  },
  navLinks: {
    display: 'flex',
    listStyle: 'none',
    gap: '20px',
    margin: 0,
    padding: 0
  },
  link: {
    color: '#646cff',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  logo: {
    fontSize: '1.2rem',
    fontWeight: 'bold'
  }
};