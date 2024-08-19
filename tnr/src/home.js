import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>
          <Link to="/" style={styles.link}>
            <img src="/favicon.png" alt="Home" style={styles.favicon} />
            <span style={styles.homeText}>HOME</span>
          </Link>
        </h1>
        <ul style={styles.navList}>
          <li><Link to="/register" style={styles.navLink}>Register</Link></li>
          <li><Link to="/login" style={styles.navLink}>Login</Link></li>
        </ul>
      </nav>
      <section style={styles.landing}>
        <div style={styles.overlay}>
          <div style={styles.landingInner}>
            <h1 style={styles.heading}>Developers Hub</h1>
            <p style={styles.lead}>Creating a developers team</p>
            <div style={styles.buttons}>
              <Link to="/register" style={{ ...styles.button, ...styles.primaryButton }}>Sign Up</Link>
              <Link to="/login" style={{ ...styles.button, ...styles.lightButton }}>Login</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif'
  },
  navbar: {
    backgroundColor: '#333',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  link: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center'
  },
  favicon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    marginRight: '0.5rem'
  },
  homeText: {
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  navList: {
    listStyleType: 'none',
    display: 'flex',
    margin: 0,
    padding: 0,
    flexWrap: 'wrap'
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '1rem'
  },
  landing: {
    height: '100vh',
    backgroundImage: 'url("https://images3.content-hci.com/commimg/myhotcourses/blog/post/myhc_89683.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '2rem',
    textAlign: 'center',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '600px'
  },
  landingInner: {
    maxWidth: '100%',
    margin: '0 auto'
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1rem'
  },
  lead: {
    fontSize: '1rem',
    marginBottom: '2rem'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  primaryButton: {
    backgroundColor: '#007bff',
    color: '#fff'
  },
  lightButton: {
    backgroundColor: '#f8f9fa',
    color: '#333'
  },
  '@media (max-width: 600px)': {
    heading: {
      fontSize: '1.5rem'
    },
    lead: {
      fontSize: '0.875rem'
    },
    button: {
      fontSize: '0.875rem',
      padding: '0.5rem 1rem'
    },
    navbar: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    navList: {
      flexDirection: 'column',
      width: '100%'
    },
    navLink: {
      marginLeft: 0,
      marginTop: '0.5rem'
    }
  }
};

export default Home;
