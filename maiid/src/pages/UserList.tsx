import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminUserList from '../components/AdminUserList';

const App: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // On fait une requête vers le backend pour vérifier si l'utilisateur est admin
            fetch('http://192.168.1.144:8000/admin/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => {
                    if (response.ok) {
                        setIsAdmin(true); // L'utilisateur est admin, on le laisse accéder à la page
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la vérification du rôle : ", error);
                });
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route
                    path="/admin/users"
                    element={isAdmin ? <AdminUserList /> : <Navigate to="/" />}
                />
                {/* Autres routes */}
            </Routes>
        </Router>
    );
};

export default App;
