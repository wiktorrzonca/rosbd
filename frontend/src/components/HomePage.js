import React, { Component } from 'react';
import PhotoPartyCity from './images/PhotoPartyCity.jpg';
import PhotoParty from './images/PhotoParty.jpg';
import PhotoBasketball from './images/PhotoBasketball.jpg';
import PhotoTalking from './images/PhotoTalking.jpg';
import styles from './styles/HomePage.module.css';

export default class HomePage extends Component {
  render() {
    const headerStyle = {
      backgroundImage: `url(${PhotoPartyCity})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      borderRadius: '10px',
      marginTop: '15px',
    };

    return (
      <div className={styles.container}>
        <header className={`${styles.mainHeader} ${styles.mainHeaderAfter}`} style={headerStyle}>
          <h1 className={styles.mainTitle}>Create opportunities today!</h1>
          <p className={styles.mainDescription}>Loci is the perfect solution for those who want to actively spend time in their community</p>
        </header>

        <div className={`${styles.card} ${styles.introText}`}>
          <p>If you've ever felt lonely and lacked someone to talk to, play basketball with, or go out to party, this platform is for you. It allows you to create your own events and invite residents of your city. It's a great opportunity to meet new people and discover local attractions together.</p>
        </div>

        <div className={styles.imageContainer}>
          <div className={`${styles.card} ${styles.cardHover}`}>
            <img src={PhotoParty} className={styles.photo} alt="Partying" />
            <div className={styles.textContent}>
              <h2 className={styles.cardTitle}>Party together</h2>
              <p className={styles.cardDescription}>Discover the best parties in your city and meet new people.</p>
            </div>
          </div>

          <div className={`${styles.card} ${styles.cardHover}`}>
            <img src={PhotoBasketball} className={styles.photo} alt="Basketball" />
            <div className={styles.textContent}>
              <h2 className={styles.cardTitle}>Play sports</h2>
              <p className={styles.cardDescription}>Find local groups and play sports with other people.</p>
            </div>
          </div>

          <div className={`${styles.card} ${styles.cardHover}`}>
            <img src={PhotoTalking} className={styles.photo} alt="Conversations" />
            <div className={styles.textContent}>
              <h2 className={styles.cardTitle}>Meet people</h2>
              <p className={styles.cardDescription}>Engage in inspiring conversations and share experiences.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
