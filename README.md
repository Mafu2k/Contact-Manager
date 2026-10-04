# Menedżer Kontaktów

Książka adresowa w czystym JavaScripcie, bez frameworka. Kontakty pobiera z testowego API
[DummyJSON](https://dummyjson.com/docs/users), a na liście można je wyszukiwać, sortować,
dodawać, edytować i usuwać. DummyJSON tylko symuluje zapis, więc zmiany nie zostają na serwerze.
Po odświeżeniu strony wraca stan z API.

Rzeczy, które przydają się na co dzień, trzymam w `localStorage`:

- ulubione i ostatnio oglądane kontakty,
- wybrane sortowanie,
- szkic niedokończonego formularza,
- kopię listy kontaktów, żeby aplikacja pokazała cokolwiek, kiedy API nie odpowiada.

## Uruchomienie

```bash
npm install
npm start        # serwer deweloperski webpacka
npm run build    # wersja produkcyjna w dist/
```

## Kod

- `js/main.js` podpina zdarzenia i steruje przepływem,
- `js/api.js` to cienka warstwa nad `fetch` do DummyJSON,
- `js/ui.js` renderuje listę oraz obsługuje filtrowanie, sortowanie i modal,
- `js/storage.js` zawiera wszystko, co dotyczy `localStorage`.

## Licencja

MIT
