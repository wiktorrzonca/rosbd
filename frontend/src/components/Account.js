import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './styles/Account.module.css';

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

function Account() {
    const [userData, setUserData] = useState({
        email: '',
        first_name: '',
        last_name: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const csrftoken = getCookie('csrftoken');
        const config = {
            headers: {
                'X-CSRFToken': csrftoken,
            }
        };

        axios.get('http://127.0.0.1:8000/api/account/', config)
            .then(response => {
                setUserData(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error loading account data:", error);
                setIsLoading(false);
            });
    }, []);

    const handleEditClick = () => {
        navigate('/edit/account');
    };

    if (isLoading) {
        return <div>Loading your account details...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Your Profile</h1>
            <div className={styles.info}>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>First Name:</strong> {userData.first_name}</p>
                <p><strong>Last Name:</strong> {userData.last_name}</p>
            </div>
            <button className={styles.editButton} onClick={handleEditClick}>
                Edit Account
            </button>
        </div>
    );
}

export default Account;
