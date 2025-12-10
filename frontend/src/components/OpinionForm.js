import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/OpinionForm.module.css';

function OpinionForm({ userId }) {
  const [opinionText, setOpinionText] = useState('');

  const handleChatRedirect = () => {
    window.location.href = `http://127.0.0.1:8000/chats/${userId}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const csrftoken = getCookie('csrftoken');

      const response = await axios.post(`http://127.0.0.1:8000/api/users/${userId}/create_opinion/`, {
        text: opinionText,
      }, {
        headers: {
          'X-CSRFToken': csrftoken,
          'Content-Type': 'application/json'
        },
      });

      console.log('Opinion created:', response.data);
      setOpinionText('');
    } catch (error) {
      console.error('Error creating opinion:', error);
    }
  };

  return (
    <div className={styles.opinionFormContainer}>
      <button type="button" onClick={handleChatRedirect} className={styles.chatButton}>
        Chat
      </button>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <textarea
          className={styles.textArea}
          value={opinionText}
          onChange={(e) => setOpinionText(e.target.value)}
          required
        />
        <button type="submit" className={styles.submitButton} disabled={!opinionText.trim()}>
          Submit Opinion
        </button>
      </form>
    </div>
  );
}
export default OpinionForm;
