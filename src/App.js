import { HashRouter, Route, Routes } from 'react-router-dom';
import Roulette from './page/roulette';
import './App.css';
import Mafia from "./page/mafia";
import Home from "./page/home";
import Game2048 from "./page/Game2048";
import SwordGame from "./page/sword";

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/roulette" element={<Roulette />} />
                <Route path="/mafia" element={<Mafia />} />
                <Route path="/2048" element={<Game2048 />} />
                <Route path="/sword" element={<SwordGame />} />
            </Routes>
        </HashRouter>
    );
}

export default App;