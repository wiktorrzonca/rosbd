import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/MyEvents.module.css';

export default class ReservationDetail extends Component {
    state = {
        reservations: [],
    };

    componentDidMount() {
        this.fetchReservations();
    }

    fetchReservations() {
        fetch('http://127.0.0.1:8000/api/myreservations/')
            .then(response => response.json())
            .then(data => this.setState({ reservations: data }))
            .catch(error => console.error('Error fetching reservations:', error));
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
        return date.toLocaleString(undefined, options);
    }

    render() {
        return (
            <div className={styles.myeventsContainer}>
                <h2>My Reservations</h2>
                <ul className={styles.eventsList}>
                    {this.state.reservations.map(reservation => (
                        <li key={reservation.id} className={styles.eventItem}>
                            <Link to={`/events/${reservation.event.event_id}/`} className={styles.eventLink}>
                                <h3>{reservation.event.event_name}</h3>
                                <p>Address: {reservation.event.address}</p>
                                <p>Reservation Date: {this.formatDate(reservation.creation_date)}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
