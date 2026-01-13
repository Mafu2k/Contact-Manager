const STORAGE_KEYS = {
    CONTACTS: 'contacts_cache',
    SORT_PREF: 'sort_preference',
    FORM_DRAFT: 'form_draft',
    FAVORITES: 'favorites',
    RECENT: 'recent_contacts'
};

// kontakty sa przezucone do pamieci lokalnej
export function cacheContacts(contacts) {
    try {
        const data = JSON.stringify(contacts);
        localStorage.setItem(STORAGE_KEYS.CONTACTS, data);
    } catch (error) {
        console.error('Błąd podczas zapisywania cache:', error);
    }
}

export function getCachedContacts() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Błąd podczas odczytu cache:', error);
        return null;
    }
}

export function saveSortPreference(sortType) {
    try {
        localStorage.setItem(STORAGE_KEYS.SORT_PREF, sortType);
    } catch (error) {
        console.error('Błąd podczas zapisywania preferencji:', error);
    }
}

export function getSortPreference() {
    try {
        return localStorage.getItem(STORAGE_KEYS.SORT_PREF) || 'default';
    } catch (error) {
        console.error('Błąd podczas odczytu preferencji:', error);
        return 'default';
    }
}

// po odsiwezeniu nadal sa dane w formule
export function saveFormDraft(formData) {
    try {
        const data = JSON.stringify(formData);
        localStorage.setItem(STORAGE_KEYS.FORM_DRAFT, data);
    } catch (error) {
        console.error('Błąd podczas zapisywania draftu:', error);
    }
}

export function getFormDraft() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.FORM_DRAFT);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Błąd podczas odczytu draftu:', error);
        return null;
    }
}

export function clearFormDraft() {
    try {
        localStorage.removeItem(STORAGE_KEYS.FORM_DRAFT);
    } catch (error) {
        console.error('Błąd podczas usuwania draftu:', error);
    }
}

// ulunbione
export function addToFavorites(contactId) {
    try {
        const favorites = getFavorites();
        if (!favorites.includes(contactId)) {
            favorites.push(contactId);
            localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        }
    } catch (error) {
        console.error('Błąd podczas dodawania do ulubionych:', error);
    }
}

export function removeFromFavorites(contactId) {
    try {
        let favorites = getFavorites();
        favorites = favorites.filter(id => id !== contactId);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
        console.error('Błąd podczas usuwania z ulubionych:', error);
    }
}

export function getFavorites() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Błąd podczas odczytu ulubionych:', error);
        return [];
    }
}

export function isFavorite(contactId) {
    const favorites = getFavorites();
    return favorites.includes(contactId);
}

// historia przegladania
export function addToRecent(contactId) {
    try {
        let recent = getRecent();
        recent = recent.filter(id => id !== contactId);
        recent.unshift(contactId);
        if (recent.length > 10) {
            recent = recent.slice(0, 10);
        }
        localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recent));
    } catch (error) {
        console.error('Błąd podczas dodawania do ostatnich:', error);
    }
}

export function getRecent() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.RECENT);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Błąd podczas odczytu ostatnich:', error);
        return [];
    }
}
