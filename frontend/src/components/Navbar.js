import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/NavBar.module.css';
import Logo from './images/Logo.png';

const Navbar = () => {
    const isAuthenticated = window.localStorage.getItem("isAuthenticated") === "true";

    const getCSRFToken = () => {
        let token = document.cookie.split(';').find(row => row.trim().startsWith('csrftoken='));
        return token ? token.split('=')[1] : null;
    }

    const handleLogout = (event) => {
        event.preventDefault();
        window.localStorage.removeItem("isAuthenticated");
        fetch('/api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            }
        }).then(response => {
            if (response.status === 200) {
                window.location.href = '/home';
            }
        }).catch(error => {
            console.error('Logout failed', error);
        });
    }

    return (
        <div className={styles.navbar}>
            <Link to="/home" className={styles.navLogo}>
                <img src={Logo} alt="Logo" className={styles.navbarLogo} />
            </Link>
            {isAuthenticated ? (
                <div className={styles.navItems}>
                    <Link to="/myevents" className={styles.navItem}>My events</Link>
                    <Link to="/reservations" className={styles.navItem}>My reservations</Link>
                    <Link to="/events" className={styles.navItem}>Events</Link>
                    <Link to="/chats" className={styles.navItem}>Chats</Link>
                    <Link to="/account" className={styles.navItem}>Account</Link>
                    <Link to="/" onClick={handleLogout} className={styles.navItem}>Logout</Link>
                </div>
            ) : (
                <div className={styles.navItems}>
                    <Link to="/login" className={`${styles.navItem} ${styles.navButton}`}>Login</Link>
                    <Link to="/register" className={`${styles.navItem} ${styles.navButton}`}>Register</Link>
                </div>
            )}
        </div>
    );
}

export default Navbar;
