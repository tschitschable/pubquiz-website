(function () {
  const questions = window.PUB_QUIZ_QUESTIONS || [];
  const dates = window.PUB_QUIZ_DATES || [];

  // Google Apps Script Web App URL — set this after deploying the script
  var FORM_ENDPOINT = window.PUB_QUIZ_FORM_ENDPOINT || '';

  const questionEl = document.getElementById('question-text');
  const answerEl = document.getElementById('answer-text');
  const showAnswerBtn = document.getElementById('show-answer');
  const nextQuestionBtn = document.getElementById('next-question');
  const datesListEl = document.getElementById('quiz-dates');
  const darkToggle = document.getElementById('dark-mode-toggle');

  // --- Dark Mode ---
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  (function initTheme() {
    var saved = localStorage.getItem('theme');
    if (saved) { applyTheme(saved); return; }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    }
  })();

  if (darkToggle) {
    darkToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // --- Questions ---
  function getRandomQuestion() {
    if (questions.length === 0) return null;
    return questions[Math.floor(Math.random() * questions.length)];
  }

  function setQuestion(q) {
    if (!q) {
      questionEl.textContent = 'Noch keine Fragen. Füge welche in questions.js hinzu!';
      answerEl.classList.add('hidden');
      answerEl.setAttribute('aria-hidden', 'true');
      answerEl.textContent = '';
      return;
    }
    questionEl.textContent = q.question;
    answerEl.textContent = q.answer;
    answerEl.classList.add('hidden');
    answerEl.setAttribute('aria-hidden', 'true');
  }

  function showAnswer() {
    answerEl.classList.remove('hidden');
    answerEl.removeAttribute('aria-hidden');
  }

  function nextQuestion() {
    setQuestion(getRandomQuestion());
  }

  showAnswerBtn.addEventListener('click', showAnswer);
  nextQuestionBtn.addEventListener('click', nextQuestion);

  // --- Helpers ---
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Parse German date strings like "Sa, 21. Feb 2026"
  var monthMap = {
    'jan': 0, 'feb': 1, 'mär': 2, 'mar': 2, 'apr': 3, 'mai': 4, 'jun': 5,
    'jul': 6, 'aug': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'dez': 11
  };

  function parseGermanDate(str) {
    var match = str.match(/(\d{1,2})\.\s*(\w{3})\w*\.?\s*(\d{4})/);
    if (!match) return null;
    var day = parseInt(match[1], 10);
    var mon = monthMap[match[2].toLowerCase()];
    var year = parseInt(match[3], 10);
    if (mon === undefined) return null;
    return new Date(year, mon, day, 23, 59, 59);
  }

  function isPast(dateStr) {
    var d = parseGermanDate(dateStr);
    return d ? d < new Date() : false;
  }

  // --- Quiz-Daten als Dropdowns rendern ---
  if (datesListEl) {
    if (dates.length === 0) {
      datesListEl.innerHTML = '<li class="no-dates">Noch keine Termine. Bearbeite quiz-dates.js für deine Quiz-Abende.</li>';
    } else {
      // Sort: upcoming first, past last
      var sortedDates = dates.slice().sort(function (a, b) {
        var aPast = isPast(a.date) ? 1 : 0;
        var bPast = isPast(b.date) ? 1 : 0;
        return aPast - bPast;
      });

      datesListEl.innerHTML = sortedDates
        .map(function (d, i) {
          var past = isPast(d.date);
          var detailsContent = d.detailsHtml ? d.detailsHtml : (d.details ? escapeHtml(d.details) : 'Keine weiteren Infos.');
          var linkLabel = d.linkText ? escapeHtml(d.linkText) : 'Anmelden';
          var actionHtml = '';
          if (!past && d.form) {
            actionHtml =
              '<form class="register-form" data-event="' + escapeHtml(d.date + ' – ' + d.description) + '">' +
              '<div class="form-group">' +
              '<label>Kontaktperson</label>' +
              '<input type="text" name="contact" required placeholder="Vor- und Nachname">' +
              '</div>' +
              '<div class="form-group">' +
              '<label>E-Mail</label>' +
              '<input type="email" name="email" required placeholder="name@beispiel.ch">' +
              '</div>' +
              '<div class="form-group">' +
              '<label>Gruppengrösse</label>' +
              '<select name="groupsize" required>' +
              '<option value="">Bitte wählen</option>' +
              '<option value="2">2 Personen</option>' +
              '<option value="3">3 Personen</option>' +
              '<option value="4">4 Personen</option>' +
              '<option value="5">5 Personen</option>' +
              '<option value="6">6 Personen</option>' +
              '</select>' +
              '</div>' +
              '<div class="form-group">' +
              '<label>Bemerkung <span class="optional">(optional)</span></label>' +
              '<textarea name="note" rows="2" placeholder="Allergien, Spezialwünsche, etc."></textarea>' +
              '</div>' +
              '<button type="submit" class="btn btn-primary date-register-btn">Anmelden</button>' +
              '<p class="form-status"></p>' +
              '</form>';
          } else if (!past && d.link) {
            actionHtml = '<a href="' + escapeHtml(d.link) + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary date-register-btn">' + linkLabel + '</a>';
          }
          var pastBadge = past ? '<span class="date-past-badge">Vergangen</span>' : '';
          var detailsHtml =
            '<div class="date-details"><div class="date-details-inner">' + detailsContent + actionHtml + '</div></div>';
          return (
            '<li class="date-item' + (past ? ' is-past' : '') + '" data-index="' +
            i +
            '">' +
            '<button type="button" class="date-toggle" aria-expanded="false">' +
            '<span class="date">' +
            escapeHtml(d.date) +
            '</span>' +
            '<span class="description">' +
            escapeHtml(d.description || '') +
            '</span>' +
            pastBadge +
            '<span class="chevron" aria-hidden="true">▼</span>' +
            '</button>' +
            detailsHtml +
            '</li>'
          );
        })
        .join('');

      datesListEl.querySelectorAll('.date-item').forEach(function (item) {
        var btn = item.querySelector('.date-toggle');
        var details = item.querySelector('.date-details');
        if (!btn || !details) return;
        btn.addEventListener('click', function () {
          var isOpen = item.classList.toggle('is-open');
          btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          details.style.maxHeight = isOpen ? details.scrollHeight + 'px' : '';
        });
      });

      // --- Form submission handler ---
      datesListEl.querySelectorAll('.register-form').forEach(function (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var statusEl = form.querySelector('.form-status');
          var submitBtn = form.querySelector('button[type="submit"]');
          var eventName = form.getAttribute('data-event') || '';

          if (!FORM_ENDPOINT) {
            statusEl.textContent = 'Formular-Endpunkt nicht konfiguriert.';
            statusEl.className = 'form-status form-error';
            return;
          }

          var data = {
            event: eventName,
            contact: form.contact.value.trim(),
            email: form.email.value.trim(),
            groupsize: form.groupsize.value,
            note: form.note.value.trim(),
            timestamp: new Date().toISOString()
          };

          submitBtn.disabled = true;
          submitBtn.textContent = 'Wird gesendet…';
          statusEl.textContent = '';
          statusEl.className = 'form-status';

          fetch(FORM_ENDPOINT, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          .then(function () {
            statusEl.textContent = 'Anmeldung erfolgreich! Wir freuen uns auf euch.';
            statusEl.className = 'form-status form-success';
            form.reset();
            submitBtn.textContent = 'Angemeldet ✓';
            // Recalculate dropdown height
            var details = form.closest('.date-details');
            if (details) details.style.maxHeight = details.scrollHeight + 'px';
          })
          .catch(function () {
            statusEl.textContent = 'Fehler beim Senden. Bitte versuche es erneut.';
            statusEl.className = 'form-status form-error';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Anmelden';
          });
        });
      });
    }
  }

  // --- Scroll fade-in animations ---
  var fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && fadeEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // --- Team Name Generator ---
  var teamAdj = [
    'Die schlauen', 'Die wilden', 'Die vergesslichen', 'Die legendären',
    'Die müden', 'Die hungrigen', 'Die furchtlosen', 'Die verlorenen',
    'Die geheimen', 'Die tapferen', 'Die listigen', 'Die goldenen',
    'Die faulen', 'Die wütenden', 'Die lustigen', 'Die verrückten',
    'Die rätselhaften', 'Die mächtigen', 'Die stillen', 'Die schnellen'
  ];
  var teamNoun = [
    'Bären', 'Müntschi', 'Fondue-Könige', 'Grittibänze', 'Aareschwimmer',
    'Gipfelstürmer', 'Zytglogge-Nerds', 'Käsebrains', 'Röstiritter',
    'Schoggitiger', 'Matterhorn-Geister', 'Alpöhi-Gang', 'Bundeshaus-Bande',
    'Emmentaler', 'Toblerone-Truppe', 'Zibelemärit-Helden', 'Bärner Meitschi',
    'Gurten-Crew', 'Röstigraben-Rebellen', 'Stierebrunne-Stars',
    'Biertrinker', 'Nerds', 'Einsteine', 'Glückspilze', 'Nachtschwärmer',
    'Besserwisser', 'Warmduscher', 'Pfefferkörner', 'Traumtänzer'
  ];

  var teamStandalone = [
    'Quiz on My Face', 'The Know-It-Ales', 'Trivia Newton John',
    'We Came, We Saw, We Forgot', 'The Smartinis', 'Quiztopher Walken',
    'Risky Quizness', 'The Quizzly Bears', "You're a Quizzard, Harry",
    'I Thought This Was Speed Dating', 'Tequila Mockingbird',
    'The Fact Hunt', 'Brainy McBrainface', 'The Inquizition',
    'No Eye Deer', 'Sofa King Smart', "Let's Get Quizzical",
    'The Answer Is Beer', 'Ctrl Alt Defeat', 'The Quizards of Odds',
    "The Schrödingers Answers", 'Stack Overflowed', '404 Brain Not Found',
    'Nerds of the Round Table', 'Die Bundesratslosen',
    'Wilhelm Tell Us the Answer', 'Cheese, Wine and No Clue',
    'The Clockwork Brains', 'Direct Democracy of Dumb Answers'
  ];

  var teamNameEl = document.getElementById('team-name');
  var generateBtn = document.getElementById('generate-name');

  function generateTeamName() {
    // ~50% chance standalone name, ~50% generated combo
    if (Math.random() < 0.5) {
      return teamStandalone[Math.floor(Math.random() * teamStandalone.length)];
    }
    var adj = teamAdj[Math.floor(Math.random() * teamAdj.length)];
    var noun = teamNoun[Math.floor(Math.random() * teamNoun.length)];
    return adj + ' ' + noun;
  }

  if (generateBtn && teamNameEl) {
    generateBtn.addEventListener('click', function () {
      teamNameEl.style.opacity = '0';
      setTimeout(function () {
        teamNameEl.textContent = generateTeamName();
        teamNameEl.style.opacity = '1';
      }, 150);
    });
    // Show one on load
    teamNameEl.textContent = generateTeamName();
  }

  // Start mit einer zufälligen Frage
  setQuestion(getRandomQuestion());
})();
