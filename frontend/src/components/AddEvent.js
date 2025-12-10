import React, { Component } from 'react';
import axios from 'axios';
import styles from './styles/AddEvent.module.css';
import EventMap from './EventMap';

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

class AddEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      start_datetime: '',
      end_datetime: '',
      address: '',
      category: '',
      slots_number: '',
      categories: [],
      location: null,
    };
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(response => {
        this.setState({ categories: response.data });
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }

  handleLocationSelect = (latlng) => {
    this.setState({ location: { lat: latlng.lat, lng: latlng.lng } });
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
  event.preventDefault();
  const { name, description, start_datetime, end_datetime, address, category, slots_number, location } = this.state;
  const formattedStartDatetime = new Date(start_datetime).toISOString();
  const formattedEndDatetime = new Date(end_datetime).toISOString();
  const eventData = {
    name,
    description,
    start_datetime: formattedStartDatetime,
    end_datetime: formattedEndDatetime,
    address,
    category,
    slots_number: Number(slots_number),
    totalSlots: Number(slots_number),
    latitude: location ? location.lat : null,
    longitude: location ? location.lng : null,
  };

    const csrftoken = getCookie('csrftoken');
    axios.post('http://127.0.0.1:8000/api/addevent/', eventData, {
      headers: { 'X-CSRFToken': csrftoken }
    })
    .then(response => {
      console.log('Event added successfully:', response.data);
      if (response.data && response.data.id) {
        const eventId = response.data.id;
        console.log(`Newly created event ID: ${eventId}`);
        window.location.href = `/events/${eventId}`;
      } else {
        console.error('No event ID returned from server.');
      }
    })
    .catch(error => {
      console.error('Error adding event:', error);
      console.error('Error data:', error.response);
    });
  };

    render() {
      return (
        <div className={styles.addEventPage}>
          <div className={styles.addEventContainer}>
            <h1 className={styles.header}>Add Event</h1>
            <form onSubmit={this.handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={this.state.description}
                  onChange={this.handleInputChange}
                  required
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="start_datetime" className={styles.label}>Start Date and Time:</label>
                <input
                  type="datetime-local"
                  id="start_datetime"
                  name="start_datetime"
                  value={this.state.start_datetime}
                  onChange={this.handleInputChange}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="end_datetime" className={styles.label}>End Date and Time:</label>
                <input
                  type="datetime-local"
                  id="end_datetime"
                  name="end_datetime"
                  value={this.state.end_datetime}
                  onChange={this.handleInputChange}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.label}>Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={this.state.address}
                  onChange={this.handleInputChange}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>Category:</label>
                <select
                  id="category"
                  name="category"
                  value={this.state.category}
                  onChange={this.handleInputChange}
                  required
                  className={styles.select}
                >
                  <option value="">Select a category</option>
                  {this.state.categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="slots_number" className={styles.label}>Number of Slots:</label>
                <input
                  type="number"
                  id="slots_number"
                  name="slots_number"
                  value={this.state.slots_number}
                  onChange={this.handleInputChange}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.mapContainer}>
                <EventMap
                  location={this.state.location}
                  onLocationSelected={this.handleLocationSelect}
                />
              </div>
              <div className={styles.formGroup}>
                <button type="submit" className={styles.submitButton}>Add Event</button>
              </div>

            </form>
          </div>
        </div>
      );
    }

}

export default AddEvent;
