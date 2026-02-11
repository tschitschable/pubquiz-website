(function () {
  const questions = window.PUB_QUIZ_QUESTIONS || [];
  const dates = window.PUB_QUIZ_DATES || [];

  const questionEl = document.getElementById('question-text');
  const answerEl = document.getElementById('answer-text');
  const showAnswerBtn = document.getElementById('show-answer');
  const nextQuestionBtn = document.getElementById('next-question');
  const datesListEl = document.getElementById('quiz-dates');

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

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Quiz-Daten als Dropdowns rendern
  if (datesListEl) {
    if (dates.length === 0) {
      datesListEl.innerHTML = '<li class="no-dates">Noch keine Termine. Bearbeite quiz-dates.js für deine Quiz-Abende.</li>';
    } else {
      datesListEl.innerHTML = dates
        .map(function (d, i) {
          var detailsContent = d.details ? escapeHtml(d.details) : 'Keine weiteren Infos.';
          var linkHtml = d.link
            ? '<a href="' + escapeHtml(d.link) + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary date-register-btn">Anmelden</a>'
            : '';
          var detailsHtml =
            '<div class="date-details"><div class="date-details-inner">' + detailsContent + linkHtml + '</div></div>';
          return (
            '<li class="date-item" data-index="' +
            i +
            '">' +
            '<button type="button" class="date-toggle" aria-expanded="false">' +
            '<span class="date">' +
            escapeHtml(d.date) +
            '</span>' +
            '<span class="description">' +
            escapeHtml(d.description || '') +
            '</span>' +
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

  // Start mit einer zufälligen Frage
  setQuestion(getRandomQuestion());
})();
