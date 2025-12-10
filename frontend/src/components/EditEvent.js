import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './styles/EditEvent.module.css';

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

function EditEvent() {
    const [categories, setCategories] = useState([]);
    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        slots_number: '',
        address: '',
        category: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoriesAndEventData = async () => {
            setIsLoading(true);
            try {
                const categoriesResponse = await axios.get('http://127.0.0.1:8000/api/categories/');
                setCategories(categoriesResponse.data);

                const eventResponse = await axios.get(`http://127.0.0.1:8000/api/events/${id}/`);
                setEventData(eventResponse.data);

                setIsLoading(false);
            } catch (error) {
                console.error("Error loading data:", error);
                setIsLoading(false);
            }
        };

        fetchCategoriesAndEventData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData(prevState => ({
            ...prevState,
            [name]: value
        }));
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
            await axios.put(`http://127.0.0.1:8000/api/events/edit/${id}/`, eventData, config);
            navigate(`/events/${id}`);
        } catch (error) {
            console.error("Error updating event:", error.response.data);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your event?");
        if (confirmDelete) {
            const csrftoken = getCookie('csrftoken');
            const config = {
                headers: {
                    'X-CSRFToken': csrftoken,
                }
            };

            try {
                await axios.delete(`http://127.0.0.1:8000/api/events/delete/${id}/`, config);
                navigate('/events');
            } catch (error) {
                console.error("Error deleting event:", error.response.data);
            }
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Edit Event</h2>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label className={styles.label}>
                        Event Name:
                        <input
                            className={styles.input}
                            type="text"
                            name="name"
                            value={eventData.name}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>
                        Description:
                        <textarea
                            className={styles.textarea}
                            name="description"
                            value={eventData.description}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>
                        Start Date:
                        <input
                            className={styles.input}
                            type="date"
                            name="start_date"
                            value={eventData.start_date}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>
                        End Date:
                        <input
                            className={styles.input}
                            type="date"
                            name="end_date"
                            value={eventData.end_date}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>
                        Number of Slots:
                        <input
                            className={styles.input}
                            type="number"
                            name="slots_number"
                            value={eventData.slots_number}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>
                        Address:
                        <input
                            className={styles.input}
                            type="text"
                            name="address"
                            value={eventData.address}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>
                        Category:
                        <select
                            className={styles.input}
                            name="category"
                            value={eventData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.button}>
                        Update Event
                    </button>
                    <button type="button" className={styles.button} onClick={handleDelete}>
                        Delete Event
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditEvent;
