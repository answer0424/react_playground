import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/home.module.css';
import { event } from '../utils/ga';


function Home() {

    const handleClickEvent = (game, value) => {
        event({
            action: 'click_link',
            category: 'home',
            label: game,
            value: value,
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>게임 플레이그라운드</h1>
            <div className={styles.cardGrid}>
                <Link to="/roulette" className={styles.card} onClick={() => handleClickEvent('roulette', 1)}>
                    <span className={styles.cardTitle}>룰렛 게임</span>
                    <span className={styles.cardDesc}>운명을 돌려보세요!</span>
                </Link>
                <Link to="/mafia" className={styles.card} onClick={() => handleClickEvent('mafia', 2)}>
                    <span className={styles.cardTitle}>마피아 게임</span>
                    <span className={styles.cardDesc}>추리와 심리전의 세계</span>
                </Link>
                <Link to="/2048" className={styles.card} onClick={() => handleClickEvent('2048', 3)}>
                    <span className={styles.cardTitle}>2048 게임</span>
                    <span className={styles.cardDesc}>퍼즐</span>
                </Link>
            </div>
            <div className={styles.cardGrid}>
                <Link to="/sword" className={styles.card} onClick={() => handleClickEvent('sword', 4)}>
                    <span className={styles.cardTitle}>sword 게임</span>
                    <span className={styles.cardDesc}>강화</span>
                </Link>
                <Link to="/jump" className={styles.card} onClick={() => handleClickEvent('jump', 5)}>
                    <span className={styles.cardTitle}>jump 게임</span>
                    <span className={styles.cardDesc}>점프맵</span>
                </Link>
            </div>
        </div>
    );
}

export default Home;