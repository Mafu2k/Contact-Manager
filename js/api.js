const API_URL = 'https://dummyjson.com/users';

export async function getAllContacts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data.users;
    } catch (error) {
        console.error('Błąd podczas pobierania kontaktów:', error);
        throw error;
    }
}

export async function getContact(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Błąd podczas pobierania kontaktu:', error);
        throw error;
    }
}

// tworzenie nowego usera
export async function createContact(contactData) {
    try {
        const response = await fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        });

        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Błąd podczas tworzenia kontaktu:', error);
        throw error;
    }
}

export async function updateContact(id, contactData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        });

        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Błąd podczas aktualizacji kontaktu:', error);
        throw error;
    }
}

// usuwanie kontaktu
export async function deleteContact(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Błąd podczas usuwania kontaktu:', error);
        throw error;
    }
}
