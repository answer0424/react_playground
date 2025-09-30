import React, { useRef, useEffect, useState } from 'react';
import styles from '../css/jump.module.css';

const GRAVITY = 0.7;
const JUMP_POWER = -12;
const MOVE_SPEED = 5;
const PLAYER_SIZE = 30;
const GROUND_Y = 400;
const PLATFORM_W = 60;
const PLATFORM_H = 16;

const stages = Array.from({ length: 10 }, (_, idx) => {
    const count = 4 + idx;
    return Array.from({ length: count }, (__, i) => {
        const isLeft = i % 2 === 0;
        const x = isLeft
            ? 80 + (i * 300) / (count - 1)
            : 400 + ((i - 1) * 300) / (count - 1);
        const y = 350 - i * (180 / (count - 1));
        return {
            x,
            y,
            w: PLATFORM_W + (i === count - 1 ? 20 : 0),
            h: PLATFORM_H,
        };
    });
});

export default function JumpMap() {
    const [stage, setStage] = useState(0);
    const [player, setPlayer] = useState({ x: 50, y: GROUND_Y - PLAYER_SIZE, vx: 0, vy: 0, onGround: false });
    const [win, setWin] = useState(false);
    const jumpCount = useRef(0);
    const keys = useRef({ left: false, right: false, up: false });
    const jumpPressed = useRef(false);

    useEffect(() => {
        setPlayer({ x: 50, y: GROUND_Y - PLAYER_SIZE, vx: 0, vy: 0, onGround: false });
        setWin(false);
        jumpCount.current = 0;
    }, [stage]);

    useEffect(() => {
        const handleKeyDown = e => {
            if (e.code === 'ArrowLeft') keys.current.left = true;
            if (e.code === 'ArrowRight') keys.current.right = true;
            if (e.code === 'Space') keys.current.up = true;
        };
        const handleKeyUp = e => {
            if (e.code === 'ArrowLeft') keys.current.left = false;
            if (e.code === 'ArrowRight') keys.current.right = false;
            if (e.code === 'Space') keys.current.up = false;
            jumpPressed.current = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        let raf;
        const loop = () => {
            setPlayer(prev => {
                let { x, y, vx, vy, onGround } = prev;
                vx = 0;
                if (keys.current.left) vx -= MOVE_SPEED;
                if (keys.current.right) vx += MOVE_SPEED;

                // 더블 점프: 키가 눌릴 때만 점프, 한 번만 처리
                if (keys.current.up && !jumpPressed.current && jumpCount.current < 2) {
                    vy = JUMP_POWER;
                    jumpCount.current += 1;
                    onGround = false;
                    jumpPressed.current = true;
                }

                vy += GRAVITY;
                x += vx;
                y += vy;

                // 바닥 충돌
                if (y + PLAYER_SIZE > GROUND_Y) {
                    y = GROUND_Y - PLAYER_SIZE;
                    vy = 0;
                    onGround = true;
                    jumpCount.current = 0;
                }

                // 플랫폼 충돌
                let onLastPlatform = false;
                stages[stage].forEach((p, idx) => {
                    if (
                        x + PLAYER_SIZE > p.x &&
                        x < p.x + p.w &&
                        y + PLAYER_SIZE > p.y &&
                        y + PLAYER_SIZE - vy <= p.y
                    ) {
                        y = p.y - PLAYER_SIZE;
                        vy = 0;
                        onGround = true;
                        jumpCount.current = 0;
                        if (idx === stages[stage].length - 1) {
                            onLastPlatform = true;
                        }
                    }
                });

                // 마지막 발판 위에 있을 때만 클리어
                if (onLastPlatform && !win) setWin(true);

                // 좌우 경계
                x = Math.max(0, Math.min(x, 760 - PLAYER_SIZE));

                return { x, y, vx, vy, onGround };
            });
            raf = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(raf);
    }, [stage, win]);

    const handleNext = () => {
        if (stage < stages.length - 1) {
            setStage(stage + 1);
        } else {
            alert('모든 맵을 클리어했습니다!');
            setStage(0);
        }
    };

    const handleJumpButton = () => {
        keys.current.up = true;
    };

    return (
        <div className={styles.mapArea}>
            <div className={styles.ground} />
            {stages[stage].map((p, i) => (
                <div
                    key={i}
                    className={i === stages[stage].length - 1 ? styles.lastPlatform : styles.platform}
                    style={{ left: p.x, top: p.y, width: p.w, height: p.h }}
                />
            ))}
            <div
                className={styles.player}
                style={{
                    left: player.x,
                    top: player.y,
                    width: PLAYER_SIZE,
                    height: PLAYER_SIZE,
                }}
            />
            <button
                style={{
                    position: 'absolute',
                    right: 20,
                    bottom: 40,
                    padding: '0.7rem 1.5rem',
                    fontSize: '1.2rem',
                    borderRadius: '12px',
                    background: '#ffd54f',
                    border: '2px solid #ff7043',
                    cursor: 'pointer',
                    zIndex: 10,
                }}
                onClick={handleJumpButton}
            >
                점프
            </button>
            {win && (
                <div className={styles.winMsg}>
                    클리어!
                    <button onClick={handleNext} style={{ marginLeft: '1rem', fontSize: '1rem' }}>
                        다음 맵
                    </button>
                </div>
            )}
            <div style={{ position: 'absolute', left: 10, top: 10, fontWeight: 'bold' }}>
                스테이지: {stage + 1} / {stages.length}
            </div>
        </div>
    );
}