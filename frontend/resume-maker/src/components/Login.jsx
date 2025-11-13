import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { authStyles as styles } from '../assets/dummystyle';
import { Input } from './Input';
import { validateEmail } from "../utils/helpas";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    if (!password) {
      setError('Please enter a password');
      return;
    }

    setError(null);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });

      // Backend should return: { token: "JWT_STRING", user: { ... } }
      const token = response.data.token;
      const user = response.data.user;

      if (token) {
        console.log('Token received:', token);
        localStorage.setItem('token', token); // store only JWT string
        console.log('Token stored in localStorage:', localStorage.getItem('token'));
        updateUser({...response.data}); // update context with complete response data including token
        navigate('/dashboard'); // go to dashboard
      } else {
        setError('Login failed: No token returned');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong, please try again');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>Welcome Back</h3>
        <p className={styles.subtitle}>Sign In To Continue Building Amazing Resume</p>
      </div>

      <form onSubmit={handleLogin} className={styles.form}>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          placeholder="example@gmail.com"
          type="email"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          placeholder="Min 8 Characters"
          type="password"
        />
        {error && <div className={styles.errorMessage}>{error}</div>}
        <button type="submit" className={styles.submitButton}>Sign In</button>

        <p className={styles.switchText}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => setCurrentPage('signUp')}
            className={styles.switchButton}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
