const API_URL = 'https://dummyjson.com/users';

async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, options);
    if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
    }
    return response.json();
}

function jsonBody(method, data) {
    return {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };
}

export async function getAllContacts() {
    const data = await request('');
    return data.users;
}

export function getContact(id) {
    return request(`/${id}`);
}

export function createContact(contactData) {
    return request('/add', jsonBody('POST', contactData));
}

export function updateContact(id, contactData) {
    return request(`/${id}`, jsonBody('PUT', contactData));
}

export function deleteContact(id) {
    return request(`/${id}`, { method: 'DELETE' });
}
