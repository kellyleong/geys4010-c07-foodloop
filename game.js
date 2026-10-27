(() => {
  const icons = {
    truck: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M7 18h31v27H7z" fill="#b7df71" stroke="#123f34" stroke-width="3"/><path d="M38 29h11l9 10v6H38z" fill="#fff9e9" stroke="#123f34" stroke-width="3"/><path d="M42 32h5l6 7H42z" fill="#72b5a4"/><circle cx="18" cy="47" r="6" fill="#123f34"/><circle cx="47" cy="47" r="6" fill="#123f34"/><path d="M16 27h13m-6-5v10" stroke="#123f34" stroke-width="3" stroke-linecap="round"/></svg>`,
    rice: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 30h40c-2 17-10 23-20 23S14 47 12 30Z" fill="#c9e7dd" stroke="#285e4d" stroke-width="2.5"/><path d="M15 30c0-7 6-12 12-10 3-9 13-10 17-2 6 0 8 6 6 12" fill="#fffef3" stroke="#285e4d" stroke-width="2.5"/><path d="m25 24 4-2m7 2 4-3" stroke="#a9b9a4" stroke-width="2" stroke-linecap="round"/></svg>`,
    greens: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="m29 52 5-29 8 2-4 29Z" fill="#91b94d" stroke="#285e4d" stroke-width="2.5"/><path d="M13 29c-10-12 5-24 14-17 5-11 22-7 22 4 15-2 15 18 3 20-6 10-17 6-19-1-10 7-21 4-20-6Z" fill="#72ab60" stroke="#285e4d" stroke-width="2.5"/></svg>`,
    core: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M20 15c7 4 17 4 24 0l4 8c-11 3-12 18-2 24l-4 7c-6-5-14-5-20 0l-4-7c10-6 10-19-2-24Z" fill="#fff5da" stroke="#285e4d" stroke-width="2.5"/><path d="M20 15c7 4 17 4 24 0l4 8-7 3-19-1-6-2Zm-2 32 6-4c6 4 12 4 16 0l6 4-4 7c-6-5-14-5-20 0Z" fill="#d67a62"/><path d="m32 17 2-8m-1 4c8-7 14-2 10 2-4 3-10-2-10-2Z" fill="#75a25b" stroke="#285e4d" stroke-width="2"/><path d="m30 31-2 5m9-4-2 5" stroke="#916c43" stroke-width="3" stroke-linecap="round"/></svg>`,
    peel: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M33 10h6l-2 14c0 8 7 13 17 14-4 8-13 8-19 1 2 10-2 17-9 18 3-9 1-16-2-21-4 9-11 13-18 9 11-4 18-12 22-23Z" fill="#e6c45c" stroke="#285e4d" stroke-width="2.5" stroke-linejoin="round"/><path d="m33 24-4 12m5-8 2 11" fill="none" stroke="#ab8f3f" stroke-width="2"/></svg>`,
    bread: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 28c-7-11 3-20 12-17 9-8 27 0 24 11l-3 5v25H17V30Z" fill="#cb9963" stroke="#285e4d" stroke-width="2.5"/><path d="M21 29c-6-8-1-14 7-12 7-6 19-2 17 5l-4 6v18H23V30Z" fill="#f1d9a9"/><path d="M29 27h1m6 8h1m-9 5h1" stroke="#bc955f" stroke-width="3" stroke-linecap="round"/></svg>`,
    package: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="m13 17 32-4 7 34-32 5Z" fill="#e7e1d1" stroke="#9b9b8b" stroke-width="2.5"/><path d="m14 17 20 10 12-14M34 27l7 22" fill="none" stroke="#9b9b8b" stroke-width="2"/><path d="m22 28 20 12m-17 3 14-18" stroke="#b07259" stroke-width="3" stroke-linecap="round"/></svg>`,
    station: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 21h40l-4 35H16Z" fill="#317e62" stroke="#164c3b" stroke-width="2.5"/><path d="M9 15h46v8H9z" fill="#b7df71" stroke="#164c3b" stroke-width="2.5"/><path d="m27 33 5-7 5 7m5 6-1 9h-9m-8-1-5-8 5-7" fill="none" stroke="#f7f7df" stroke-width="3" stroke-linejoin="round"/></svg>`
  };
  window.initFoodGame = () => {
    const root = document.getElementById('food-game');
    if (!root) return;
    const cols = 9, rows = 6;
    const station = { x: 8, y: 2 };
    const scraps = [
      { x: 1, y: 1, type: 'rice', name: '剩飯' },
      { x: 4, y: 0, type: 'greens', name: '菜頭菜尾' },
      { x: 3, y: 3, type: 'core', name: '果芯' },
      { x: 5, y: 5, type: 'peel', name: '果皮' },
      { x: 7, y: 2, type: 'bread', name: '剩麵包' }
    ];
    const packaging = new Set(['2,1', '3,1', '6,1', '2,4', '5,4', '6,4', '7,3']);
    let state;
    root.innerHTML = `<style>
      #food-game{--fg-ink:#123d38;--fg-green:#00695f;--fg-lime:#d4ee85;--fg-paper:#f5f6f0;--fg-mist:#e6ece5;color:var(--fg-ink);font-family:inherit}
      #food-game *{box-sizing:border-box}
      #food-game .fg-header{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:18px}
      #food-game .fg-totals{display:flex;gap:24px;flex-wrap:wrap}
      #food-game .fg-total{display:grid;gap:3px;font-size:14px;letter-spacing:.03em}
      #food-game .fg-total strong{font-size:25px;line-height:1.15;letter-spacing:-.04em;font-weight:650}
      #food-game .fg-buttons{display:flex;gap:8px}
      #food-game button{font:inherit;font-size:14px;font-weight:600;cursor:pointer;border:1px solid #bccdb8;background:var(--fg-paper);color:var(--fg-ink);border-radius:0;padding:11px 19px;touch-action:manipulation}
      #food-game button:hover{background:#e7efd8}
      #food-game button:focus-visible,#food-game .fg-board:focus-visible{outline:3px solid #75a65b;outline-offset:4px}
      #food-game .fg-main-button{background:var(--fg-ink);color:var(--fg-paper);border-color:var(--fg-ink)}
      #food-game .fg-main-button:hover{background:var(--fg-green)}
      #food-game button:disabled{opacity:.55;cursor:default}
      #food-game .fg-board-wrap{position:relative;background:var(--fg-mist);border:1px solid #c9d5bf;border-radius:0;padding:13px}
      #food-game .fg-board{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:5px;border-radius:0;outline:none;touch-action:manipulation}
      #food-game .fg-cell{position:relative;aspect-ratio:1;background:var(--fg-paper);border-radius:0;display:grid;place-items:center;min-width:0}
      #food-game .fg-cell svg{width:85%;height:85%;display:block}
      #food-game .fg-food{background:#f2f4da}
      #food-game .fg-blocked{background:#d7dfd0}
      #food-game .fg-station{background:var(--fg-lime);outline:1px dashed #6f9a52;outline-offset:-4px}
      #food-game .fg-player{background:#d9edbf;outline:2px solid #73985d;outline-offset:-2px}
      #food-game .fg-station.fg-player{background:var(--fg-lime)}
      #food-game .fg-overlay{position:absolute;inset:13px;border-radius:0;background:#f5f6f0eb;display:grid;place-content:center;text-align:center;gap:10px;padding:20px;pointer-events:none}
      #food-game .fg-overlay[hidden]{display:none}
      #food-game .fg-overlay strong{font-size:clamp(19px,3vw,29px);font-weight:600}
      #food-game .fg-overlay span{max-width:320px;font-size:14px;line-height:1.8}
      #food-game .fg-feedback{min-height:48px;font-size:14px;line-height:1.7;margin:14px 0 7px}
      #food-game .fg-bottom{display:flex;justify-content:space-between;align-items:center;gap:20px}
      #food-game .fg-guide{max-width:360px;font-size:14px;line-height:1.9;color:#66806b}
      #food-game .fg-legend{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:7px}
      #food-game .fg-legend span{display:flex;align-items:center;gap:5px}
      #food-game .fg-legend svg{width:24px;height:24px}
      #food-game .fg-controls{display:grid;grid-template-columns:repeat(3,42px);grid-template-rows:repeat(2,39px);gap:5px;flex-shrink:0}
      #food-game .fg-controls button{padding:0;border-radius:0;display:grid;place-items:center}
      #food-game .fg-controls svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
      #food-game .fg-up{grid-column:2}#food-game .fg-left{grid-column:1;grid-row:2}#food-game .fg-down{grid-column:2;grid-row:2}#food-game .fg-right{grid-column:3;grid-row:2}
      @media(max-width:540px){#food-game .fg-header{align-items:flex-start;gap:10px}#food-game .fg-totals{gap:16px}#food-game .fg-total strong{font-size:22px}#food-game button{padding:10px 13px;font-size:14px}#food-game .fg-board-wrap{padding:8px;border-radius:0}#food-game .fg-board{gap:3px}#food-game .fg-cell{border-radius:0}#food-game .fg-overlay{inset:8px}#food-game .fg-bottom{gap:12px}#food-game .fg-legend{gap:8px}#food-game .fg-guide{font-size:14px}#food-game .fg-controls{grid-template-columns:repeat(3,36px);grid-template-rows:repeat(2,36px)}}
    </style>
    <div class="fg-header"><div class="fg-totals"><div class="fg-total"><span>已送抵回收站</span><strong data-fg="delivered">0 / 5</strong></div><div class="fg-total"><span>車上廚餘</span><strong data-fg="carried">0</strong></div></div><div class="fg-buttons"><button type="button" class="fg-main-button" data-fg="start">開始運送</button><button type="button" data-fg="reset" aria-label="重新開始廚餘運送遊戲">重玩</button></div></div>
    <div class="fg-board-wrap"><div class="fg-board" tabindex="0" role="application" aria-label="廚餘運送遊戲，九欄六行地圖。用方向鍵移動收集車，收集五份廚餘，再駛到右邊回收站。灰色包裝不能通過。" aria-describedby="fg-feedback"></div><div class="fg-overlay" data-fg="overlay"><strong>讓廚餘，走對路。</strong><span>收集地圖上的 5 份廚餘，駛到右邊綠色回收站。繞過包裝，保持廚餘乾淨。</span></div></div>
    <p class="fg-feedback" id="fg-feedback" role="status" aria-live="polite">準備出發。按「開始運送」，再用方向鍵或下方按鈕移動。</p>
    <div class="fg-bottom"><div class="fg-guide"><div class="fg-legend"><span>${icons.rice}廚餘：收集</span><span>${icons.package}包裝：繞過</span><span>${icons.station}回收站：送抵</span></div><span>鍵盤：先點選地圖，再按 ↑ ↓ ← →。手機：使用右方方向按鈕。回收前記得移除包裝。</span></div><div class="fg-controls" aria-label="收集車移動方向"><button type="button" class="fg-up" data-dir="up" aria-label="向上移動"><svg viewBox="0 0 24 24"><path d="m6 15 6-6 6 6"/></svg></button><button type="button" class="fg-left" data-dir="left" aria-label="向左移動"><svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg></button><button type="button" class="fg-down" data-dir="down" aria-label="向下移動"><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button><button type="button" class="fg-right" data-dir="right" aria-label="向右移動"><svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></button></div></div>`;
    const board = root.querySelector('.fg-board');
    const output = root.querySelector('[data-fg="delivered"]');
    const carried = root.querySelector('[data-fg="carried"]');
    const start = root.querySelector('[data-fg="start"]');
    const overlay = root.querySelector('[data-fg="overlay"]');
    const feedback = root.querySelector('[data-fg="feedback"]') || root.querySelector('.fg-feedback');
    const directionButtons = root.querySelectorAll('[data-dir]');
    function render() {
      board.innerHTML = Array.from({ length: cols * rows }, (_, i) => {
        const x = i % cols, y = Math.floor(i / cols), key = `${x},${y}`;
        const food = state.foods.find(item => item.x === x && item.y === y);
        const isPlayer = state.x === x && state.y === y;
        const isStation = station.x === x && station.y === y;
        const blocked = packaging.has(key);
        const classes = ['fg-cell', food && 'fg-food', blocked && 'fg-blocked', isStation && 'fg-station', isPlayer && 'fg-player'].filter(Boolean).join(' ');
        const icon = isPlayer ? icons.truck : food ? icons[food.type] : isStation ? icons.station : blocked ? icons.package : '';
        return `<div class="${classes}" aria-hidden="true">${icon}</div>`;
      }).join('');
      output.textContent = `${state.delivered} / 5`;
      carried.textContent = String(state.carried);
      start.textContent = state.won ? '運送完成' : state.running ? '暫停' : state.started ? '繼續運送' : '開始運送';
      start.disabled = state.won;
      directionButtons.forEach(button => { button.disabled = !state.running; });
      overlay.hidden = state.running;
      if (state.won) overlay.innerHTML = `<strong>五份廚餘，全部送達。</strong><span>分類是資源循環的第一步。真實回收時，請先瀝乾湯汁、移除包裝，再按現場指示投放。</span>`;
      else if (state.started && !state.running) overlay.innerHTML = `<strong>休息一下。</strong><span>按「繼續運送」回到地圖，完成廚餘的回收旅程。</span>`;
      else if (!state.started) overlay.innerHTML = `<strong>讓廚餘，走對路。</strong><span>收集地圖上的 5 份廚餘，駛到右邊綠色回收站。繞過包裝，保持廚餘乾淨。</span>`;
    }
    function reset() {
      state = { x: 0, y: 5, foods: scraps.map(item => ({ ...item })), carried: 0, delivered: 0, running: false, started: false, won: false };
      feedback.textContent = '準備出發。按「開始運送」，再用方向鍵或下方按鈕移動。';
      render();
    }
    function move(direction) {
      if (!state.running) return;
      const delta = { up: [0,-1], down: [0,1], left: [-1,0], right: [1,0] }[direction];
      const x = state.x + delta[0], y = state.y + delta[1];
      if (x < 0 || x >= cols || y < 0 || y >= rows) {
        feedback.textContent = '已到地圖邊緣，換個方向繼續。';
        return;
      }
      if (packaging.has(`${x},${y}`)) {
        feedback.textContent = '前方是非廚餘包裝，請繞過。包裝不應混入廚餘回收桶。';
        return;
      }
      state.x = x; state.y = y;
      const index = state.foods.findIndex(item => item.x === x && item.y === y);
      if (index !== -1) {
        const item = state.foods.splice(index, 1)[0];
        state.carried += 1;
        feedback.textContent = `已收集${item.name}。車上有 ${state.carried} 份廚餘，駛到右邊回收站即可交收。`;
      } else if (x === station.x && y === station.y) {
        if (state.carried) {
          const amount = state.carried;
          state.delivered += amount;
          state.carried = 0;
          if (state.delivered === 5) {
            state.won = true; state.running = false;
            feedback.textContent = '成功！5 份廚餘全部送抵回收站。記得在生活中先瀝乾湯汁，移除包裝，再分類投放。';
          } else feedback.textContent = `已送抵 ${amount} 份廚餘！目前完成 ${state.delivered} / 5，繼續收集餘下廚餘。`;
        } else feedback.textContent = '這是回收站。先收集地圖上的廚餘，再回來交收。';
      } else feedback.textContent = `收集車位於第 ${y + 1} 行、第 ${x + 1} 欄。車上 ${state.carried} 份；已送抵 ${state.delivered} / 5。`;
      render();
    }
    start.addEventListener('click', () => {
      if (state.won) return;
      state.started = true;
      state.running = !state.running;
      feedback.textContent = state.running ? '出發！收集廚餘，繞過灰色包裝，再送到右邊綠色回收站。' : '遊戲已暫停。按「繼續運送」即可接續。';
      render();
      if (state.running) board.focus({ preventScroll: true });
    });
    root.querySelector('[data-fg="reset"]').addEventListener('click', reset);
    board.addEventListener('keydown', event => {
      const direction = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }[event.key];
      if (direction && state.running) { event.preventDefault(); move(direction); }
    });
    directionButtons.forEach(button => button.addEventListener('click', () => move(button.dataset.dir)));
    reset();
  };
})();
