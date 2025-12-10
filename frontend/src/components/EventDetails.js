import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './styles/EventDetails.module.css';

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

function EventDetails() {
  const [eventData, setEventData] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [reservationId, setReservationId] = useState(null);
  const [reservations, setReservations] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const csrftoken = getCookie('csrftoken');

  useEffect(() => {
    const fetchEventAndUserData = async () => {
      setIsLoading(true);
      try {
        const eventResponse = await axios.get(`http://127.0.0.1:8000/api/events/${id}/`);
        setEventData(eventResponse.data);

        const userResponse = await axios.get('http://127.0.0.1:8000/api/current_user/', {
          headers: { 'X-CSRFToken': csrftoken },
        });
        setCurrentUser(userResponse.data);

        const reservationsResponse = await axios.get(`http://127.0.0.1:8000/api/events/${id}/reservations/`, {
          headers: { 'X-CSRFToken': csrftoken },
        });
        setReservations(reservationsResponse.data);

        const userIsRegistered = reservationsResponse.data.some(
          (reservation) => reservation.user.id === userResponse.data.id
        );

        setIsRegistered(userIsRegistered);
        if (userIsRegistered) {
          const userReservation = reservationsResponse.data.find(
            (reservation) => reservation.user.id === userResponse.data.id
          );
          setReservationId(userReservation.id);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    fetchEventAndUserData();
  }, [id, csrftoken]);

  const handleEdit = () => {
    navigate(`/events/edit/${id}`);
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
    };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleString(undefined, options);
  };

const handleReservation = async () => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/create_reservation/`,
      {
        event: id,
        slots_number: 1
      },
      {
        headers: {
          'X-CSRFToken': csrftoken,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 201) {
      alert('Reservation created.');
      setIsRegistered(true);
      setReservationId(response.data.id);
      setEventData(prev => ({ ...prev, slots_number: prev.slots_number - 1 }));
    }
  } catch (error) {
    console.error('Error creating reservation:', error.response.data);
  }
};

const handleRemoveReservation = async () => {
  if (window.confirm('Are you sure you want to remove this reservation?')) {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/delete_reservation/${reservationId}/`,
        {
          headers: {
            'X-CSRFToken': csrftoken
          }
        }
      );

      if (response.status === 204) {
        alert('Reservation removed.');
        setIsRegistered(false);
        setReservationId(null);
        setEventData(prev => ({ ...prev, slots_number: prev.slots_number + 1 }));
      }
    } catch (error) {
      console.error('Error removing reservation:', error);
    }
  }
};

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  const isOrganizer = currentUser && currentUser.id === eventData.organizator_user_id;
  const position = [eventData.latitude, eventData.longitude];

      return (
    <div className={styles.eventDetailsPage}>
      <div className={styles.eventInfoContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>{eventData.name}</h1>
        </div>
        <p className={styles.info}>{eventData.description}</p>
        <p className={styles.info}><span className={styles.infoTitle}>Start Date:</span> {formatDate(eventData.start_datetime)}</p>
        <p className={styles.info}><span className={styles.infoTitle}>End Date:</span> {formatDate(eventData.end_datetime)}</p>
        <p className={styles.info}><span className={styles.infoTitle}>Available Slots:</span> {eventData.slots_number}</p>
        <p className={styles.info}><span className={styles.infoTitle}>Address:</span> {eventData.address}</p>
        <p className={styles.info}><span className={styles.infoTitle}>Category:</span> {eventData.category_name || "No category"}</p>
        <div className={styles.mapContainer}>
          <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}></Marker>
          </MapContainer>
        </div>
        {isOrganizer ? (
          <button onClick={handleEdit} className={styles.editButton}>Edit</button>
        ) : isRegistered ? (
          <button onClick={handleRemoveReservation} className={styles.unregisterButton}>Unregister</button>
        ) : (
          <button onClick={handleReservation} className={styles.reserveButton}>Reserve a Slot</button>
        )}
      </div>

      <div className={styles.reservationsContainer}>
        <h2>Registered Users:</h2>
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <Link to={`/user/${reservation.user.id}`}>{reservation.user.username}</Link>
              {isOrganizer && (
                <button onClick={() => handleRemoveReservation(reservation.id)} className={styles.removeButton}>Remove</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EventDetails;