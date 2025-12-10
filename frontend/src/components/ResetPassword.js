import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './styles/ResetPassword.module.css';

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

function ResetPassword() {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("New passwords do not match.");
            return;
        }

        const csrftoken = getCookie('csrftoken');
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/account/resetpassword/', {
              current_password: passwords.currentPassword,
              new_password: passwords.newPassword,
              confirm_new_password: passwords.confirmPassword,
            }, {
              headers: {
                'X-CSRFToken': csrftoken,
              }
            });

            if (response.status === 200) {
                alert('Password changed successfully.');
                navigate('/account');
            }
        } catch (error) {
            console.error("Error changing password:", error.response.data);
            alert('An error occurred while changing the password.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Reset Password</h2>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label className={styles.label}>
                        Current Password:
                        <input
                            className={styles.input}
                            type="password"
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>
                        New Password:
                        <input
                            className={styles.input}
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>
                        Confirm New Password:
                        <input
                            className={styles.input}
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.button}>
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ResetPassword;
