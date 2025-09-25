import { useNavigate } from 'react-router-dom';

export default function HomeButton() {
    const navigate = useNavigate();
    return (
        <button
            style={{
                position: 'fixed',
                top: 20,
                left: 20,
                zIndex: 1000,
                padding: '0.5rem 1.2rem',
                borderRadius: '8px',
                border: 'none',
                background: '#4e9cff',
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem'
            }}
            onClick={() => navigate('/')}
        >
            홈으로
        </button>
    );
}