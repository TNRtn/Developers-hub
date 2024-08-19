import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import url from './urls'; // Adjust the import according to your project structure

const Dashboard = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // Hook to handle navigation

  useEffect(() => {
    axios.get(url + "/ufetch", {
      headers: {
        'xtoken': localStorage.getItem('token')
      }
    }).then(res => {
      // Transform skills from a comma-separated string to an array
      const transformedData = res.data.map(user => ({
        ...user,
        skills: user.skills ? user.skills.split(',').map(skill => skill.trim()) : []
      }));
      //console.log('Transformed Data:', transformedData); // Print transformed data
      setData(transformedData);
    }).catch(err => console.error('Error fetching data:', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to the login page
  };

  if (!localStorage.getItem('token')) {
    return (
      <div style={styles.expiredSession}>
        <p>Your session expired, please login again.</p>
        <Link to="/login" style={styles.loginLink}>Login</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>
          <Link to="/" style={styles.link}>
            <img src="/favicon.png" alt="Home" style={styles.favicon} />
          </Link>
        </h1>
        <div style={styles.centeredContent}>
          <h1 style={styles.heading}>Welcome to Developers Hub</h1>
          <div style={styles.linkContainer}>
            <Link to="/myprofile" style={styles.navLink}>My Profile</Link>
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </div>
        </div>
      </nav>
      <div style={styles.cardsContainer}>
        {data.map((user) => (
          <div key={user._id} style={styles.card}>
            <div style={styles.cardContent}>
              <div style={styles.userInfo}>
                <img src={user.profileImage || 'profile-picture-icon-14.jpg'} alt="Profile" style={styles.profileImage} />
                <div style={styles.userDetails}>
                  <h2 style={styles.userName}>{user.fullname}</h2>
                  <p style={styles.userEmail}>{user.email}</p>
                  <p style={styles.userContact}>{user.contact}</p>
                  {/* View Profile Button */}
                  <Link to={`/profile/${user._id}`} style={styles.viewProfileButton}>View Profile</Link>
                </div>
              </div>
              <div style={styles.userSkills}>
                <h3 style={styles.skillsHeading}>Skills</h3>
                <ul style={styles.skillsList}>
                  {user.skills.length > 0 ? (
                    user.skills.map((skill, index) => (
                      <li key={index} style={{
                        ...styles.skillItem,
                        backgroundColor: skillColors[index % skillColors.length] // Apply color from the array
                      }}>
                        {skill}
                      </li>
                    ))
                  ) : (
                    <li style={styles.skillItem}>No skills listed</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Single color for all cards
const cardColor = '#FFDDC1'; // Example color: Peach

// Define a set of colors for skills
const skillColors = [
  '#FFABAB', // Coral
  '#FFC3A0', // Light Coral
  '#D5AAFF', // Lavender
  '#A2C2E4', // Sky Blue
  '#A8E6CF', // Mint Green
  '#FF6F61', // Coral
  '#6a1b9a', // Purple
  '#8e24aa', // Pink
  '#64b5f6', // Light Blue
  '#2196f3', // Dark Blue
];

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    color: '#000',
  },
  navbar: {
    backgroundColor: '#333',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  favicon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    marginRight: '0.5rem',
  },
  homeText: {
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  centeredContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
  },
  heading: {
    color: '#fff',
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  linkContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '1rem',
    fontSize: '1rem',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    textDecoration: 'underline',
    marginLeft: '1rem',
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
  },
  card: {
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    margin: '1rem 0',
    width: '100%',
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: cardColor, // Apply the single color to all cards
    color: '#000', // Ensure text is visible on colorful backgrounds
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  userInfo: {
    flex: 1,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    marginBottom: '1rem',
    border: '2px solid #fff', // Add a border to the profile image
  },
  userDetails: {
    textAlign: 'center',
  },
  userName: {
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
  },
  userEmail: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  userContact: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  viewProfileButton: {
    backgroundColor: '#007BFF', // Blue background
    color: '#fff', // White text
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    cursor: 'pointer',
    marginTop: '0.5rem',
    display: 'inline-block',
  },
  userSkills: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#f4f4f4',
  },
  skillsHeading: {
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
  },
  skillsList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  skillItem: {
    fontSize: '1rem',
    backgroundColor: '#e0e0e0', // Light background for skill items
    padding: '0.5rem',
    borderRadius: '4px',
    marginBottom: '0.5rem',
    color: '#333', // Dark text for better contrast
    fontWeight: 'bold', // Highlight skills
  },
  expiredSession: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  loginLink: {
    marginTop: '10px',
    textDecoration: 'none',
    color: '#007bff',
    fontSize: '18px',
  }
};

export default Dashboard;
