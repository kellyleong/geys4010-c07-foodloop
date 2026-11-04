window.initOfficialFoodData = () => {
  wireTabs('[data-statistics-view]', button => {
    document.querySelectorAll('.data-view').forEach(panel => {
      panel.hidden = panel.id !== button.getAttribute('aria-controls');
    });
  });

  const reloadButton = document.querySelector('#reload-food-data');
  const status = document.querySelector('#data-sync-status');
  const formatNumber = value => new Intl.NumberFormat('zh-HK').format(value);

  async function loadOfficialData() {
    reloadButton.disabled = true;
    status.textContent = '正在讀取最近同步紀錄。';
    try {
      const response = await fetch('data/official-food-waste.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Unable to load official data');
      const data = await response.json();
      const rows = data.annual_recovery.rows;
      const mostRecent = rows[rows.length - 1];
      document.querySelector('#annual-data-year').textContent = mostRecent.year;
      document.querySelector('#annual-data-value').textContent = formatNumber(mostRecent.thousand_tonnes);
      const tableBody = document.querySelector('#annual-data-rows');
      tableBody.replaceChildren();
      rows.forEach(row => {
        const tr = document.createElement('tr');
        const year = document.createElement('th');
        year.scope = 'row';
        year.textContent = row.year;
        const amount = document.createElement('td');
        amount.textContent = formatNumber(row.thousand_tonnes);
        tr.append(year, amount);
        tableBody.append(tr);
      });
      document.querySelector('#rcp-data-value').textContent = formatNumber(data.recycling_network.refuse_collection_points);
      document.querySelector('#spots-data-value').textContent = formatNumber(data.recycling_network.recycling_spots);
      const synchronized = new Date(data.synchronized_at);
      const date = new Intl.DateTimeFormat('zh-HK', { timeZone: 'Asia/Hong_Kong', year: 'numeric', month: '2-digit', day: '2-digit' }).format(synchronized);
      const time = new Intl.DateTimeFormat('zh-HK', { timeZone: 'Asia/Hong_Kong', hour: '2-digit', minute: '2-digit', hour12: false }).format(synchronized);
      status.textContent = `最近成功同步：${date} ${time}（香港時間）｜年度數據至 ${mostRecent.year} 年`;
    } catch {
      status.textContent = '同步紀錄暫時無法讀取；保留目前畫面的資料，請按各項標示日期及官方來源核對。';
    } finally {
      reloadButton.disabled = false;
    }
  }

  reloadButton.addEventListener('click', loadOfficialData);
  loadOfficialData();
};
