import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Pour la navigation
import { getUsers, User } from './serviceAdmin';

const AdminUserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);  // Récupérer le rôle de l'utilisateur
    const navigate = useNavigate();  // Pour rediriger l'utilisateur si nécessaire

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Vous devez être connecté pour voir cette page.');
            return;
        }

        // Appelez l'API pour récupérer l'utilisateur et son rôle
        fetch('http://127.0.0.1:8000/auth/users/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des informations de l\'utilisateur');
            }
            return response.json();
        })
        .then((userData) => {
            const role = userData.role;
            setUserRole(role);  // Mettez à jour le rôle de l'utilisateur

            // Si l'utilisateur n'est pas un Admin, rediriger
            if (role !== 'Admin') {
                setError("Accès refusé : l'utilisateur n'a pas le rôle 'Admin'");
                navigate('/analyse');  // Rediriger si nécessaire
            } else {
                // Récupérer la liste des utilisateurs depuis l'API
                getUsers(token)
                    .then(setUsers)
                    .catch(() => setError("Accès refusé ou erreur lors du chargement."));
            }
        })
        .catch((error) => {
            setError(error.message);
        });
    }, [navigate]);

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="user-list">
            <h1>Gestion des Utilisateurs</h1>
            <h2>Rôle de l'utilisateur : {userRole}</h2>  {/* Affichage du rôle de l'utilisateur */}
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Login</th>
                        <th>Rôle</th>
                        <th>Date d'inscription</th>
                        <th>Identifiant</th>

                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id_user}>
                            <td>{user.nom}</td>
                            <td>{user.prenom}</td>
                            <td>{user.login}</td>
                            <td>{user.role}</td>
                            <td>{user.date_inscription}</td>
                            <td>{user.id_user}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserList;
