import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import OpinionForm from './OpinionForm';
import styles from './styles/User.module.css';

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

function User() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [opinions, setOpinions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetailsAndOpinions = async () => {
      setIsLoading(true);
      const csrftoken = getCookie('csrftoken');
      try {
        const userDetailsResponse = await axios.get(`http://127.0.0.1:8000/api/users/${id}/`, {
          headers: {
            'X-CSRFToken': csrftoken,
          },
        });
        setUser(userDetailsResponse.data);

        const opinionsResponse = await axios.get(`http://127.0.0.1:8000/api/users/${id}/opinions/`, {
          headers: {
            'X-CSRFToken': csrftoken,
          },
        });
        setOpinions(opinionsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    };

    fetchUserDetailsAndOpinions();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  const renderOpinions = () => {
    return opinions.length > 0 ? (
      opinions.map((opinion) => (
        <div key={opinion.id}>
          <strong>Author: {opinion.author_username}</strong>
          <p>{opinion.text}</p>
        </div>
      ))
    ) : (
      <p>No opinions about this user yet.</p>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>User Details</h1>
      <div className={styles.detail}><strong>Username:</strong> {user.username}</div>
      <div className={styles.detail}><strong>Email:</strong> {user.email}</div>
      <div className={styles.detail}><strong>First Name:</strong> {user.first_name}</div>
      <div className={styles.detail}><strong>Last Name:</strong> {user.last_name}</div>
      <OpinionForm userId={id} className={styles.opinionForm} />
      <div className={styles.opinionsSection}>
        <h2>Opinions About User</h2>
        {renderOpinions()}
      </div>
    </div>
  );
}

export default User;
