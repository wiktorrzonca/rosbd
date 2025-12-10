import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './styles/ChangePassword.module.css';

function ChangePassword() {
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            alert('Passwords do not match!');
            return;
        }

        const csrftoken = getCookie('csrftoken');
        try {
            await axios.post('http://127.0.0.1:8000/api/change-password/', passwordData, {
                headers: {
                    'X-CSRFToken': csrftoken,
                },
            });
            alert('Password successfully changed!');
            navigate('/account');
        } catch (error) {
            console.error('Error changing password:', error.response.data);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <button type="submit" className={styles.button}>Change Password</button>
            </form>
        </div>
    );
}

export default ChangePassword;
