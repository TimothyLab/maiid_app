import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Analyse from './pages/Analyse';
import AdminUserList from './pages/AdminUserList';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
    const isLogin = !!localStorage.getItem("token");

    return (
        <Router>
            <div className="App">
                <Header />
                <div className="main-content-wrapper">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage isLogin={false} />} />
                        <Route path="/analyse" element={<Analyse isLogin={isLogin} />} />
                        {isLogin && (
                            <Route path="/admin/users" element={<AdminUserList />} />
                        )}
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
