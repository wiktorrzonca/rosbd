import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/MyEvents.module.css';

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/events/')
      .then(response => response.json())
      .then(data => {
        const sortedEvents = data.sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));
        setEvents(sortedEvents);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleString(undefined, options);
  };

  return (
    <div className={styles.myeventsContainer}>
      <div className={styles.eventsHeader}>
        <h2>Wydarzenia</h2>
      </div>
      <div>
        <ul className={styles.eventsList}>
          {events.map(event => (
            <li key={event.event_id} className={styles.eventItem}>
              <Link to={`/events/${event.event_id}/`} className={styles.eventLink}>
                <h3>{event.event_name}</h3>
                <p>Address: {event.address || 'Not provided'}</p>
                <p>Date: {formatDate(event.start_datetime)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Events;
