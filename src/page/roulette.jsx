import React, { useRef, useState, useEffect } from "react";
import styles from "../css/roulette.module.css";

const INIT_DATA = [
];

const COLORS = ["#FFECB3", "#FFCC80", "#FFD6E0", "#B2EBF2", "#C8E6C9", "#D1C4E9", "#FFF9C4", "#FFAB91"];

// drawRoulette 함수: 바늘을 12시 방향(위쪽)으로 수정
function drawRoulette(ctx, data, angle, width, height) {
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2, cy = height / 2, radius = Math.min(cx, cy) - 10;
    const n = data.length;

    // 바깥 테두리
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 8, 0, 2 * Math.PI);
    ctx.shadowColor = "#ffd180";
    ctx.shadowBlur = 16;
    ctx.strokeStyle = "#ffb347";
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.restore();

    if (n === 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#eee";
        ctx.fill();
        ctx.stroke();
        return;
    }
    const arc = (2 * Math.PI) / n;
    for (let i = 0; i < n; i++) {
        // 섹터 그라데이션
        const grad = ctx.createLinearGradient(
            cx + Math.cos(angle + (i + 0.5) * arc - Math.PI / 2) * radius,
            cy + Math.sin(angle + (i + 0.5) * arc - Math.PI / 2) * radius,
            cx, cy
        );
        grad.addColorStop(0, COLORS[i % COLORS.length]);
        grad.addColorStop(1, "#fffbe6");

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, angle + i * arc - Math.PI / 2, angle + (i + 1) * arc - Math.PI / 2);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.shadowColor = "#ffe0b2";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 텍스트
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle + (i + 0.5) * arc - Math.PI / 2);
        ctx.textAlign = "right";
        ctx.font = "bold 18px sans-serif";
        ctx.fillStyle = "#b26a00";
        ctx.shadowColor = "#fff9c4";
        ctx.shadowBlur = 4;
        ctx.fillText(data[i].option, radius - 18, 8);
        ctx.restore();
    }

    // 중앙 입체 원
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, 44, 0, 2 * Math.PI);
    const centerGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 44);
    centerGrad.addColorStop(0, "#fffbe6");
    centerGrad.addColorStop(1, "#ffd180");
    ctx.fillStyle = centerGrad;
    ctx.shadowColor = "#ffe0b2";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    // 바늘 (12시 방향)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius - 18);
    ctx.lineTo(cx - 16, cy - radius + 18);
    ctx.lineTo(cx + 16, cy - radius + 18);
    ctx.closePath();
    ctx.fillStyle = "#ff9800";
    ctx.shadowColor = "#ffb347";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();

    // 바늘 중앙 원
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy - radius + 8, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#ffb347";
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

export default function Roulette() {
    const [data, setData] = useState(INIT_DATA);
    const [isSpinning, setIsSpinning] = useState(false);
    const [angle, setAngle] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [newFood, setNewFood] = useState("");
    const [canStop, setCanStop] = useState(false);
    const [result, setResult] = useState(null);
    const stopTimeout = useRef(null);
    const reqRef = useRef(null);
    const canvasRef = useRef(null);
    const autoStopTimeout = useRef(null);


    // 룰렛 그리기
    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        drawRoulette(ctx, data, angle, 340, 340);
    }, [data, angle]);

    // 애니메이션
    useEffect(() => {
        if (!isSpinning) return;
        let last = performance.now();
        function animate(now) {
            const dt = (now - last) / 1000;
            last = now;
            setAngle(a => (a + speed * dt) % (2 * Math.PI));
            reqRef.current = requestAnimationFrame(animate);
        }
        reqRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(reqRef.current);
    }, [isSpinning, speed]);

    // 멈추기 버튼 3초 제한
    useEffect(() => {
        if (!isSpinning && speed === 0 && data.length > 0 && result === null) {
            const n = data.length;
            const arc = (2 * Math.PI) / n;
            const idx = Math.floor(((2 * Math.PI - (angle % (2 * Math.PI))) % (2 * Math.PI)) / arc);
            setResult(data[idx].option);
        }
    }, [isSpinning, speed, angle, data, result]);

    // 룰렛 돌리기 버튼 클릭
    const handleSpinClick = () => {
        if (data.length === 0 || isSpinning) return;
        setResult(null);
        setSpeed(8);
        setIsSpinning(true);
        setCanStop(true);
        // 5초 후 자동 감속
        autoStopTimeout.current = setTimeout(() => {
            setCanStop(false);
            startDecelerate();
        }, 5000);
        // 5초 후 멈추기 버튼 비활성화
        stopTimeout.current = setTimeout(() => setCanStop(false), 5000);
    };

    // 감속 함수 분리
    const startDecelerate = () => {
        let currentSpeed = speed;
        function decelerate() {
            if (currentSpeed > 0.2) {
                currentSpeed *= 0.96;
                setSpeed(currentSpeed);
                setTimeout(decelerate, 16);
            } else {
                setSpeed(0);
                setIsSpinning(false);
            }
        }
        decelerate();
    };

    // 멈추기 버튼 클릭
    const handleStopClick = () => {
        if (isSpinning && canStop) {
            setCanStop(false);
            clearTimeout(autoStopTimeout.current);
            clearTimeout(stopTimeout.current);
            startDecelerate();
        }
    };

    const handleAddFood = (e) => {
        e.preventDefault();
        if (!newFood.trim()) return;
        setData([...data, { option: newFood.trim() }]);
        setNewFood("");
    };

    const handleDeleteFood = (idx) => {
        const newData = data.filter((_, i) => i !== idx);
        setData(newData);
        setResult(null);
        setAngle(0);
    };

    return (
        <div className={styles.rouletteRoot}>
            <div className={styles.modalCard}>
                <div className={styles.rouletteContainer} style={{ flex: 1 }}>
                    <h2>음식 룰렛</h2>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <canvas
                            ref={canvasRef}
                            width={340}
                            height={340}
                            style={{ background: "#fff", borderRadius: "50%", boxShadow: "0 2px 8px #eee" }}
                        />
                    </div>
                    <button
                        className={styles.spinButton}
                        onClick={handleSpinClick}
                        disabled={data.length === 0 || isSpinning}
                    >
                        룰렛 돌리기
                    </button>
                    <button
                        className={styles.spinButton}
                        onClick={handleStopClick}
                        disabled={!isSpinning || !canStop}
                        style={{ marginLeft: 10 }}
                    >
                        멈추기
                    </button>
                </div>
                <div className={styles.sidePanel}>
                    <h3>항목 관리</h3>
                    <form onSubmit={handleAddFood} style={{ marginBottom: 10 }}>
                        <input
                            type="text"
                            value={newFood}
                            onChange={e => setNewFood(e.target.value)}
                            placeholder="음식 이름 입력"
                            className={styles.input}
                        />
                        <button type="submit" className={styles.addButton}>추가</button>
                    </form>
                    <div className={styles.foodTableWrapper}>
                        <table className={styles.foodTable}>
                            <thead>
                            <tr>
                                <th>음식명</th>
                                <th>삭제</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.option}</td>
                                    <td>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteFood(idx)}
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}