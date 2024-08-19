import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import url from './urls'; // Adjust the import according to your project structure

const Profile = () => {
  const { userId } = useParams(); // Get userId from route params
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [taskProvider, setTaskProvider] = useState('');
  const [newReview, setNewReview] = useState({
    work: '',
    description: '',
    rating: ''
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user data from the server
      axios.get(`${url}/ufetch`, {
        headers: {
          'xtoken': token
        }
      }).then(res => {
        //console.log('API Response:', res.data);
        const users = Array.isArray(res.data) ? res.data : res.data.users || [];
        const user = users.find(user => user._id === userId) || res.data;

        // Transform skills from a comma-separated string to an array
        const skills = user.skills ? user.skills.split(',').map(skill => skill.trim()) : [];
        user.skills = skills;

        setUserData(user);

        // Fetch user reviews
        axios.get(`${url}/allreviews`, {
          headers: {
            'xtoken': token
          }
        }).then(res => {
         // console.log(res.data);
          const userReviews = res.data.filter(review => review.taskworker === userId);
          setReviews(userReviews);
        }).catch(err => {
          console.error('Error fetching reviews:', err);
          setError('Failed to fetch reviews');
        });
      }).catch(err => {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data');
      });

      // Decode the token to get the task provider username
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setTaskProvider(decodedToken.user.username);
    }
  }, [userId]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios.post(`${url}/addreview`, {
      ...newReview,
      taskProvider, // Adding provider's username
      taskworker: userId
    }, {
      headers: {
        'xtoken': token
      }
    }).then(res => {
      setReviews(prevReviews => [...prevReviews, {
        ...newReview,
        taskprovider: taskProvider,
        taskworker: userId
      }]);
      setNewReview({ work: '', description: '', rating: '' });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
    }).catch(err => {
      console.error('Error adding review:', err);
      setError('Failed to add review');
    });
  };

  if (!localStorage.getItem('token')) {
    return (
      <div style={styles.expiredSession}>
        <p>Your session expired, please login again.</p>
        <Link to="/login" style={styles.loginLink}>Login</Link>
      </div>
    );
  }

  if (error) {
    return <div style={styles.container}><p>{error}</p></div>;
  }

  if (!userData) {
    return <div style={styles.container}><p>Loading...</p></div>;
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
        <img
          src={userData.profileImage || '/profile-picture-icon-14.jpg'}
          alt="Profile"
          style={styles.profileImage}
        />
        <h1>{userData.fullname}</h1>
        <p>Email: {userData.email}</p>
        <p>Contact: {userData.contact}</p>
        <h3>Skills:</h3>
        <ul style={styles.skillsList}>
          {userData.skills.length > 0 ? (
            userData.skills.map((skill, index) => (
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
        <h3>Reviews:</h3>
        <div style={styles.reviewsContainer}>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} style={styles.reviewCard}>
                <p><strong>Provider:</strong> {review.taskprovider}</p>
                <p><strong>Project:</strong> {review.work}</p>
                <p><strong>Description:</strong> {review.description}</p>
                <p><strong>Rating:</strong> {review.rating}</p>
              </div>
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </div>
        <h3>Add a Review:</h3>
        <form onSubmit={handleReviewSubmit} style={styles.reviewForm}>
          <label style={styles.label}>
            Work:
            <input
              type="text"
              name="work"
              value={newReview.work}
              onChange={handleReviewChange}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Description:
            <textarea
              name="description"
              value={newReview.description}
              onChange={handleReviewChange}
              style={styles.textarea}
              required
            />
          </label>
          <label style={styles.label}>
            Rating:
            <input
              type="text"
              name="rating"
              value={newReview.rating}
              onChange={handleReviewChange}
              style={styles.input}
              placeholder="out of 5 (e.g., 5/5)"
              required
            />
          </label>
          <button type="submit" style={styles.submitButton}>Add Review</button>
        </form>
        {showPopup && <div style={styles.popup}>Review added successfully!</div>}
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
  linkContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  profileContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  profileImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    marginBottom: '1rem',
    border: '2px solid #fff', // Add a border to the profile image
  },
  skillsList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  skillItem: {
    fontSize: '1rem',
    padding: '0.5rem',
    borderRadius: '4px',
    color: '#333', // Dark text for better contrast
    fontWeight: 'bold', // Highlight skills
  },
  reviewsContainer: {
    marginTop: '1rem',
    textAlign: 'left',
    width: '100%',
    maxWidth: '800px',
  },
  reviewCard: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#f9f9f9',
  },
  reviewForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    maxWidth: '500px',
    margin: '1rem 0',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  submitButton: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#2196f3',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  popup: {
    position: 'fixed',
    top: '10%',
    right: '10%',
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '1rem',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    zIndex: 1000,
  },
  expiredSession: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    color: '#333',
  },
  loginLink: {
    color: '#007bff',
    fontSize: '18px',
    textDecoration: 'none',
    marginTop: '10px',
  },
};

export default Profile;
