import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles/Login.module.css';
import { useNavigate } from 'react-router-dom';

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        if (window.localStorage.getItem("isAuthenticated") === "true") {
            `window.location.href = "/home";`
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        const csrftoken = getCookie('csrftoken');

        try {
            const response = await axios.post('/api/login/', { username, password }, {
                headers: {
                    'X-CSRFToken': csrftoken
                }
            });
            if (response.status === 200) {
                console.log("Zalogowano pomyślnie!");
                window.localStorage.setItem("isAuthenticated", "true");
                window.location.href = "/home";
            } else {
                setError("Nie udało się zalogować. Spróbuj ponownie.");
            }

        } catch (error) {
            setError("Niepoprawne dane logowania.");
        }
    };

    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <h2>Login</h2>
          </div>
          <div className={styles.cardContent}>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleLogin}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
              <button type="submit" className={styles.loginButton}>LOGIN</button>
            </form>
            <div className={styles.socialLogin}>
            </div>
            <div className={styles.signupText}>
              <p>You don't have an account yet? Sign up!</p>
              <button onClick={() => navigate('/register')} className={styles.registerButton}>SIGN UP</button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Login;