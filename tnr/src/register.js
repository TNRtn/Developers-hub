import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import url from './urls';

const Register = () => {
  const [data, setData] = useState({
    fullname: '',
    email: '',
    contact: '',
    skills: '',
    password: '',
    confirmpassword: ''
  });

  //const [errors, setErrors] = useState({});
  const [popupMessage, setPopupMessage] = useState({ type: '', message: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const changeHandler = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!data.fullname) newErrors.fullname = 'Full name is required.';
    if (!data.email) newErrors.email = 'Email is required.';
    if (!data.contact) newErrors.contact = 'Contact number is required.';
    if (!data.skills) newErrors.skills = 'Skills are required.';
    if (!data.password) newErrors.password = 'Password is required.';
    if (data.password !== data.confirmpassword) newErrors.confirmpassword = 'Passwords do not match.';
    
    return newErrors;
  };

  const submitHandler = async e => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      // Set validation errors as popup messages
      Object.values(validationErrors).forEach(error => setPopupMessage({ type: 'error', message: error }));
      return;
    }
    
    let obj = {
      "fullname": data.fullname,
      "email": data.email,
      "skills": data.skills,
      "contact": data.contact,
      "password": data.password,
      "confirmpassword": data.confirmpassword
    };
    
    try {
      const response = await axios.post(url + '/register', obj);
     // console.log(response);
      setPopupMessage({ type: 'success', message: 'Registration successful!' });
      navigate('/login');
    } catch (err) {
      let errorMessage = err.response.data;
      setPopupMessage({ type: 'error', message: errorMessage });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div style={styles.container}>
      {popupMessage.message && (
        <div style={{ ...styles.popup, ...(popupMessage.type === 'success' ? styles.success : styles.error) }}>
          {popupMessage.message}
        </div>
      )}
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
      <div style={styles.overlay}>
        <div style={styles.formContainer}>
          <h1 style={styles.heading}>Register</h1>
          <form style={styles.form} onSubmit={submitHandler}>
            <div style={styles.formGroup}>
              <input type="text" placeholder="Enter your full name" name="fullname" value={data.fullname} onChange={changeHandler} className="form-control my-2" style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <input type="email" placeholder="Enter your email" name="email" value={data.email} onChange={changeHandler} className="form-control my-2" style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <input type="text" placeholder="Enter your mobile number" name="contact" value={data.contact} onChange={changeHandler} className="form-control my-2" style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <input type="text" placeholder="Enter your skills" name="skills" value={data.skills} onChange={changeHandler} className="form-control my-2" style={styles.input} />
              <div style={styles.skillsNote}>Please provide skills separated by commas.</div>
            </div>
            <div style={styles.formGroup}>
              <div style={styles.passwordWrapper}>
                <input type={passwordVisible ? "text" : "password"} placeholder="Enter your password" name="password" value={data.password} onChange={changeHandler} className="form-control my-2" style={styles.input} />
                <span onClick={togglePasswordVisibility} style={styles.eyeIcon}>{passwordVisible ? '👁️' : '👁️‍🗨️'}</span>
              </div>
            </div>
            <div style={styles.formGroup}>
              <div style={styles.passwordWrapper}>
                <input type={confirmPasswordVisible ? "text" : "password"} placeholder="Confirm your password" name="confirmpassword" value={data.confirmpassword} onChange={changeHandler} className="form-control my-2" style={styles.input} />
                <span onClick={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>{confirmPasswordVisible ? '👁️' : '👁️‍🗨️'}</span>
              </div>
            </div>
            <button type="submit" className="btn btn-success" style={styles.button}>Register</button>
            <div style={styles.footer}>
              <p style={styles.footerText}>Already have an account? <Link to="/login" style={styles.signupLink}>Login</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundImage: 'url("https://images3.content-hci.com/commimg/myhotcourses/blog/post/myhc_89683.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
  },
  popup: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '1rem',
    borderRadius: '5px',
    zIndex: 1000,
  },
  success: {
    backgroundColor: 'green',
    color: 'white',
  },
  error: {
    backgroundColor: 'red',
    color: 'white',
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
  navList: {
    listStyleType: 'none',
    display: 'flex',
    margin: 0,
    padding: 0,
    flexWrap: 'wrap',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '1rem',
  },
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(90vh - 60px)', // Adjust based on navbar height
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '1rem',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '600px',
    color: '#000',
    maxHeight: '100vh',
    overflowY: 'auto',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '1rem',
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  skillsNote: {
    marginTop: '0.5rem',
    fontSize: '0.875rem',
    color: '#777',
    fontStyle: 'italic',
  },
  passwordWrapper: {
    position: 'relative',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '1rem',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '1rem',
  },
  footerText: {
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
  },
  signupLink: {
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  eyeIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '1.2rem',
  },
};

export default Register;
