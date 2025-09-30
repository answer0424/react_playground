import { HashRouter, Route, Routes } from 'react-router-dom';
import Roulette from './page/roulette';
import './App.css';
import Mafia from "./page/mafia";
import Home from "./page/home";
import Game2048 from "./page/Game2048";
import SwordGame from "./page/sword";
import HomeButton from "./component/homeButton";
import JumpMap from "./page/jump";

function withHomeButton(Component) {
    return (
        <>
            <HomeButton />
            <Component />
        </>
    );
}

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={withHomeButton(Home)} />
                <Route path="/roulette" element={withHomeButton(Roulette)} />
                <Route path="/mafia" element={withHomeButton(Mafia)} />
                <Route path="/2048" element={withHomeButton(Game2048)} />
                <Route path="/sword" element={withHomeButton(SwordGame)} />
                <Route path="/jump" element={withHomeButton(JumpMap)} />
            </Routes>
        </HashRouter>
    );
}

export default App;