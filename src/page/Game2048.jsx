import React, { useState, useEffect } from 'react';
import styles from '../css/Game2048.module.css';

const SIZE = 4;

function getEmptyBoard() {
    return Array(SIZE).fill().map(() => Array(SIZE).fill(0));
}

function addRandom(board) {
    const empty = [];
    board.forEach((row, i) =>
        row.forEach((cell, j) => {
            if (cell === 0) empty.push([i, j]);
        })
    );
    if (empty.length === 0) return board;
    const [i, j] = empty[Math.floor(Math.random() * empty.length)];
    board[i][j] = Math.random() < 0.9 ? 2 : 4;
    return board;
}

// slide 함수에서 점수 계산
function slide(row, onScore) {
    const arr = row.filter(n => n);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            const merged = arr[i] * 2;
            arr[i] = merged;
            arr[i + 1] = 0;
            // 512 이상이면 2배 점수, 아니면 그냥 값
            if (merged >= 512) {
                onScore(merged * 2);
            } else {
                onScore(merged);
            }
        }
    }
    return arr.filter(n => n).concat(Array(SIZE - arr.filter(n => n).length).fill(0));
}

function rotate(board) {
    return board[0].map((_, i) => board.map(row => row[SIZE - 1 - i]));
}

function move(board, dir, onScore) {
    let newBoard = board.map(row => [...row]);
    for (let k = 0; k < dir; k++) {
        newBoard = rotate(newBoard);
    }
    newBoard = newBoard.map(row => slide(row, onScore));
    for (let k = 0; k < (4 - dir) % 4; k++) {
        newBoard = rotate(newBoard);
    }
    return newBoard;
}

function isGameOver(board) {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (board[i][j] === 0) return false;
            if (i < SIZE - 1 && board[i][j] === board[i + 1][j]) return false;
            if (j < SIZE - 1 && board[i][j] === board[i][j + 1]) return false;
        }
    }
    return true;
}

function getScoreList() {
    const list = localStorage.getItem('game2048_scores');
    return list ? JSON.parse(list) : [];
}

function saveScore(score) {
    const list = getScoreList();
    list.unshift(score);
    localStorage.setItem('game2048_scores', JSON.stringify(list.slice(0, 10)));
}

export default function Game2048() {
    const [board, setBoard] = useState(() => addRandom(addRandom(getEmptyBoard())));
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [scoreList, setScoreList] = useState(getScoreList());

    useEffect(() => {
        const handleKey = e => {
            if (gameOver) return;
            let dir = null;
            if (e.key === 'ArrowLeft') dir = 0;
            if (e.key === 'ArrowUp') dir = 1;
            if (e.key === 'ArrowRight') dir = 2;
            if (e.key === 'ArrowDown') dir = 3;
            if (dir !== null) {
                let add = 0;
                const moved = move(board, dir, v => { add += v; });
                if (JSON.stringify(moved) !== JSON.stringify(board)) {
                    const next = addRandom(moved.map(row => [...row]));
                    setBoard(next);
                    setScore(s => s + add);
                    if (isGameOver(next)) {
                        setGameOver(true);
                        saveScore(score + add);
                        setScoreList(getScoreList());
                    }
                }
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [board, gameOver, score]);

    const restart = () => {
        setBoard(addRandom(addRandom(getEmptyBoard())));
        setGameOver(false);
        setScore(0);
    };

    return (
        <div className={styles.container} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
            <div className={styles.gameCard}>
                <div className={styles.gameCardContent}>

                    <div>
                        <h2>2048 퍼즐 게임</h2>
                        <div className={styles.board}>
                            {board.map((row, i) =>
                                <div key={i} className={styles.row}>
                                    {row.map((cell, j) =>
                                        <div key={j} className={`${styles.cell} ${cell ? styles[`cell${cell}`] : ''}`}>
                                            {cell !== 0 ? cell : ''}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>점수: {score}</div>
                        {gameOver && <div className={styles.over}>게임 오버!</div>}
                        <button className={styles.btn} onClick={restart}>다시 시작</button>
                        <div className={styles.hint}>방향키로 플레이하세요</div>
                    </div>
                    <div className={styles.scoreListContainer}>
                        <h3 className={styles.scoreListTitle}>점수 목록</h3>
                        <ul className={styles.scoreList}>
                            {scoreList.map((s, i) => (
                                <li key={i} className={styles.scoreItem}>{s}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}