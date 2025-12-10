import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import MyEvents from "./MyEvents";
import Events from "./Events";
import Navbar from "./Navbar";
import EditAccount from "./EditAccount";
import Chats from "./Chats";
import EventDetails from './EventDetails';
import Login from './Login';
import Logout from './Logout';
import AddEvent from './Addevent';
import Register from './Register';
import MyReservations from './MyReservations';
import EditEvent from './EditEvent';
import Account from './Account';
import User from './User';
import ResetPassword from './ResetPassword';
import ChatList from './ChatList';
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from 'react-router-dom';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Navbar />
                <Routes>
                    <Route path='/home' element={<HomePage />} />
                    <Route path='/myevents' element={<MyEvents />} />
                    <Route path='/events' element={<Events />} />
                    <Route path='/edit/account' element={<EditAccount />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/logout' element={<Logout />} />
                    <Route path='/addevent' element={<AddEvent />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/reservations' element={<MyReservations />} />
                    <Route path="/events/edit/:id" element={<EditEvent />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/user/:id" element={<User />} />
                    <Route path="/account/resetpassword" element={<ResetPassword />} />
                    <Route path="/chats" element={<ChatList />} />
                    <Route path="/chats/:userId" element={<Chats />} />
                </Routes>
            </Router>
        );
    }
}

const appDiv = document.getElementById("app");
render(<App name="wiki"/>, appDiv);
