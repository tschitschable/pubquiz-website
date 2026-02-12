(function () {
  const questions = window.PUB_QUIZ_QUESTIONS || [];
  const dates = window.PUB_QUIZ_DATES || [];

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
          var linkHtml = (!past && d.link)
            ? '<a href="' + escapeHtml(d.link) + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary date-register-btn">' + linkLabel + '</a>'
            : '';
          var pastBadge = past ? '<span class="date-past-badge">Vergangen</span>' : '';
          var detailsHtml =
            '<div class="date-details"><div class="date-details-inner">' + detailsContent + linkHtml + '</div></div>';
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

  // Start mit einer zufälligen Frage
  setQuestion(getRandomQuestion());
})();
