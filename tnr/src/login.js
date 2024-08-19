import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import url from './urls';

const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url + '/login', data);
      localStorage.setItem('token', response.data.token);
      setRedirect(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  if (redirect) {
    return <Navigate to="/dashboard" />;
  }

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
      <div style={styles.overlay}>
        <div style={styles.formContainer}>
          <h1 style={styles.heading}>Login</h1>
          <form style={styles.form} onSubmit={submitHandler}>
            <div style={styles.formGroup}>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                onChange={changeHandler}
                className="form-control my-2"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                onChange={changeHandler}
                className="form-control my-2"
                style={styles.input}
              />
            </div>
            <button type="submit" className="btn btn-success" style={styles.button}>Login</button>
            {error && <div style={styles.error}>{error}</div>}
            <div style={styles.footer}>
              <p style={styles.footerText}>Don't have an account? <Link to="/register" style={styles.signupLink}>Sign Up</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

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
    height: 'calc(100vh - 60px)', // Adjust based on navbar height
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '1rem',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: '600px',
    color: '#000',
    maxHeight: '90vh',
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
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
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
  error: {
    color: 'red',
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
};

export default Login;
