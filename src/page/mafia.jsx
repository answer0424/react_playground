import React, { useState } from 'react';
import styles from '../css/mafia.module.css';
import { event } from '../utils/ga';

export default function Mafia() {
    // roles: [{name: '마피아', count: 1}, ...]
    const [roles, setRoles] = useState([
        { name: '마피아', count: 1 },
        { name: '시민', count: 1 },
        { name: '경찰', count: 1 }
    ]);
    const [newRole, setNewRole] = useState('');
    const [players, setPlayers] = useState([]);
    const [newPlayer, setNewPlayer] = useState('');
    const [assigned, setAssigned] = useState(null);

    // 역할 추가
    const handleAddRole = e => {
        e.preventDefault();
        const trimmed = newRole.trim();
        if (trimmed && !roles.some(r => r.name === trimmed)) {
            setRoles([...roles, { name: trimmed, count: 1 }]);
            setNewRole('');
        }
    };

    // 역할 삭제
    const handleDeleteRole = idx => {
        setRoles(roles.filter((_, i) => i !== idx));
    };

    // 역할 개수 변경
    const handleRoleCountChange = (idx, value) => {
        const count = Math.max(1, parseInt(value) || 1);
        setRoles(roles.map((r, i) => i === idx ? { ...r, count } : r));
    };

    // 플레이어 추가
    const handleAddPlayer = e => {
        e.preventDefault();
        const trimmed = newPlayer.trim();
        if (trimmed && !players.includes(trimmed)) {
            setPlayers([...players, trimmed]);
            setNewPlayer('');
        }
    };

    // 플레이어 삭제
    const handleDeletePlayer = idx => {
        setPlayers(players.filter((_, i) => i !== idx));
    };

    // 역할 배정
    const handleAssign = () => {
        if (players.length === 0 || roles.length === 0) return;
        // 역할 목록 펼치기
        let roleList = roles.flatMap(r => Array(r.count).fill(r.name));
        while (roleList.length < players.length) roleList.push('시민');
        roleList = roleList.slice(0, players.length);
        // 랜덤 섞기
        const shuffled = roleList
            .map(r => ({ r, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ r }) => r);
        // 배정
        const result = players.map((name, i) => ({
            name,
            role: shuffled[i]
        }));
        setAssigned(result);
    };

    // 초기화
    const handleReset = () => setAssigned(null);

    const handleClickEvent = (eventName, screenName) => {
        event({
            action: eventName,
            screenName: screenName,
            userId: 'user1',
        });
    }

    return (
        <div className={styles.mafiaRoot}>
            <div className={styles.mafiaCard}>
                <h2 className={styles.title}>마피아 역할 배정기</h2>
                <div className={styles.sectionWrap}>
                    <div className={styles.section}>
                        <h3>역할 목록</h3>
                        <form onSubmit={handleAddRole} className={styles.inlineForm}>
                            <input
                                className={styles.input}
                                value={newRole}
                                onChange={e => setNewRole(e.target.value)}
                                placeholder="역할 추가"
                            />
                            <button className={styles.addBtn} type="submit">추가</button>
                        </form>
                        <ul className={styles.list}>
                            {roles.map((role, idx) => (
                                <li key={role.name} className={styles.listItem}>
                                    <span>{role.name}</span>
                                    <input
                                        type="number"
                                        min="1"
                                        className={styles.roleCountInput}
                                        value={role.count}
                                        onChange={e => handleRoleCountChange(idx, e.target.value)}
                                    />
                                    <button className={styles.delBtn} onClick={() => handleDeleteRole(idx)}>삭제</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.section}>
                        <h3>참가자 목록</h3>
                        <form onSubmit={handleAddPlayer} className={styles.inlineForm}>
                            <input
                                className={styles.input}
                                value={newPlayer}
                                onChange={e => setNewPlayer(e.target.value)}
                                placeholder="이름 추가"
                            />
                            <button className={styles.addBtn} type="submit">추가</button>
                        </form>
                        <ul className={styles.list}>
                            {players.map((name, idx) => (
                                <li key={name} className={styles.listItem}>
                                    {name}
                                    <button className={styles.delBtn} onClick={() => handleDeletePlayer(idx)}>삭제</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={styles.buttonWrap}>
                    <button
                        className={styles.assignBtn}
                        onClick={handleAssign}
                        disabled={players.length === 0 || roles.length === 0}
                        onMouseDown={() => handleClickEvent('mafia_assign', 'mafia')}
                    >
                        역할 배정
                    </button>
                    {assigned && (
                        <button className={styles.resetBtn} onClick={handleReset}>초기화</button>
                    )}
                </div>
                {assigned && (
                    <div className={styles.resultWrap}>
                        <h3>배정 결과</h3>
                        <div className={styles.resultList}>
                            {assigned.map(({ name, role }) => (
                                <div key={name} className={styles.resultCard}>
                                    <span className={styles.playerName}>{name}</span>
                                    <span className={styles.playerRole}>{role}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}