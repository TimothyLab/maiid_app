import axios from 'axios';

export interface User {
    id_user: number;
    login: string;
    password: string;
    nom: string;
    prenom: string;
    date_inscription: string;
    id_groupe: number;
    role: string;
}


export const getUsersS = async (token: string): Promise<User[]> => {
    try {
        const response = await axios.get<User[]>('http://127.0.0.1:8000/auth/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error(error);  // Pour afficher les erreurs dans la console
        throw new Error('Erreur lors de la récupération des utilisateurs.');
    }
};

export const getUsers = async (token: string) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/auth/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,  // Utilisation du token
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur de requête:", error);
      throw error;
    }
  };
