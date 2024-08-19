import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import url from './urls'; // Adjust the import according to your project structure

const Myprofile = () => {
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newSkills, setNewSkills] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  //const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      //console.log("Decoded token:", decodedToken); // Debug: log decoded token

      //const userId = decodedToken.user.id; // Adjust if the user ID is nested differently
      //console.log("Extracted userId:", userId); // Debug: log extracted userId

      axios.get(url + "/myprofile", {
        headers: {
          'xtoken': token
        }
      }).then(res => {
        const transformedProfile = {
          ...res.data,
          skills: res.data.skills ? res.data.skills.split(',').map(skill => skill.trim()) : []
        };
        setProfile(transformedProfile);
      }).catch(err => console.error('Error fetching profile:', err));

      axios.get(url + "/myreview", {
        headers: {
          'xtoken': token
        }
      }).then(res => {
        setReviews(res.data);
      }).catch(err => console.error('Error fetching reviews:', err));
    }
  }, []);

  const handleSkillsChange = (e) => {
    setNewSkills(e.target.value);
  };

  const handleSkillsSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.user.id; // Adjust if the user ID is nested differently

    //console.log("Submitting skills update:", { userId, skills: newSkills }); // Debug log

    axios.post(url + "/addskills", {
      userId,
      skills: newSkills
    }, {
      headers: {
        'xtoken': token
      }
    }).then(res => {
      setProfile(prevProfile => ({
        ...prevProfile,
        skills: Array.isArray(res.data.skills) ? res.data.skills : res.data.skills.split(',').map(skill => skill.trim())
      }));
      setNewSkills('');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
    }).catch(err => console.error('Error adding skills:', err.response ? err.response.data : err.message));
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
        <div style={styles.linkContainer}>
          <Link to="/dashboard" style={styles.navLink}>Back to Dashboard</Link>
        </div>
      </nav>
      <div style={styles.profileContent}>
        {profile ? (
          <div style={styles.userInfo}>
            <img src={profile.profileImage || 'profile-picture-icon-14.jpg'} alt="Profile" style={styles.profileImage} />
            <h1>{profile.fullname}</h1>
            <p>Email: {profile.email}</p>
            <p>Contact: {profile.contact}</p>
            <p>Country: India</p>
            <h2>Skills</h2>
            <ul style={styles.skillsList}>
              {profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <li key={index} style={{
                    ...styles.skillItem,
                    backgroundColor: skillColors[index % skillColors.length]
                  }}>
                    {skill}
                  </li>
                ))
              ) : (
                <li style={styles.skillItem}>No skills listed</li>
              )}
            </ul>
            <form onSubmit={handleSkillsSubmit} style={styles.skillsForm}>
              <label style={styles.label}>
                Add Skills (comma-separated):
                <input
                  type="text"
                  value={newSkills}
                  onChange={handleSkillsChange}
                  style={styles.input}
                  required
                />
              </label>
              <button type="submit" style={styles.submitButton}>Add Skills</button>
            </form>
            {showPopup && <div style={styles.popup}>Skills updated successfully!</div>}
            <h2>Reviews</h2>
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review._id} style={styles.reviewCard}>
                  <p><strong>Task Provider:</strong> {review.taskprovider}</p>
                  <p><strong>Work:</strong> {review.work}</p>
                  <p><strong>Description:</strong> {review.description}</p>
                  <p><strong>Rating:</strong> {review.rating}</p>
                </div>
              ))
            ) : (
              <p>No reviews available</p>
            )}
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

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
  '#4db6ac', // Teal
];

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#000', // Changed to black
    padding: '10px 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
  },
  link: {
    textDecoration: 'none',
    color: '#fff', // Changed to white for better visibility on black navbar
  },
  favicon: {
    width: '40px',
    height: '40px',
  },
  linkContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  navLink: {
    marginLeft: '20px',
    textDecoration: 'none',
    color: '#fff', // Changed to white for better visibility on black navbar
    fontSize: '18px',
  },
  profileContent: {
    maxWidth: '800px',
    width: '100%',
    padding: '20px',
    textAlign: 'center',
  },
  userInfo: {
    backgroundColor: '#f9f9f9', // Added background color for user info section
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '20px',
  },
  skillsList: {
    listStyleType: 'none',
    padding: '0',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  skillItem: {
    padding: '10px 15px',
    margin: '5px',
    borderRadius: '20px',
    backgroundColor: '#f1f1f1',
    color: '#333',
    fontSize: '16px',
  },
  skillsForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  },
  label: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    maxWidth: '300px',
    marginBottom: '10px',
  },
  submitButton: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
  popup: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  reviewCard: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'left',
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

export default Myprofile;
