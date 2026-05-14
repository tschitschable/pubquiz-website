// Einträge für Quiz-Abende.
// Felder: date, description, details (Text) ODER detailsHtml (HTML),
//   image (optional, Pfad zum Flyer-Bild),
//   link (optional, externe Anmelde-URL), linkText (optional),
//   form: true (optional, zeigt ein integriertes Anmeldeformular statt externem Link).
// Für Englisch: details_en, detailsHtml_en, linkText_en (optional).
// Vergangene Events: impressionsLink + impressionsText(_en) optional;
//   secondaryLink + secondaryLinkText(_en) optional (zweiter Button, z. B. Instagram).
window.PUB_QUIZ_DATES = [
  {
    date: "Sa, 21. Feb 2026",
    description: "Quiz im Eiger",
    image: "assets/eiger-quiz-flyer.png",
    details: "Du spielst in Teams von 2 bis 6 Personen um den Sieg. Die Moderator*innen von Pub Quiz Bern führen durch den Abend, stellen Fragen und sorgen für Fragezeichen über den heissen Köpfen. Das Restaurantteam kümmert sich um dein leibliches Wohl und die nötige Erfrischung.",
    detailsHtml: 'Du spielst in Teams von 2 bis 6 Personen um den Sieg. Die Moderator*innen von Pub Quiz Bern führen durch den Abend, stellen Fragen und sorgen für Fragezeichen über den heissen Köpfen. Das Restaurantteam kümmert sich um dein leibliches Wohl und die nötige Erfrischung.'
      + '<p><a href="https://www.instagram.com/p/DVEQdc8jP9N/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer">Impressionen vom Quizabend</a></p>',
    details_en: "Play in teams of 2 to 6 for the win. The hosts from Pub Quiz Bern guide the evening, ask questions and make sure heads are spinning. The restaurant team takes care of food and drinks.",
    detailsHtml_en: 'Play in teams of 2 to 6 for the win. The hosts from Pub Quiz Bern guide the evening, ask questions and make sure heads are spinning. The restaurant team takes care of food and drinks.'
      + '<p><a href="https://www.instagram.com/p/DVEQdc8jP9N/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer">Impressions from the quiz night</a></p>',
    link: "https://kurzlink.ch/tduo"
  },
  {
    date: "Mi, 25. Mär 2026",
    description: "Music Quiz mit Live Chor",
    isPast: true,
    image: "assets/music-quiz-flyer.png",
    detailsHtml: 'Der Chor <a href="https://www.instagram.com/vocs_bern/" target="_blank" rel="noopener noreferrer">@vocs_bern</a>, mit rund 15 Sänger:innen, begleitet euch durch fünf spannende, abwechslungsreiche Musikrate-Runden in der <a href="https://www.instagram.com/vierte_wand_bern/" target="_blank" rel="noopener noreferrer">@vierte_wand_bern</a>.'
      + '<ul class="date-info-list">'
      + '<li>Apéro ab 17.30 | Quiz 18.30 — 21:45</li>'
      + '<li>Eintritt CHF 15.— pro Person</li>'
      + '<li>Apéro+Burger (vegi oder fleisch): CHF 35.— pro Person</li>'
      + '<li>Gruppengrösse 2–6 Personen</li>'
      + '</ul>',
    detailsHtml_en: 'The choir <a href="https://www.instagram.com/vocs_bern/" target="_blank" rel="noopener noreferrer">@vocs_bern</a>, with around 15 singers, guides you through five exciting music guessing rounds at <a href="https://www.instagram.com/vierte_wand_bern/" target="_blank" rel="noopener noreferrer">@vierte_wand_bern</a>.'
      + '<ul class="date-info-list">'
      + '<li>Apéro from 17:30 | Quiz 18:30 — 21:45</li>'
      + '<li>Entry CHF 15.— per person</li>'
      + '<li>Apéro+Burger (veggie or meat): CHF 35.— per person</li>'
      + '<li>Group size 2–6 people</li>'
      + '</ul>',
    link: "https://kurzlink.ch/68pt",
    linkText: "Jetzt Tisch reservieren",
    linkText_en: "Reserve a table now",
    impressionsLink: "https://www.instagram.com/p/DWV_kx7DFDI/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==",
    impressionsText: "Impressionen",
    impressionsText_en: "Impressions"
  },
  {
    date: "Sa, 18. Apr 2026",
    description: "Quiz im Restaurant Eiger",
    isPast: true,
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
    secondaryLink: "https://www.instagram.com/p/DXTiXoDjDYM/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    secondaryLinkText: "Impressionen auf Instagram",
    secondaryLinkText_en: "Impressions on Instagram"
  },
  {
    date: "Mi, 29. Apr 2026",
    description: "Pub Quiz im Löscher",
    isPast: true,
    image: "assets/loescher-quiz-apr-2026.png",
    detailsHtml: 'Pub Quiz im Löscher, 18:00 - 21:30'
      + '<ul class="date-info-list">'
      + '<li>18:00 - Eintrudeln</li>'
      + '<li>18:30 - Beginn Quiz</li>'
      + '<li>19:15 - 1., 2., 3. Runde</li>'
      + '<li>19:15 - 20:30 Essen</li>'
      + '<li>20:30 - 21:30 4., 5. Runde und Preisverleihung</li>'
      + '</ul>',
    detailsHtml_en: 'Pub Quiz at Löscher, 18:00 - 21:30'
      + '<ul class="date-info-list">'
      + '<li>18:00 - Arrival</li>'
      + '<li>18:30 - Quiz starts</li>'
      + '<li>19:15 - Rounds 1, 2, 3</li>'
      + '<li>19:15 - 20:30 Dinner</li>'
      + '<li>20:30 - 21:30 Rounds 4, 5 and prize ceremony</li>'
      + '</ul>',
    impressionsLink: "https://www.instagram.com/p/DXvzktXDNIf/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    impressionsText: "Impressionen",
    impressionsText_en: "Impressions"
  },
  {
    date: "Mi, 13. Mai 2026",
    description: "Pub Quiz im Schöngrün",
    isPast: true,
    image: "assets/schoengruen-quiz-mai-2026.png",
    detailsHtml: 'Am Mittwoch, 13. Mai 2026 um 18:00 findet das erste Pub Quiz im Schöngrün statt. Neben dem Quizzen gibt es Fish and Chips (auch vegi verfügbar).'
      + '<ul class="date-info-list">'
      + '<li>18:00 – Eintrudeln</li>'
      + '<li>18:30 – Beginn Quiz</li>'
      + '<li>18:30 – 19:15 1., 2., 3. Runde</li>'
      + '<li>19:15 – 20:00 Pause</li>'
      + '<li>20:00 – 21:00 4., 5. Runde und Preisverleihung</li>'
      + '<li>Kosten: CHF 5.— pro Person fürs Quiz</li>'
      + '</ul>',
    detailsHtml_en: 'On Wednesday, 13 May 2026 at 18:00, the first Pub Quiz at Schöngrün takes place. Besides quizzing, there will be fish and chips (vegetarian option available).'
      + '<ul class="date-info-list">'
      + '<li>18:00 – Arrival</li>'
      + '<li>18:30 – Quiz starts</li>'
      + '<li>18:30 – 19:15 Rounds 1, 2, 3</li>'
      + '<li>19:15 – 20:00 Break</li>'
      + '<li>20:00 – 21:00 Rounds 4, 5 and prize ceremony</li>'
      + '<li>Cost: CHF 5.— per person for the quiz</li>'
      + '</ul>',
    impressionsLink: "https://www.instagram.com/p/DYTzXcmCqKW/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    impressionsText: "Impressionen",
    impressionsText_en: "Impressions"
  },
  {
    date: "Mi, 20. Mai 2026",
    description: "Pub Quiz in der Halle 16",
    soldOut: true,
    image: "assets/halle16-quiz-mai-2026.png",
    detailsHtml: 'Am Mittwoch, 20.5. um 18:00 findet das erste Pub Quiz in der Halle 16 statt.'
      + '<p>Neben dem Quiz gibt es verschiedene Food-Staende, von Pizza zu Indisch, Burger oder Libanesisch.</p>'
      + '<p>Meldet euch jetzt direkt via DM bei uns oder bei der Halle 16 an (Anzahl Personen und dein Name).</p>'
      + '<p>Programm:</p>'
      + '<ul class="date-info-list">'
      + '<li>18:00 - Eintrudeln</li>'
      + '<li>18:30 - Beginn Quiz</li>'
      + '<li>18:30 - 19:15 1., 2. Runde</li>'
      + '<li>19:15 - 20:00 Pause</li>'
      + '<li>20:00 - 21:00 3., 4., 5. Runde und Preisverleihung</li>'
      + '<li>Kosten: 5 CHF pro Person fuers Quiz</li>'
      + '</ul>',
    detailsHtml_en: 'On Wednesday, May 20 at 18:00, the first Pub Quiz at Halle 16 takes place.'
      + '<p>Alongside the quiz, there are different food stands, from pizza and Indian food to burgers and Lebanese cuisine.</p>'
      + '<p>Register now via DM with us or with Halle 16 (number of people and your name).</p>'
      + '<p>Program:</p>'
      + '<ul class="date-info-list">'
      + '<li>18:00 - Arrival</li>'
      + '<li>18:30 - Quiz starts</li>'
      + '<li>18:30 - 19:15 Rounds 1 and 2</li>'
      + '<li>19:15 - 20:00 Break</li>'
      + '<li>20:00 - 21:00 Rounds 3, 4, 5 and prize ceremony</li>'
      + '<li>Cost: CHF 5 per person for the quiz</li>'
      + '</ul>',
    link: "https://www.instagram.com/pubquizbern/",
    linkText: "Via Instagram DM anmelden",
    linkText_en: "Register via Instagram DM"
  },
];
