/* 所有文章共用資料與版型；新增內容請先閱讀 AGENTS.md。 */
(() => {
  'use strict';
  const lessons = window.LESSONS || [];
  const $ = (id) => document.getElementById(id);
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function lessonUrl(id) { return 'article.html?id=' + encodeURIComponent(id); }
  const list = $('lesson-list');
  if (list) {
    let category = '全部';
    const search = $('search');
    const filters = [...document.querySelectorAll('[data-category]')];
    function render() {
      const query = search.value.trim().toLocaleLowerCase('zh-TW');
      const visible = lessons.filter((lesson) =>
        (category === '全部' || lesson.category === category) &&
        [lesson.title, lesson.summary, lesson.category, ...lesson.sections.map(s => s.heading + s.text)]
          .join(' ').toLocaleLowerCase('zh-TW').includes(query));
      list.replaceChildren();
      $('result-count').textContent = '共 ' + visible.length + ' 篇筆記';
      visible.forEach((lesson) => {
        const card = el('a', undefined, 'card');
        card.href = lessonUrl(lesson.id);
        const top = el('div', undefined, 'card-top');
        top.append(el('span', lesson.category), el('span', String(lessons.indexOf(lesson) + 1).padStart(2, '0'), 'card-number'));
        const bottom = el('div', undefined, 'card-bottom');
        bottom.append(el('span', '閱讀約 ' + lesson.minutes + ' 分鐘'), el('span', '翻開筆記 ↗'));
        card.append(top, el('h3', lesson.title), el('p', lesson.summary), bottom);
        list.append(card);
      });
      if (!visible.length) list.append(el('p', '找不到符合的筆記，試著換個關鍵字或切換「全部筆記」。', 'empty'));
    }
    filters.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.category;
      filters.forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
      render();
    }));
    search.addEventListener('input', render);
    render();
  }
  const container = $('article-content');
  if (container) {
    const id = new URLSearchParams(location.search).get('id');
    const lesson = lessons.find(l => l.id === id);
    if (!lesson) {
      container.append(el('h1', '找不到這篇筆記'), el('p', '網址中的文章代號可能有誤，請點上方連結回到筆記本選擇文章。'));
      document.title = '找不到筆記｜棒球看台筆記';
    } else {
      document.title = lesson.title + '｜棒球看台筆記';
      container.append(el('p', lesson.category + ' / 閱讀約 ' + lesson.minutes + ' 分鐘', 'eyebrow'), el('h1', lesson.title), el('p', lesson.summary, 'lead'));
      lesson.sections.forEach(s => {
        const section = el('section'); section.append(el('h2', s.heading), el('p', s.text)); container.append(section);
      });
      const example = el('aside', undefined, 'callout');
      example.append(el('h2', '帶到看台上的練習'), el('p', lesson.example));
      container.append(example, el('h2', '記住這一句'), el('p', lesson.takeaway));
      const quiz = el('section', undefined, 'quiz');
      quiz.setAttribute('aria-label', '閱讀小測驗');
      quiz.append(el('h2', '換你判斷'), el('p', lesson.quiz.question));
      const feedback = el('p'); feedback.setAttribute('aria-live', 'polite');
      const choices = [];
      lesson.quiz.options.forEach((option, index) => {
        const button = el('button', option); button.type = 'button'; button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => {
          choices.forEach(b => { b.setAttribute('aria-pressed', String(b === button)); });
          feedback.textContent = (index === lesson.quiz.answer ? '答對了！' : '再想一想。') + ' ' + lesson.quiz.explanation;
        });
        choices.push(button); quiz.append(button);
      });
      quiz.append(feedback); container.append(quiz, el('h2', '資料來源與適用範圍'));
      const sources = el('ul', undefined, 'sources');
      lesson.sources.forEach(source => {
        const li = el('li'); const a = el('a', source.label);
        // 僅接受 HTTP(S) 來源，不允許內容資料執行程式。
        if (/^https?:\/\//i.test(source.url)) { a.href = source.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        li.append(a, document.createTextNode(' · 查閱日期：' + source.checked)); sources.append(li);
      });
      container.append(sources, el('p', '中職專屬資訊以 CPBL 官方公告為準；引用 MLB glossary 的段落僅解釋一般棒球概念。本站為個人學習專案，非官方網站。', 'muted'));
      const related = el('section'); related.append(el('h2', '接著讀一篇'));
      lessons.filter(l => l.id !== id).slice(0, 3).forEach(l => {
        const p = el('p'); const a = el('a', l.title + ' ↗', 'text-link'); a.href = lessonUrl(l.id); p.append(a); related.append(p);
      }); container.append(related);
    }
  }
  const positions = [
    [1, '投手', 'P', 50, 60, '從投手丘投球，與捕手合作對付打者，也要處理投手丘附近的守備。'],
    [2, '捕手', 'C', 50, 89, '在本壘後方接球，與投手配合，也負責本壘附近的守備。'],
    [3, '一壘手', '1B', 73, 62, '負責一壘附近的守備，經常接住隊友傳球，爭取在打者到壘前完成出局。'],
    [4, '二壘手', '2B', 64, 43, '守備範圍在一、二壘之間，也會在二壘接傳球與參與雙殺。'],
    [5, '三壘手', '3B', 27, 62, '負責三壘附近的守備，處理朝三壘方向的擊球。'],
    [6, '游擊手', 'SS', 36, 43, '在二、三壘之間守備，常需要快速移動、接球與傳球。'],
    [7, '左外野手', 'LF', 20, 26, '以本壘朝外野看，位於左側外野，處理該區飛球與落地球。'],
    [8, '中外野手', 'CF', 50, 17, '位於外野中央，與左右外野手合作處理外野擊球。'],
    [9, '右外野手', 'RF', 80, 26, '以本壘朝外野看，位於右側外野，處理該區擊球並傳回內野。']
  ];
  if ($('positions')) {
    const buttons = [];
    positions.forEach(([number, name, abbreviation, x, y, description]) => {
      const button = el('button', number + ' ' + name);
      button.type = 'button'; button.style.left = x + '%'; button.style.top = y + '%';
      button.setAttribute('aria-pressed', String(number === 1));
      button.addEventListener('click', () => {
        buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        $('position-info').replaceChildren(el('strong', number + ' · ' + name + ' ' + abbreviation), el('p', description));
      });
      buttons.push(button); $('positions').append(button);
    });
  }
  const calculator = $('calculator');
  if (calculator) {
    calculator.noValidate = true;
    calculator.addEventListener('submit', event => {
      event.preventDefault();
      const hitsRaw = calculator.elements.hits.value.trim();
      const atbatsRaw = calculator.elements.atbats.value.trim();
      const hits = Number(hitsRaw), atbats = Number(atbatsRaw);
      let message = '';
      if (!hitsRaw || !atbatsRaw || !Number.isSafeInteger(hits) || !Number.isSafeInteger(atbats) || hits < 0 || atbats < 0) {
        message = '請輸入零或正整數，不能留白、輸入負數或小數。';
      } else if (hits > atbats) {
        message = '安打數不能大於打數，請檢查輸入。';
      } else if (atbats === 0) {
        message = '零打數尚無法計算打擊率，請輸入大於零的打數。';
      }
      if (message) { $('avg').textContent = '—'; $('calc-note').textContent = message; return; }
      const formatted = (hits / atbats).toFixed(3).replace(/^0/, '');
      $('avg').textContent = formatted;
      $('calc-note').textContent = '教學假設：' + atbats + ' 個打數、' + hits + ' 支安打，打擊率為 ' + formatted + '。';
    });
  }
})();
