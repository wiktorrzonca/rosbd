import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './styles/EditAccount.module.css';

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

function EditAccount() {
    const [userData, setUserData] = useState({
        email: '',
        first_name: '',
        last_name: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/edit/account/')
            .then(response => {
                setUserData({
                    ...userData,
                    email: response.data.email,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name
                });
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error loading account data:", error);
                setIsLoading(false);
            });
    }, []);

    const handlePasswordChange = () => {
    navigate('/account/resetpassword');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const csrftoken = getCookie('csrftoken');
        const config = {
            headers: {
                'X-CSRFToken': csrftoken,
            }
        };

        try {
            await axios.patch('http://127.0.0.1:8000/api/edit/account/', userData, config);
            navigate('/account');
        } catch (error) {
            console.error("Error updating account:", error.response.data);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Edit Account</h2>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label className={styles.label}>
                        Email:
                        <input className={styles.input} type="email" name="email" value={userData.email} onChange={handleChange} />
                    </label>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>
                        First Name:
                        <input className={styles.input} type="text" name="first_name" value={userData.first_name} onChange={handleChange} />
                    </label>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>
                        Last Name:
                        <input className={styles.input} type="text" name="last_name" value={userData.last_name} onChange={handleChange} />
                    </label>
                </div>
                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.button}>Update Account</button>
                    <button type="button" onClick={handlePasswordChange} className={styles.button}>Change Password</button>
                </div>
            </form>
        </div>
    );

}

export default EditAccount;
