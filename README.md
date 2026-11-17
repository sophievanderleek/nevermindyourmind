# Never Mind Your Mind

Website van Never Mind Your Mind: mindfulness voor kinderen, door Sophie van der Leek in Amsterdam.

Een statische site met alleen HTML, CSS en JavaScript. Er is geen build-stap en er zijn geen dependencies nodig.

## Structuur

```
index.html            De website: Home, Mindfulness sessies, Op school, Over mij, Contact
privacy.html          Privacyverklaring
404.html              Pagina voor adressen die niet bestaan
assets/css/style.css  Opmaak
assets/js/main.js     Menu, reviews-slider en contactformulier
assets/img/           Foto's en de social-preview (og-image.jpg)
assets/fonts/         Lettertype Poppins, zelf gehost (SIL Open Font License)
favicon.ico, favicon.png, apple-touch-icon.png   Icoontjes
robots.txt, sitemap.xml                          Voor zoekmachines
```

## Lokaal bekijken

```
python3 -m http.server 8000
```

Open daarna http://localhost:8000 in je browser.

## Online zetten

Aanrader: **Netlify** of **Cloudflare Pages**. Beide zijn gratis, staan een zakelijke site toe, werken met een privé-repository en zetten de site automatisch opnieuw online bij elke wijziging in deze repository.

1. Log in bij Netlify of Cloudflare met je GitHub-account.
2. Maak een nieuwe site en kies deze repository.
3. Laat het build command leeg. Gebruik de hoofdmap (`/`) als publish- of outputmap.
4. Koppel daarna je domein `nevermindyourmind.nl`. HTTPS wordt automatisch geregeld.

GitHub Pages kan ook (Settings → Pages → branch `main`, map `/`), maar is gratis alleen voor publieke repositories, en volgens de voorwaarden van GitHub niet bedoeld voor zakelijke sites.

## Contactformulier

Berichten uit het formulier gaan via [FormSubmit](https://formsubmit.co) naar `sophie@nevermindyourmind.nl`. Daar is geen account voor nodig.

- **Eenmalig activeren:** vul het formulier na het online zetten één keer zelf in op je echte domein. Je krijgt dan een mail van FormSubmit: klik op **Activate Form**. Daarna komen berichten direct in je mailbox.
- Het e-mailadres staat bovenin het formulierdeel van `assets/js/main.js` (`MAILBOX`).
- Lukt versturen niet, dan krijgt de bezoeker een link om het bericht per e-mail te sturen, met de tekst al ingevuld.

## Domein

De site gaat uit van het adres `https://nevermindyourmind.nl`. Gebruik je een ander adres (bijvoorbeeld met `www`), pas het dan aan in:

- `index.html` en `privacy.html`: de regels met `canonical`, `og:url` en `og:image`
- `robots.txt` en `sitemap.xml`

## Nog te doen vóór livegang

- [ ] KvK-nummer in de footer van `index.html` en `privacy.html` zetten (zoek op `TODO`)
- [ ] Privacyverklaring nalezen, vooral de bewaartermijnen
- [ ] Schriftelijke toestemming van de ouders voor de reviews met namen en leeftijden van kinderen
- [ ] Controleren of je de foto's op je website mag gebruiken (licentie of toestemming)
- [ ] Contactformulier activeren (zie hierboven bij Contactformulier)

## Goed om te weten

- De site volgt de donkere modus van het apparaat van de bezoeker.
- Het logo in lichtroze heeft weinig contrast met de achtergrond. Voor logo's is dat toegestaan, maar een iets donkerder roze leest makkelijker.

## Licenties

Poppins: SIL Open Font License 1.1, zie `assets/fonts/OFL.txt`.
