import { HashRouter, Route, Routes } from 'react-router-dom';
import Roulette from './page/roulette';
import './App.css';
import Mafia from "./page/mafia";
import Home from "./page/home";

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/roulette" element={<Roulette />} />
                <Route path="/mafia" element={<Mafia />} />
            </Routes>
        </HashRouter>
    );
}

export default App;