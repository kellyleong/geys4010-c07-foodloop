(function () {
  'use strict';

  const districtCentres = {
    '中西區': [22.284, 114.151], '東區': [22.284, 114.225],
    '南區': [22.248, 114.164], '灣仔': [22.280, 114.175],
    '九龍城': [22.329, 114.190], '油尖旺': [22.311, 114.171],
    '黃大仙': [22.345, 114.202], '觀塘': [22.313, 114.225],
    '深水埗': [22.331, 114.160], '西貢': [22.383, 114.274],
    '葵青': [22.354, 114.117], '荃灣': [22.371, 114.113],
    '屯門': [22.392, 113.973], '元朗': [22.445, 114.024],
    '沙田': [22.382, 114.188], '北區': [22.494, 114.138],
    '大埔': [22.450, 114.167], '離島': [22.280, 113.940]
  };

  window.initBinMap = async function () {
    const root = document.getElementById('bin-map');
    if (!root || root.dataset.ready) return;
    root.dataset.ready = 'true';
    const style = document.createElement('style');
    style.textContent = `
      #bin-map{--ink:#123d38;--teal:#00695f;--paper:#f5f6f0;--lime:#d4ee85;--mist:#e6ece5;color:var(--ink);font-size:16px;line-height:1.65}
      #bin-map *{box-sizing:border-box}
      #bin-map .bm-layout{display:grid;grid-template-columns:minmax(0,58fr) minmax(0,42fr);border:0;border-radius:0;overflow:hidden;background:var(--paper)}
      #bin-map .bm-map-side{background:var(--mist);min-width:0;display:flex;flex-direction:column}
      #bin-map .bm-map-heading{padding:22px 24px 16px}
      #bin-map .bm-map-heading h3{font-size:20px;margin:0 0 6px;font-weight:700;letter-spacing:-.02em}
      #bin-map .bm-map-heading p{margin:0;font-size:14px;line-height:1.6}
      #bin-map .bm-map{height:530px;width:100%;z-index:0;background:#dce4df;flex:1;min-height:400px}
      #bin-map .bm-map-note{padding:15px 24px;font-size:14px;line-height:1.65;margin:0;background:var(--paper)}
      #bin-map .bm-tile-status{padding:10px 24px;background:#eee7d5;font-size:14px;margin:0}
      #bin-map .bm-results-side{padding:24px;min-width:0;background:var(--paper)}
      #bin-map .bm-form{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      #bin-map .bm-search-field{grid-column:1/-1}
      #bin-map label{font-size:14px;font-weight:700;display:block;margin-bottom:5px}
      #bin-map input,#bin-map select{width:100%;border:1px solid #b8c8be;border-radius:0;background:var(--paper);color:var(--ink);font:inherit;font-size:14px;padding:11px 12px;min-height:46px}
      #bin-map input::placeholder{color:#6d7c73}
      #bin-map :focus-visible{outline:3px solid var(--teal);outline-offset:3px}
      #bin-map .bm-results-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:21px 0 10px;border-top:0;padding-top:16px}
      #bin-map .bm-count{font-size:14px;margin:0;font-weight:700}
      #bin-map button{font-family:inherit;cursor:pointer}
      #bin-map .bm-reset{background:none;border:0;border-bottom:1px solid #9baea1;color:var(--teal);font-size:14px;padding:3px 0}
      #bin-map .bm-results{list-style:none;margin:0;padding:0;height:438px;max-height:438px;overflow:auto;scrollbar-width:thin;scrollbar-color:#aec1b4 transparent}
      #bin-map .bm-result{padding:18px 14px;margin-bottom:12px;background:#edf1e9}
      #bin-map .bm-result:first-child{padding-top:18px}
      #bin-map .bm-result-top{display:flex;gap:12px;align-items:baseline;justify-content:space-between}
      #bin-map .bm-result h4{font-size:17px;margin:0;font-weight:700}
      #bin-map .bm-district{font-size:14px;background:var(--mist);border-radius:0;padding:2px 6px;white-space:nowrap}
      #bin-map .bm-en{font-size:14px;color:#64796d;margin:2px 0 7px}
      #bin-map .bm-details{font-size:14px;line-height:1.75;margin:0 0 8px}
      #bin-map .bm-meta{font-size:14px;color:#64796d;margin:0 0 6px}
      #bin-map .bm-official{font-size:14px;color:var(--teal);font-weight:700;text-underline-offset:3px}
      #bin-map .bm-tenant{font-size:14px;color:#7b571e;margin:4px 0 7px}
      #bin-map .bm-pagination{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px}
      #bin-map .bm-pagination button{background:var(--paper);border:1px solid #c5d2c7;color:var(--ink);border-radius:0;padding:8px 12px;min-height:40px;font-size:14px}
      #bin-map .bm-pagination button:disabled{opacity:.4;cursor:default}
      #bin-map .bm-page-label{font-size:14px}
      #bin-map .bm-empty{padding:25px 0;font-size:14px}
      #bin-map .bm-map-unavailable{padding:30px;font-size:15px}
      #bin-map .leaflet-container{font-family:inherit}
      #bin-map .leaflet-tooltip{color:var(--ink);border:1px solid #c5d2c7;box-shadow:0 3px 10px #123d3814;font-family:inherit;font-size:14px}
      #bin-map .bm-source{font-size:14px;line-height:1.75;color:#61776a;margin:14px 0 0}
      @media(max-width:820px){#bin-map .bm-layout{grid-template-columns:1fr}#bin-map .bm-map{height:350px;min-height:350px;flex:auto}#bin-map .bm-results-side{padding:20px}#bin-map .bm-results{height:430px;max-height:430px}#bin-map .bm-map-heading{padding:20px}#bin-map .bm-map-note{padding:12px 20px}}
      @media(prefers-reduced-motion:reduce){#bin-map .leaflet-zoom-animated{transition:none}}
    `;
    root.replaceChildren(style);
    const el = (tag, cls, text) => {
      const node = document.createElement(tag);
      if (cls) node.className = cls;
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const loading = el('p', 'bm-empty', '正在載入回收位置⋯');
    loading.setAttribute('role', 'status');
    root.append(loading);
    let data;
    try {
      const response = await fetch('./data/bin-locations.json');
      if (!response.ok) throw new Error('Unable to load locations');
      data = await response.json();
    } catch (error) {
      loading.textContent = '暫時未能載入位置名單，請重新整理頁面。';
      const sourceLink = el('a', '', '回收位置資料（JSON）');
      sourceLink.href = 'data/bin-locations.json';
      sourceLink.download = 'bin-locations.json';
      root.append(sourceLink);
      return;
    }
    loading.remove();
    const locations = data.locations;
    const districts = Object.keys(districtCentres).filter(name => locations.some(row => row.district === name));
    const layout = el('div', 'bm-layout');
    const mapSide = el('div', 'bm-map-side');
    const mapHeading = el('div', 'bm-map-heading');
    const mapTitle = el('h3', '', '全港智能廚餘桶・地區概覽');
    mapTitle.id = 'bm-map-title';
    mapHeading.append(mapTitle, el('p', '', '點選地區圓點，或使用搜尋欄尋找屋邨及樓宇。'));
    const mapContainer = el('div', 'bm-map');
    mapContainer.setAttribute('aria-label', '香港地區概覽地圖，圓點代表地區而非回收箱實際位置');
    const tileStatus = el('p', 'bm-tile-status', '底圖暫時未能載入；地區選單及完整位置名單仍可使用。');
    tileStatus.hidden = true;
    tileStatus.setAttribute('role', 'status');
    mapSide.append(mapHeading, mapContainer, tileStatus,
      el('p', 'bm-map-note', '● 地區概覽點，並非箱位。請按「官方詳細位置圖」核對回收箱所在樓宇及平台；使用資格以屋邨安排為準。'));
    const resultsSide = el('div', 'bm-results-side');
    const form = el('form', 'bm-form');
    form.setAttribute('role', 'search');
    form.setAttribute('aria-label', '搜尋智能廚餘回收箱位置');
    form.addEventListener('submit', event => event.preventDefault());
    const searchField = el('div', 'bm-search-field');
    const searchLabel = el('label', '', '搜尋屋邨或樓宇');
    searchLabel.htmlFor = 'bm-search';
    const search = el('input');
    search.id = 'bm-search'; search.type = 'search';
    search.placeholder = '例如：水泉澳、利安、Sha Tin';
    search.autocomplete = 'off';
    searchField.append(searchLabel, search);
    const makeSelect = (id, label, values, allText) => {
      const wrapper = el('div');
      const caption = el('label', '', label); caption.htmlFor = id;
      const select = el('select'); select.id = id;
      const all = el('option', '', allText); all.value = ''; select.append(all);
      values.forEach(value => { const option = el('option', '', value); option.value = value; select.append(option); });
      wrapper.append(caption, select);
      return {wrapper, select};
    };
    const areaField = makeSelect('bm-area', '區域', ['港島', '九龍', '新界', '離島'], '所有區域');
    const districtField = makeSelect('bm-district', '地區', districts, '所有地區');
    form.append(searchField, areaField.wrapper, districtField.wrapper);
    const header = el('div', 'bm-results-header');
    const count = el('p', 'bm-count'); count.setAttribute('aria-live', 'polite');
    const reset = el('button', 'bm-reset', '重設篩選'); reset.type = 'button';
    header.append(count, reset);
    const resultList = el('ul', 'bm-results'); resultList.setAttribute('aria-label', '符合條件的回收位置');
    const pagination = el('nav', 'bm-pagination'); pagination.setAttribute('aria-label', '位置名單分頁');
    const previous = el('button', '', '← 上一頁'); previous.type = 'button';
    const next = el('button', '', '下一頁 →'); next.type = 'button';
    const pageLabel = el('span', 'bm-page-label');
    pagination.append(previous, pageLabel, next);
    resultsSide.append(form, header, resultList, pagination);
    layout.append(mapSide, resultsSide);
    root.append(layout, el('p', 'bm-source', '資料來源：公共屋邨／屋苑智能廚餘回收箱位置名單，截至 2026 年 9 月 30 日。名單共 221 個屋邨／屋苑，並非回收箱總數；每個屋邨可能設有多個回收箱。星號 * 表示該位置只供該屋苑租戶使用。'));

    let page = 1;
    const pageSize = 8;
    let map = null;
    const markers = {};
    function highlightDistrict() {
      Object.entries(markers).forEach(([name, marker]) => {
        const selected = districtField.select.value === name;
        marker.setStyle({color: selected ? '#123d38' : '#00695f', fillColor: selected ? '#d4ee85' : '#00695f', fillOpacity: selected ? 1 : .78, weight: selected ? 3 : 2});
        marker.setRadius(selected ? 15 : 11);
      });
    }
    function selectDistrict(name) {
      districtField.select.value = name;
      areaField.select.value = locations.find(row => row.district === name).area;
      Array.from(districtField.select.options).forEach(option => {option.hidden = !!option.value && !locations.some(row => row.district === option.value && row.area === areaField.select.value);});
      page = 1;
      render();
      if (map) map.setView(districtCentres[name], 12, {animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches});
    }
    function render() {
      const query = search.value.trim().toLocaleLowerCase();
      const filtered = locations.filter(row =>
        (!areaField.select.value || row.area === areaField.select.value) &&
        (!districtField.select.value || row.district === districtField.select.value) &&
        (!query || [row.name, row.name_en, row.district, row.details, row.details_en].join(' ').toLocaleLowerCase().includes(query))
      );
      const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
      page = Math.min(page, pages);
      count.textContent = `找到 ${filtered.length} 個屋邨／屋苑`;
      resultList.replaceChildren();
      if (!filtered.length) resultList.append(el('li', 'bm-empty', '沒有符合的位置。請嘗試另一個名稱，或重設篩選。'));
      filtered.slice((page - 1) * pageSize, page * pageSize).forEach(row => {
        const item = el('li', 'bm-result');
        const top = el('div', 'bm-result-top');
        top.append(el('h4', '', row.name), el('span', 'bm-district', row.district));
        item.append(top, el('p', 'bm-en', row.name_en), el('p', 'bm-details', row.details));
        if (row.tenant_only_locations) item.append(el('p', 'bm-tenant', '* 標示的位置只供該屋苑租戶使用。'));
        const date = row.commencement_date.split('-');
        item.append(el('p', 'bm-meta', `啟用日期 ${date[0]}.${date[1]}.${date[2]} · 原資料第 ${row.source_page} 頁`));
        const link = el('a', 'bm-official', '官方詳細位置圖 ↗');
        link.href = row.official_map_url; link.target = '_blank'; link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `${row.name} 官方詳細位置圖，在新分頁開啟`);
        item.append(link); resultList.append(item);
      });
      pageLabel.textContent = `第 ${page} / ${pages} 頁`;
      previous.disabled = page <= 1;
      next.disabled = page >= pages;
      resultList.scrollTop = 0;
      highlightDistrict();
    }
    search.addEventListener('input', () => {page = 1; render();});
    areaField.select.addEventListener('change', () => {
      const selectedDistrict = districtField.select.value;
      if (selectedDistrict && !locations.some(row => row.district === selectedDistrict && (!areaField.select.value || row.area === areaField.select.value))) districtField.select.value = '';
      Array.from(districtField.select.options).forEach(option => {option.hidden = !!option.value && !!areaField.select.value && !locations.some(row => row.district === option.value && row.area === areaField.select.value);});
      page = 1; render();
      if (map && !districtField.select.value) map.setView([22.365, 114.115], 10, {animate: false});
    });
    districtField.select.addEventListener('change', () => {
      const name = districtField.select.value;
      if (name) selectDistrict(name);
      else { page = 1; render(); if (map) map.setView([22.365, 114.115], 10, {animate: false}); }
    });
    reset.addEventListener('click', () => {
      search.value = ''; areaField.select.value = ''; districtField.select.value = '';
      Array.from(districtField.select.options).forEach(option => {option.hidden = false;});
      page = 1; render();
      if (map) map.setView([22.365, 114.115], 10, {animate: false});
    });
    previous.addEventListener('click', () => {page -= 1; render();});
    next.addEventListener('click', () => {page += 1; render();});
    render();

    if (!window.L) {
      mapContainer.append(el('p', 'bm-map-unavailable', '地圖暫時未能載入。你仍可使用地區篩選及完整名單，並開啟官方詳細位置圖。'));
      return;
    }
    map = L.map(mapContainer, {scrollWheelZoom: false}).setView([22.365, 114.115], 10);
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors', maxZoom: 18
    }).addTo(map);
    tiles.on('tileerror', () => {tileStatus.hidden = false;});
    districts.forEach(name => {
      const total = locations.filter(row => row.district === name).length;
      const marker = L.circleMarker(districtCentres[name], {radius: 11, color: '#00695f', fillColor: '#00695f', fillOpacity: .78, weight: 2}).addTo(map);
      marker.bindTooltip(`${name} · ${total} 個屋邨／屋苑（地區概覽點）`, {direction: 'top'});
      marker.on('click', () => selectDistrict(name));
      const markerElement = marker.getElement();
      if (markerElement) {
        markerElement.setAttribute('tabindex', '0'); markerElement.setAttribute('role', 'button');
        markerElement.setAttribute('aria-label', `${name}，${total} 個屋邨或屋苑，點選篩選。此圓點並非箱位。`);
        markerElement.addEventListener('keydown', event => {if (event.key === 'Enter' || event.key === ' ') {event.preventDefault(); selectDistrict(name);}});
      }
      markers[name] = marker;
    });
    highlightDistrict();
    new ResizeObserver(() => map.invalidateSize()).observe(mapContainer);
  };
}());
