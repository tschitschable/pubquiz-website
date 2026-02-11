# Pub Quiz Website

Einfache Seite mit Zufallsfrage (Nächste Frage / Antwort zeigen), Dropdown-Terminen und Instagram-Link.

## Lokal starten

`index.html` im Browser öffnen oder einen lokalen Server starten:

```bash
python3 -m http.server 8000
# oder: npx serve .
```

Dann `http://localhost:8000` aufrufen.

## Anpassen

- **Fragen:** In `questions.js` die Liste `PUB_QUIZ_QUESTIONS` bearbeiten (jeweils `question` und `answer`).
- **Termine:** In `quiz-dates.js` die Liste `PUB_QUIZ_DATES` bearbeiten. Jeder Eintrag: `date`, `description`, optional `details` (Text im Dropdown).
- **Instagram:** In `index.html` beim Link `id="instagram-link"` das Attribut `href` auf eure Instagram-URL setzen (z. B. `https://instagram.com/eueraccount`).

Kein Build nötig – nur HTML, CSS und JavaScript.
