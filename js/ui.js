import * as storage from './storage.js';

let allContacts = [];
let filteredContacts = [];
let currentView = 'all';

export function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
}

export function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}

export function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');

    setTimeout(() => {
        errorMsg.classList.add('hidden');
    }, 5000);
}

// rysowanie kart
export function renderContacts(contacts) {
    const contactsList = document.getElementById('contactsList');

    if (!contacts || contacts.length === 0) {
        contactsList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Brak kontaktów do wyświetlenia</p>';
        return;
    }

    contactsList.innerHTML = contacts.map(contact => {
        const isFav = storage.isFavorite(contact.id);
        return `
        <div class="contact-card" data-id="${contact.id}">
            <div class="contact-header">
                <h3>${contact.firstName} ${contact.lastName}</h3>
                <button class="btn-favorite ${isFav ? 'active' : ''}" data-id="${contact.id}" title="${isFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}">
                    <i class="${isFav ? 'fas' : 'far'} fa-star"></i>
                </button>
            </div>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Telefon:</strong> ${contact.phone}</p>
            <p><strong>Wiek:</strong> ${contact.age || 'Nie podano'}</p>
            <p><strong>Firma:</strong> ${contact.company?.name || 'Nie podano'}</p>
            <div class="contact-actions">
                <button class="btn-edit" data-id="${contact.id}"><i class="fas fa-edit"></i> Edytuj</button>
                <button class="btn-delete" data-id="${contact.id}"><i class="fas fa-trash"></i> Usuń</button>
            </div>
        </div>
        `;
    }).join('');
}

export function openModal(title = 'Dodaj nowy kontakt') {
    const modal = document.getElementById('contactModal');
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = title;
    modal.classList.remove('hidden');
}

export function closeModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.add('hidden');
    document.getElementById('contactForm').reset();
}

// przezucenie danych do pol
export function fillForm(contact) {
    document.getElementById('firstName').value = contact.firstName || '';
    document.getElementById('lastName').value = contact.lastName || '';
    document.getElementById('email').value = contact.email || '';
    document.getElementById('phone').value = contact.phone || '';
    document.getElementById('age').value = contact.age || '';
    document.getElementById('company').value = contact.company?.name || '';
}

export function getFormData() {
    return {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        age: parseInt(document.getElementById('age').value) || null,
        company: {
            name: document.getElementById('company').value
        }
    };
}

export function setContacts(contacts) {
    allContacts = contacts;
    filteredContacts = contacts;
}

export function getContacts() {
    return allContacts;
}

export function getFilteredContacts() {
    return filteredContacts;
}

// wyszukiwanie
export function filterContacts(searchTerm) {
    if (!searchTerm) {
        filteredContacts = allContacts;
        return filteredContacts;
    }

    const term = searchTerm.toLowerCase();
    filteredContacts = allContacts.filter(contact =>
        contact.firstName.toLowerCase().includes(term) ||
        contact.lastName.toLowerCase().includes(term)
    );

    return filteredContacts;
}

export function sortContacts(sortType) {
    let sorted = [...filteredContacts];

    switch(sortType) {
        case 'firstName':
            sorted.sort((a, b) => a.firstName.localeCompare(b.firstName));
            break;
        case 'lastName':
            sorted.sort((a, b) => a.lastName.localeCompare(b.lastName));
            break;
        case 'age':
            sorted.sort((a, b) => (a.age || 0) - (b.age || 0));
            break;
        default:
            sorted.sort((a, b) => a.id - b.id);
    }

    return sorted;
}

export function setCurrentView(view) {
    currentView = view;
}

export function getCurrentView() {
    return currentView;
}

export function getContactsByView(view) {
    if (view === 'favorites') {
        const favorites = storage.getFavorites();
        return allContacts.filter(c => favorites.includes(c.id));
    } else if (view === 'recent') {
        const recent = storage.getRecent();
        return recent.map(id => allContacts.find(c => c.id === id)).filter(c => c);
    }
    return allContacts;
}
