import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AuthPage from './components/AuthPage';
import Analyse from './pages/Analyse';

function App() {
    const isLogin = !!localStorage.getItem("token");

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login/" />} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<AuthPage isLogin={false} />} />
                <Route path="/analyse" element={<Analyse isLogin={isLogin} />} />
            </Routes>
        </Router>
    );
}

export default App;
