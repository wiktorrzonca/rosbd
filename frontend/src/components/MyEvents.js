import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/MyEvents.module.css';

export default class MyEvents extends Component {
    state = {
        events: [],
    };

    componentDidMount() {
        this.fetchEvents();
    }

    fetchEvents() {
        fetch('http://127.0.0.1:8000/api/myevents/')
            .then(response => response.json())
            .then(data => this.setState({ events: data }))
            .catch(error => console.error('Error fetching events:', error));
    }

    formatDate(dateString) {
        const options = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
        };
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }
        return date.toLocaleDateString(undefined, options);
    }

    render() {
        const { events } = this.state;

        return (
            <div className={styles.myeventsContainer}>
                <div className={styles.eventsHeader}>
                    <h2>My Events</h2>
                    <Link to="/addevent" className={styles.addEventBtn}>Create Event</Link>
                </div>
                {events.length > 0 ? (
                    <div>
                        <ul className={styles.eventsList}>
                            {events.map(event => (
                                <li key={event.event_id} className={styles.eventItem}>
                                    <Link to={`/events/${event.event_id}/`} className={styles.eventLink}>
                                        <h3>{event.event_name}</h3>
                                        <p>Address: {event.address || 'Not provided'}</p>
                                        <p>Date: {this.formatDate(event.start_datetime)}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className={styles.noEventsMessage}>
                        <p>You haven't created any events yet. Click the button above to start creating your first event!</p>
                    </div>
                )}
            </div>
        );
    }
}
