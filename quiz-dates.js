// Einträge für Quiz-Abende.
// Felder: date, description, details (Text) ODER detailsHtml (HTML),
//   image (optional, Pfad zum Flyer-Bild),
//   link (optional, externe Anmelde-URL), linkText (optional),
//   form: true (optional, zeigt ein integriertes Anmeldeformular statt externem Link).
// Für Englisch: details_en, detailsHtml_en, linkText_en (optional).
window.PUB_QUIZ_DATES = [
  {
    date: "Sa, 21. Feb 2026",
    description: "Quiz im Eiger",
    image: "assets/eiger-quiz-flyer.png",
    details: "Du spielst in Teams von 2 bis 6 Personen um den Sieg. Die Moderator*innen von Pub Quiz Bern führen durch den Abend, stellen Fragen und sorgen für Fragezeichen über den heissen Köpfen. Das Restaurantteam kümmert sich um dein leibliches Wohl und die nötige Erfrischung.",
    details_en: "Play in teams of 2 to 6 for the win. The hosts from Pub Quiz Bern guide the evening, ask questions and make sure heads are spinning. The restaurant team takes care of food and drinks.",
    link: "https://kurzlink.ch/tduo"
  },
  {
    date: "Mi, 25. Mär 2026",
    description: "Music Quiz mit Live Chor",
    image: "assets/music-quiz-flyer.png",
    detailsHtml: 'Der Chor <a href="https://www.instagram.com/vocs_bern/" target="_blank" rel="noopener noreferrer">@vocs_bern</a>, mit rund 15 Sänger:innen, begleitet euch durch fünf spannende, abwechslungsreiche Musikrate-Runden in der <a href="https://www.instagram.com/vierte_wand_bern/" target="_blank" rel="noopener noreferrer">@vierte_wand_bern</a>.'
      + '<ul class="date-info-list">'
      + '<li>Apéro ab 17.00 | Quiz 18.30 — 21:00</li>'
      + '<li>Eintritt CHF 15.— pro Person</li>'
      + '<li>Apéro+Burger (vegi oder fleisch): CHF 35.— pro Person</li>'
      + '<li>Gruppengrösse 2–6 Personen</li>'
      + '</ul>',
    detailsHtml_en: 'The choir <a href="https://www.instagram.com/vocs_bern/" target="_blank" rel="noopener noreferrer">@vocs_bern</a>, with around 15 singers, guides you through five exciting music guessing rounds at <a href="https://www.instagram.com/vierte_wand_bern/" target="_blank" rel="noopener noreferrer">@vierte_wand_bern</a>.'
      + '<ul class="date-info-list">'
      + '<li>Apéro from 17:00 | Quiz 18:30 — 21:00</li>'
      + '<li>Entry CHF 15.— per person</li>'
      + '<li>Apéro+Burger (veggie or meat): CHF 35.— per person</li>'
      + '<li>Group size 2–6 people</li>'
      + '</ul>',
    link: "https://kurzlink.ch/68pt",
    linkText: "Jetzt Tisch reservieren",
    linkText_en: "Reserve a table now"
  },
  {
    date: "Sa, 18. Apr 2026",
    description: "Quiz im Restaurant Eiger",
    image: "assets/eiger-quiz-apr-2026.png",
    detailsHtml: 'Nur Quiz (16:30 - 18:30, Bistrokarte)'
      + '<ul class="date-info-list">'
      + '<li>Quiz\'n\'dine (16:30 mit Abendessen nach dem Quiz)</li>'
      + '<li>Gewohntes Abendessen ab 18:45</li>'
      + '<li>Gewuenschte Option bei der Reservation angeben</li>'
      + '<li>Startgebuehr CHF 5.00 / Person, 5 Runden</li>'
      + '<li>Alle Infos unter herzhaft.swiss/Kalender</li>'
      + '</ul>',
    detailsHtml_en: 'Quiz only (16:30 - 18:30, bistro menu)'
      + '<ul class="date-info-list">'
      + '<li>Quiz\'n\'dine (16:30 with dinner after the quiz)</li>'
      + '<li>Regular dinner service from 18:45</li>'
      + '<li>Please specify your preferred option when booking</li>'
      + '<li>Entry fee CHF 5.00 per person, 5 rounds</li>'
      + '<li>All info at herzhaft.swiss/Kalender</li>'
      + '</ul>',
    link: "https://mytools.aleno.me/reservations/v2.0/reservations.html?k=eyJrIjoid2l2dTVrM2lsNm15cnBiOWlwdzZ4bmViajhycnVkaWRpZ280bGZwODBsbzlhNGlweTEiLCJyIjoiNGhiMmY3QVhQWXhjM2U0RWoiLCJzIjoiaHR0cHM6Ly9teXRvb2xzLmFsZW5vLm1lLyJ9&skipFirstSteps=true&shifts=Pub+Quiz+im+April",
    linkText: "Zur Reservation",
    linkText_en: "Reservation details"
  },
];
