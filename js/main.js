
import * as api from './api.js';
import * as ui from './ui.js';
import * as storage from './storage.js';

let currentEditId = null;


async function init() {
    ui.showLoader();

    try {
        const cachedContacts = storage.getCachedContacts();
        if (cachedContacts) {
            ui.setContacts(cachedContacts);
            ui.renderContacts(cachedContacts);
        }

        const contacts = await api.getAllContacts();
        ui.setContacts(contacts);
        storage.cacheContacts(contacts);

        const sortPref = storage.getSortPreference();
        document.getElementById('sortSelect').value = sortPref;

        if (sortPref !== 'default') {
            const sorted = ui.sortContacts(sortPref);
            ui.renderContacts(sorted);
        } else {
            ui.renderContacts(contacts);
        }

    } catch (error) {
        ui.showError('Nie udało się pobrać kontaktów. Sprawdź połączenie z internetem.');

        const cachedContacts = storage.getCachedContacts();
        if (cachedContacts) {
            ui.renderContacts(cachedContacts);
        }
    } finally {
        ui.hideLoader();
    }

    setupEventListeners();
}

// czesc od klikniec
function setupEventListeners() {
    document.getElementById('addNewBtn').addEventListener('click', () => {
        currentEditId = null;
        ui.openModal('Dodaj nowy kontakt');

        const draft = storage.getFormDraft();
        if (draft) {
            ui.fillForm(draft);
        }
    });

    document.querySelector('.close').addEventListener('click', ui.closeModal);
    document.getElementById('cancelBtn').addEventListener('click', ui.closeModal);

    document.getElementById('contactModal').addEventListener('click', (e) => {
        if (e.target.id === 'contactModal') {
            ui.closeModal();
        }
    });

    document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);

    // autozapis
    const formInputs = document.querySelectorAll('#contactForm input');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            const formData = ui.getFormData();
            storage.saveFormDraft(formData);
        });
    });

    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    document.getElementById('sortSelect').addEventListener('change', handleSort);

    // guziki na kartach
    document.getElementById('contactsList').addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const contactId = parseInt(target.dataset.id);

        if (target.classList.contains('btn-edit')) {
            handleEdit(contactId);
        } else if (target.classList.contains('btn-delete')) {
            handleDelete(contactId);
        } else if (target.classList.contains('btn-favorite')) {
            handleFavoriteToggle(contactId);
        }
    });

    // nawigacja sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            handleViewChange(e.currentTarget);
        });
    });
}

// obsługa wysyłania formularza
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = ui.getFormData();

    // walidacja
    if (!formData.firstName || formData.firstName.length < 2) {
        ui.showError('Imię musi mieć minimum 2 znaki');
        return;
    }

    if (!formData.lastName || formData.lastName.length < 2) {
        ui.showError('Nazwisko musi mieć minimum 2 znaki');
        return;
    }

    ui.showLoader();

    try {
        if (currentEditId) {
            // aktualizacja
            await api.updateContact(currentEditId, formData);

            // aktualizacja w lokalnej liście
            const contacts = ui.getContacts();
            const index = contacts.findIndex(c => c.id === currentEditId);
            if (index !== -1) {
                contacts[index] = { ...contacts[index], ...formData };
                ui.setContacts(contacts);
                storage.cacheContacts(contacts);
            }

            alert('Kontakt został zaktualizowany!');
        } else {
            // tworzenie nowego
            const newContact = await api.createContact(formData);


            const contacts = ui.getContacts();
            const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
            const contactToAdd = { id: newId, ...formData };
            contacts.push(contactToAdd);
            ui.setContacts(contacts);
            storage.cacheContacts(contacts);

            alert('Nowy kontakt został dodany!');
        }

        // odświeżenie widoku
        const sortType = document.getElementById('sortSelect').value;
        const sorted = ui.sortContacts(sortType);
        ui.renderContacts(sorted);

        ui.closeModal();
        storage.clearFormDraft();
        currentEditId = null;

    } catch (error) {
        ui.showError('Wystąpił błąd podczas zapisywania kontaktu');
    } finally {
        ui.hideLoader();
    }
}

// obsługa edycji
async function handleEdit(id) {
    const contacts = ui.getContacts();
    const contact = contacts.find(c => c.id === id);

    if (!contact) {
        ui.showError('Nie znaleziono kontaktu');
        return;
    }

    // dodaj do ostatnio przeglądanych
    storage.addToRecent(id);

    currentEditId = id;
    ui.openModal('Edytuj kontakt');
    ui.fillForm(contact);
}

// obsługa usuwania
async function handleDelete(id) {
    const confirmDelete = confirm('Czy na pewno chcesz usunąć ten kontakt?');

    if (!confirmDelete) {
        return;
    }

    ui.showLoader();

    try {
        await api.deleteContact(id);

        // usunięcie z lokalnej listy
        let contacts = ui.getContacts();
        contacts = contacts.filter(c => c.id !== id);
        ui.setContacts(contacts);
        storage.cacheContacts(contacts);

        // odświeżenie widoku
        const sortType = document.getElementById('sortSelect').value;
        const sorted = ui.sortContacts(sortType);
        ui.renderContacts(sorted);

        alert('Kontakt został usunięty');

    } catch (error) {
        ui.showError('Wystąpił błąd podczas usuwania kontaktu');
    } finally {
        ui.hideLoader();
    }
}

// obsługa wyszukiwania
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value;
    const filtered = ui.filterContacts(searchTerm);

    const sortType = document.getElementById('sortSelect').value;
    if (sortType !== 'default') {
        const sorted = ui.sortContacts(sortType);
        ui.renderContacts(sorted);
    } else {
        ui.renderContacts(filtered);
    }
}

// obsługa sortowania
function handleSort(e) {
    const sortType = e.target.value;
    storage.saveSortPreference(sortType);

    const sorted = ui.sortContacts(sortType);
    ui.renderContacts(sorted);
}

// obsługa przełączania ulubionych
function handleFavoriteToggle(id) {
    const isFav = storage.isFavorite(id);

    if (isFav) {
        storage.removeFromFavorites(id);
    } else {
        storage.addToFavorites(id);
    }


    refreshCurrentView();
}

// obsługa zmiany widoku (wszystkie/ulubione/ostatnie)
function handleViewChange(navItem) {

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });


    navItem.classList.add('active');

    // określenie widoku
    const view = navItem.dataset.view || 'all';
    ui.setCurrentView(view);


    refreshCurrentView();
}

// odświeża aktualny widok
function refreshCurrentView() {
    const currentView = ui.getCurrentView();
    const contacts = ui.getContactsByView(currentView);

    ui.setContacts(ui.getContacts()); // zachowaj wszystkie kontakty

    const sortType = document.getElementById('sortSelect').value;
    if (sortType !== 'default') {
        // ustaw filtrowane kontakty i posortuj
        const temp = ui.getFilteredContacts();
        ui.setContacts(ui.getContacts());

        // filtruj według widoku
        let toDisplay = contacts;

        // zastosuj wyszukiwanie jeśli jest
        const searchTerm = document.getElementById('searchInput').value;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            toDisplay = toDisplay.filter(contact =>
                contact.firstName.toLowerCase().includes(term) ||
                contact.lastName.toLowerCase().includes(term)
            );
        }

        ui.renderContacts(toDisplay);
    } else {
        ui.renderContacts(contacts);
    }
}


init();
