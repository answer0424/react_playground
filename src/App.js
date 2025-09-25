import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Roulette from './page/roulette';
import './App.css';
import Mafia from "./page/mafia";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/roulette" element={<Roulette />} />
                <Route path="/mafia" element={<Mafia />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;