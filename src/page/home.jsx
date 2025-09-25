import React from 'react';
import { Link } from 'react-router-dom';
import styles from './home.module.css';

function Home() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>게임 플레이그라운드</h1>
            <div className={styles.cardGrid}>
                <Link to="/roulette" className={styles.card}>
                    <span className={styles.cardTitle}>룰렛 게임</span>
                    <span className={styles.cardDesc}>운명을 돌려보세요!</span>
                </Link>
                <Link to="/mafia" className={styles.card}>
                    <span className={styles.cardTitle}>마피아 게임</span>
                    <span className={styles.cardDesc}>추리와 심리전의 세계</span>
                </Link>
            </div>
        </div>
    );
}

export default Home;