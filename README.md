# Menedżer Kontaktów

Aplikacja webowa do zarządzania listą kontaktów — dodawanie, edycja, usuwanie
i przeglądanie wpisów. Napisana w czystym JavaScript (bez frameworka), z podziałem
na moduły i budowana bundlerem Webpack. Dane przechowywane lokalnie w przeglądarce.

## Funkcjonalności

- Dodawanie nowych kontaktów
- Edycja i usuwanie istniejących wpisów
- Lista kontaktów z podglądem danych
- Trwałe przechowywanie danych po stronie przeglądarki (localStorage)

## Stack

- JavaScript (ES modules, bez frameworka)
- Webpack (konfiguracja osobno dla dev i prod)
- HTML5 / CSS3
- PWA-ready (manifest, favicony)

## Struktura projektu

```
js/
├── main.js       # punkt wejścia
├── app.js        # inicjalizacja i spinanie modułów
├── ui.js         # renderowanie i obsługa interfejsu
├── api.js        # warstwa danych / operacje na kontaktach
└── storage.js    # zapis i odczyt z localStorage
webpack.common.js, webpack.config.dev.js, webpack.config.prod.js
```

## Uruchomienie

Wymagania: Node.js.

```bash
npm install
npm start
```

Serwer deweloperski (`webpack serve`) otworzy aplikację w przeglądarce.
Build produkcyjny do katalogu `dist/`:

```bash
npm run build
```

## Autor

Łukasz Janicki

## Licencja

MIT — szczegóły w pliku [LICENSE.txt](LICENSE.txt).
