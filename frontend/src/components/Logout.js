import React, { Component } from 'react';

export default class Logout extends Component {
    componentDidMount() {
        const getCSRFToken = () => {
            return document.cookie.split(';').find(row => row.trim().startsWith('csrftoken=')).split('=')[1];
        }

        window.localStorage.removeItem("isAuthenticated");
        fetch('/api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            }
        }).then(response => {
            if (response.status === 200) {
                this.props.history.push("/home");
            }
        });
    }

    render() {
        return <p>Trwa wylogowywanie...</p>;
    }
}
