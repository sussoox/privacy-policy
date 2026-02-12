# TaskuDuuni

TaskuDuuni on palvelu, joka yhdistää nuoret ja paikalliset keikat. Palvelu mahdollistaa nuorten turvallisen työnhaun ja paikallisten asiakkaiden yhteydenotot.

## Ominaisuudet

- **Profiilin luonti**: Nuoret voivat luoda profiilin ja julkaista enintään 5 ilmoitusta
- **Tunnistautuminen**: Vahva tunnistautuminen SMS- tai sähköpostikoodilla
- **Huoltajan vahvistus**: Alaikäiset tarvitsevat huoltajan hyväksynnän
- **Maksuintegraatio**: Stripe-maksupalvelu julkaisuoikeuden aktivointiin (5 €)
- **Turvallinen**: Kaikki tiedot käsitellään turvallisesti

## Teknologiat

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Maksut**: Stripe API

## Asennus

1. Kloonaa repositorio:
```bash
git clone https://github.com/sussoox/privacy-policy.git
cd privacy-policy
```

2. Asenna riippuvuudet:
```bash
npm install
```

3. Luo `.env` tiedosto kopioimalla `.env.example`:
```bash
cp .env.example .env
```

4. Lisää Stripe API-avaimet `.env` tiedostoon:
   - Luo Stripe-tili osoitteessa https://stripe.com
   - Kopioi API-avaimet Dashboard > Developers > API keys
   - Lisää avaimet `.env` tiedostoon

## Käyttö

Käynnistä palvelin:
```bash
npm start
```

Avaa selaimessa: http://localhost:4242

## Sivurakenne

- `index.html` - Etusivu ja julkaisut
- `create-profile.html` - Profiilin luonti
- `dashboard.html` - Käyttäjän näkymä (omat julkaisut, maksu, asetukset)
- `success.html` - Onnistunut maksu
- `cancel.html` - Peruutettu maksu
- `app.js` - Client-side JavaScript
- `styles.css` - Tyylit
- `server.js` - Backend palvelin

## Kehitys

Projekti käyttää:
- Vanilla JavaScript (ei kehyksiä)
- CSS custom properties (muuttujat)
- LocalStorage käyttäjätietojen tallennukseen (demo)
- Stripe Checkout maksutapahtumille

## Turvallisuus

- Stripe hoitaa maksujen käsittelyn turvallisesti
- Tunnistautuminen koodilla (demo-tilassa)
- Huoltajan vahvistus alaikäisille

## Lisenssi

© 2026 TaskuDuuni
