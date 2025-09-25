import React, { useState } from 'react';
import styles from '../css/sword.module.css';

const MAX_LEVEL = 100;

function getChance(level) {
    if (level >= MAX_LEVEL) return 0.01;
    return Math.max(0.999 - (level - 1) * 0.01, 0.01);
}

function getMaxRecord() {
    return parseInt(localStorage.getItem('sword_max') || '1', 10);
}

function setMaxRecord(level) {
    localStorage.setItem('sword_max', String(level));
}

export default function SwordGame() {
    const [level, setLevel] = useState(40);
    const [event, setEvent] = useState('');
    const [maxRecord, setMaxRecordState] = useState(getMaxRecord());
    const [successAnim, setSuccessAnim] = useState(false);
    const [isDestroyed, setIsDestroyed] = useState(false);

    const handleClick = () => {
        setIsDestroyed(false);
    };

    const tryUpgrade = () => {
        if (level >= MAX_LEVEL) return;
        const chance = getChance(level);
        const rand = Math.random();
        if (rand < chance) {
            setLevel(l => l + 1);
            setEvent('강화 성공!');
            setSuccessAnim(true);
        } else {
            const failRand = Math.random();
            const failRate = 1 - chance;
            const keepRate = failRate * 0.8;
            const downRate = failRate * 0.15;

            if (failRand < keepRate) {
                setEvent('강화 실패! 그대로 유지');
            } else if (failRand < keepRate + downRate) {
                setLevel(l => Math.max(1, l - 1));
                setEvent('강화 실패! 1단계 강등');
            } else {
                if (level > maxRecord) {
                    setMaxRecord(level);
                    setMaxRecordState(level);
                }
                setLevel(1);
                setIsDestroyed(true);
                setEvent(`강화 실패! 검이 파괴됨 (최고 기록: +${level})`);
            }
            setSuccessAnim(false);
        }
        setTimeout(() => {
            setEvent('');
            setSuccessAnim(false);
        }, 1200);
    };

    const swordClass = level >= 60
        ? styles.swordLegend
        : level >= 40
            ? styles.swordEpic
            : level >= 20
                ? styles.swordRare
                : styles.swordNormal;

    return (
        <div className={styles.container}>
            <div className={styles.gameCard}>
                <h2>검 키우기 확률 강화</h2>
                <div className={styles.swordArea}>
                    <div
                        className={`${styles.sword} ${swordClass} ${successAnim ? styles.swordSuccess : ''}`}
                    >
                        <span className={styles.swordLevel}>+{level}</span>
                    </div>
                </div>
                <button className={styles.upgradeBtn} onClick={tryUpgrade} disabled={level >= MAX_LEVEL}>
                    {level < MAX_LEVEL ? '강화하기' : '최대강화'}
                </button>
                <div className={styles.chance}>성공 확률: {(getChance(level) * 100).toFixed(1)}%</div>
                <div className={styles.maxRecord}>최고 기록: +{maxRecord}</div>
                {event && <div className={styles.event}>{event}</div>}
                {isDestroyed && (
                    <img
                        src="data:image/jpeg;base64,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"
                        alt="파괴 이미지"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            objectFit: 'cover',
                            zIndex: 9999
                        }}
                        onClick={handleClick}
                    />
                )}
            </div>
        </div>
    );
}