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


export const getUsers = async (token: string) => {
    try {
      const response = await axios.get('/auth/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`, 
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur de requête:", error);
      throw error;
    }
  };

  export const updateUser = async (id: number, updatedData: Partial<User>, token: string): Promise<void> => {
    try {
        const response = await fetch(`/auth/users/${id}`, {
            method: 'PUT',  
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la mise à jour de l'utilisateur.");
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
        throw error;
    }
};

