import React, { Component } from 'react';
import axios from 'axios';
import PhotoRegister from './images/PhotoRegister.jpg';
import styles from './styles/Register.module.css';

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

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      first_name: '',
      last_name: '',
      error: null
    };
  }

  checkUsernameAvailability = () => {
    const username = this.state.username;
    axios.get(`http://127.0.0.1:8000/api/check_username/?username=${username}`)
      .then(response => {
        if (response.data.is_taken) {
          this.setState({ error: "Nazwa użytkownika jest już zajęta." });
        } else {
          this.setState({ error: null });
        }
      })
      .catch(error => {
        console.error('Wystąpił błąd podczas sprawdzania nazwy użytkownika:', error);
      });
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => {
      if (name === 'username') {
        this.checkUsernameAvailability();
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
    };

    const csrftoken = getCookie('csrftoken');

    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/api/register/',
      data: userData,
      headers: { 'X-CSRFToken': csrftoken },
    })
    .then(response => {
      if (response.status === 201) {
        console.log("Registration successful!");
        window.location.href = "/login";
      }
    })
    .catch(error => {
      console.error("Error during registration. Please try again.", error);
      this.setState({ error: "Wystąpił błąd podczas rejestracji. Spróbuj ponownie." });
    });
  };

render() {
  return (
    <div className={styles.registerPage}>
      <div className={styles.sideImage} style={{ backgroundImage: `url(${PhotoRegister})` }} />
      <div className={styles.formContainer}>
        <h1>Rejestracja</h1>
        {this.state.error && <p className={styles.errorMessage}>{this.state.error}</p>}
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="first_name">Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            className={styles.inputField}
            value={this.state.first_name}
            onChange={this.handleInputChange}
            required
          />
          <label htmlFor="last_name">Last name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            className={styles.inputField}
            value={this.state.last_name}
            onChange={this.handleInputChange}
            required
          />
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            className={styles.inputField}
            value={this.state.username}
            onChange={this.handleInputChange}
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.inputField}
            value={this.state.email}
            onChange={this.handleInputChange}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            className={styles.inputField}
            value={this.state.password}
            onChange={this.handleInputChange}
            required
          />
          <input type="submit" value="Create your account" className={styles.submitButton} />
        </form>
        <button
          className={styles.loginRedirectButton}
          onClick={() => window.location.href = '/login'}>
      Already have an account? Sign in!
    </button>
      </div>
    </div>
  );
}

}

export default Register;
