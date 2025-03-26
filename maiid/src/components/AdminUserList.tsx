import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, User, updateUser } from './serviceAdmin';
import '../App.css';

const AdminUserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [editUserId, setEditUserId] = useState<number | null>(null);
    const [editedUser, setEditedUser] = useState<Partial<User>>({});

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Vous devez être connecté pour voir cette page.');
            return;
        }

        fetch('http://192.168.1.144:8000/auth/users/me', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            if (!response.ok) throw new Error("Erreur lors de la récupération des informations de l'utilisateur");
            return response.json(); 
        })
        .then(userData => {
            console.log("userdata", userData.role);
            const role = userData.role;
            setUserRole(role);

            if (role !== 'Admin') {
                setError("Accès refusé : l'utilisateur n'a pas le rôle 'Admin'");
                navigate('/analyse');
            } else {
                getUsers(token)
                    .then(setUsers)
                    .catch(() => setError("Accès refusé ou erreur lors du chargement."));
            }            
        })
        .catch((error) => setError(error.message));
    }, [navigate]);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleEditClick = (user: User) => {
        setEditUserId(user.id_user);
        setEditedUser({
            nom: user.nom,
            prenom: user.prenom,
            login: user.login,
            role: user.role,
        });
    };

    const handleSaveClick = (id: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Vous devez être connecté pour voir cette page.');
            return;
        }
        updateUser(id, editedUser,token).then(() => {
            setUsers(users.map(user => (user.id_user === id ? { ...user, ...editedUser } : user)));
            setEditUserId(null);
        });
    };

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="table-container">
            <h1>Gestion des Utilisateurs</h1>
            <h2>Rôle de l'utilisateur : {userRole}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Login</th>
                        <th>Rôle</th>
                        <th>Date d'inscription</th>
                        <th>Identifiant</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id_user}>
                            <td>{editUserId === user.id_user ? <input type="text" name="nom" value={editedUser.nom || ''} onChange={handleEditChange} /> : user.nom}</td>
                            <td>{editUserId === user.id_user ? <input type="text" name="prenom" value={editedUser.prenom || ''} onChange={handleEditChange} /> : user.prenom}</td>
                            <td>{editUserId === user.id_user ? <input type="text" name="login" value={editedUser.login || ''} onChange={handleEditChange} /> : user.login}</td>
                            <td>{editUserId === user.id_user ? (
                                <select name="role" value={editedUser.role || ''} onChange={handleEditChange}>
                                    <option value="Admin">Admin</option>
                                    <option value="Visiteur">Visiteur</option>
                                    <option value="Utilisateur">Utilisateur</option>
                                </select>
                            ) : user.role}
                            </td>
                            <td>{user.date_inscription}</td>
                            <td>{user.id_user}</td>
                            <td>
                                {editUserId === user.id_user ? (
                                    <button  onClick={() => handleSaveClick(user.id_user)}>Enregistrer</button>
                                ) : (
                                    <button onClick={() => handleEditClick(user)}>Modifier</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => navigate('/analyse')}>Retour à l'analyse</button>
        </div>
    );
};

export default AdminUserList;
