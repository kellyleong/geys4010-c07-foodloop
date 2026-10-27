(() => {
  const destinations = {
    opark2: {
      label: 'O·PARK2（沙嶺）', short: '預測 O·PARK2', displayName: 'O·PARK2', mapLabel: 'O·PARK2',
      region: '北區沙嶺 · 缸瓦甫路', position: [22.527, 114.129], predicted: true,
      description: '推測終點：沙嶺 O·PARK2。推測根據追蹤器在坪輋、粉嶺一帶的活動範圍及設施位置，尚待收運紀錄確認。',
      reasoning: '善衡追蹤器從中大移到坪輋，再到粉嶺業豐街一帶。沙嶺 O·PARK2 位於新界北，是本次選取的地理候選處理終點。',
      limitation: '此去向依零散定位及設施位置推測，尚待收運紀錄確認。',
      sources: [{name:'政府 O·PARK2 設施介紹',url:'https://www.info.gov.hk/gia/general/202405/20/P2024052000597.htm'}]
    },
    shatin: {
      label: '沙田污水處理廠', short: '預測沙田廠', displayName: '沙田污水處理廠', mapLabel: '沙田污水廠',
      region: '馬料水 · 水廠街1號', position: [22.407, 114.214], predicted: true,
      description: '推測終點：沙田污水處理廠內的廚餘預處理及共厭氧消化設施。推測根據沙田、大水坑一帶的定位及設施位置，尚待收運紀錄確認。',
      reasoning: '崇基追蹤器的觀察範圍包括九肚山、小瀝源及大水坑。鄰近的沙田污水處理廠已有廚餘預處理及共厭氧消化設施，因此列為地理候選。',
      limitation: '廣善街在2024年官方資料中列有廚餘流動收集點，沿途停留可能涉及巡迴收集；現有定位不能確認當次使用該點，亦未證實抵達沙田廠。',
      sources: [{name:'環保署廚餘共厭氧消化計劃',url:'https://www.epd.gov.hk/epd/tc_chi/environmentinhk/waste/prob_solutions/codigestion_trial_scheme.html'},{name:'2024年廣善街廚餘收集點資料',url:'https://www.districtcouncils.gov.hk/st/doc/2024_2027/en/dc_meetings_doc/26827/st_2024_47_tcannexII.pdf'}]
    }
  };
  const routes = {
    shho: {
      name: '善衡書院飯堂', destination: destinations.opark2, summary: '校園 → 坪輋 → 粉嶺，再顯示預測處理終點。',
      steps: [
        { label: '善衡書院飯堂', short: '校園出發', position: [22.418, 114.210], description: '追蹤器從善衡書院飯堂出發，起點位於中大校園。' },
        { label: '坪輋一帶', short: '坪輋', position: [22.528, 114.159], description: '定位記錄到坪輋、五洲路附近，顯示追蹤器向新界北移動。' },
        { label: '粉嶺業豐街一帶', short: '粉嶺', position: [22.493, 114.146], description: '最後一筆觀察位於粉嶺業豐街、多利工業大廈附近。這是中途觀察位置，未能確認為廚餘處理站。' }
      ]
    },
    chungchi: {
      name: '崇基書院廚餘回收桶', destination: destinations.shatin, summary: '校園 → 九肚山 → 小瀝源 → 大水坑，再顯示預測處理終點。',
      steps: [
        { label: '崇基書院廚餘回收桶', short: '校園出發', position: [22.415, 114.209], description: '追蹤器從崇基書院的廚餘回收桶出發，地圖概略標示學院一帶。' },
        { label: '九肚山玖瓏山一帶', short: '九肚山', position: [22.414, 114.199], description: '追蹤器其後在九肚山玖瓏山一帶留下定位紀錄。' },
        { label: '小瀝源廣善街', short: '小瀝源', position: [22.382, 114.214], description: '下一個觀察位置位於小瀝源廣善街、廣源邨附近。' },
        { label: '大水坑恆信街一帶', short: '大水坑', position: [22.406, 114.223], description: '最後兩筆定位均在馬鞍山恆信街、大水坑一帶，合併顯示為同一區域。' }
      ]
    }
  };
  const bearing = (from, to) => (Math.atan2((to[1] - from[1]) * Math.cos((from[0] + to[0]) * Math.PI / 360), to[0] - from[0]) * 180 / Math.PI + 360) % 360;
  const directionNames = ['向北', '向東北', '向東', '向東南', '向南', '向西南', '向西', '向西北'];

  window.initTrackerExplorer = () => {
    const root = document.querySelector('#tracker-explorer');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    root.innerHTML = `
      <div class="tracking-tabs" role="tablist" aria-label="選擇藍牙追蹤器">
        <button type="button" role="tab" id="tracking-shho" aria-selected="true" aria-controls="tracking-panel" data-route="shho">善衡書院飯堂</button>
        <button type="button" role="tab" id="tracking-chungchi" aria-selected="false" aria-controls="tracking-panel" data-route="chungchi" tabindex="-1">崇基書院回收桶</button>
      </div>
      <div id="tracking-panel" role="tabpanel" aria-labelledby="tracking-shho">
        <div class="tracking-toolbar"><div><h3 class="tracking-route-name"></h3><p class="tracking-route-summary"></p></div><div class="tracking-actions"><button type="button" class="tracking-overview" aria-pressed="false">查看完整去向</button><button type="button" class="button tracking-play">播放移動方向</button></div></div>
        <div class="tracking-stage"><div><span>從</span><strong class="tracking-from"></strong></div><span class="tracking-direction" aria-label="移動方向"></span><div><span class="tracking-stage-kind">定位方向</span><strong class="tracking-to"></strong></div></div>
        <div class="tracking-map-side"><div id="tracking-map" aria-label="追蹤器移動方向與預測終點地圖"></div><div class="tracking-map-legend"><span><i class="tracking-observed-line"></i>定位方向</span><span><i class="tracking-predicted-line"></i>預測方向</span><p>回收車沿紀錄先後移動；線條顯示方向，並非實際行車道路。</p></div></div>
        <div class="tracking-playhead"><button type="button" class="tracking-previous" aria-label="上一個位置">上一站</button><label for="tracking-position">目前位置 <output id="tracking-count"></output></label><button type="button" class="tracking-next" aria-label="下一個位置">下一站</button><input id="tracking-position" type="range" min="0" value="0" step="1" aria-label="選擇位置或預測終點"></div>
        <ol class="tracking-stops" aria-label="移動位置與預測終點"></ol>
        <div class="tracking-current"><h4></h4><p></p></div>
        <p class="tracking-status" role="status" aria-live="polite"></p>
        <div class="tracking-forecast"><div><p>我們推測的處理終點</p><h3 class="tracking-forecast-name"></h3><p class="tracking-forecast-region"></p><p class="tracking-forecast-status">推測 · 尚未確認</p></div><div><h4>推測依據</h4><p class="tracking-forecast-reason"></p><p class="tracking-forecast-limitation"></p><div class="tracking-forecast-sources"></div></div></div>
        <details class="tracking-facilities"><summary>香港還有哪些廚餘處理設施？</summary><p>環保署2026–27年度政府答覆列出以下四項公共集中設施／計劃，總設計處理能力為每日600公噸。另有私營及在地廚餘處理系統，以下並非全港完整名錄。</p><div class="tracking-facility-table"><table><thead><tr><th scope="col">設施／計劃</th><th scope="col">位置</th><th scope="col">資料</th></tr></thead><tbody><tr><td>O·PARK1</td><td>小蠔灣深豐路5號</td><td><a href="https://www.opark.gov.hk/tc/deliver.php" target="_blank" rel="noreferrer">設施地址</a></td></tr><tr><td>O·PARK2</td><td>北區沙嶺缸瓦甫路</td><td><a href="https://www.info.gov.hk/gia/general/202405/20/P2024052000597.htm" target="_blank" rel="noreferrer">政府介紹</a></td></tr><tr><td>大埔廚餘預處理及共消化</td><td>大利街預處理設施；大貴街7號污水處理廠</td><td><a href="https://www.epd.gov.hk/epd/tc_chi/environmentinhk/waste/prob_solutions/codigestion_trial_scheme.html" target="_blank" rel="noreferrer">計劃介紹</a></td></tr><tr><td>沙田廚餘預處理及共消化</td><td>馬料水水廠街1號沙田污水處理廠</td><td><a href="https://tel.directory.gov.hk/0223000124_CHI.html" target="_blank" rel="noreferrer">政府地址</a></td></tr></tbody></table></div><p><a href="https://www.epd.gov.hk/epd/sites/default/files/epd/tc_chi/news_events/legco/files/fc_26-27_chi.pdf" target="_blank" rel="noreferrer">環保署2026–27年度政府答覆</a>亦列有10個已運作的在地系統。私營例子包括<a href="https://www.gekrrl.hk/" target="_blank" rel="noreferrer">綠色環保廚餘回收有限公司</a>，營辦商網站列工場位於上水河上鄉鳳崗山路丈量約份第95約地段第5號，並提供廚餘收集及動物飼料生產服務。</p></details>
      </div>`;
    const tabs = [...root.querySelectorAll('[data-route]')];
    const playButton = root.querySelector('.tracking-play');
    const overviewButton = root.querySelector('.tracking-overview');
    const previous = root.querySelector('.tracking-previous');
    const next = root.querySelector('.tracking-next');
    const slider = root.querySelector('#tracking-position');
    const count = root.querySelector('#tracking-count');
    const status = root.querySelector('.tracking-status');
    const stopList = root.querySelector('.tracking-stops');
    const current = root.querySelector('.tracking-current');
    const stage = root.querySelector('.tracking-stage');
    const mapElement = root.querySelector('#tracking-map');
    let routeKey = 'shho', index = 0, running = false, frameId = 0, lastTime = 0, elapsed = 0;
    let phase = 'hold', overview = false, visible = false, hasStarted = false;
    let map, routeLayer, travelled, forecastTravelled, cursor;
    let markers = [];
    const observations = () => routes[routeKey].steps;
    const destination = () => routes[routeKey].destination;
    const stops = () => [...observations(), destination()];

    function updatePlayButton() {
      playButton.textContent = preference.matches ? '逐站查看方向' : running ? '暫停動畫' : index === stops().length - 1 ? '重新播放方向' : elapsed > 0 ? '繼續播放方向' : '播放移動方向';
    }
    function pause() {
      running = false; cancelAnimationFrame(frameId); lastTime = 0; updatePlayButton();
    }
    function fitRoute(animate = false) {
      overviewButton.setAttribute('aria-pressed', String(overview));
      overviewButton.textContent = overview ? '返回定位範圍' : '查看完整去向';
      if (!map) return;
      const bounds = L.latLngBounds((overview ? stops() : observations()).map(stop => stop.position));
      const options = { padding: [45, 45], maxZoom: 13, animate: false };
      if (animate && !preference.matches) map.flyToBounds(bounds, {...options, animate: true, duration: .9});
      else map.fitBounds(bounds, options);
    }
    function renderDirection(fromIndex, toIndex) {
      const from = stops()[fromIndex], to = stops()[toIndex];
      root.querySelector('.tracking-from').textContent = from.short;
      root.querySelector('.tracking-to').textContent = to.label;
      root.querySelector('.tracking-stage-kind').textContent = to.predicted ? '預測方向' : '定位方向';
      root.querySelector('.tracking-direction').textContent = directionNames[Math.round(bearing(from.position, to.position) / 45) % 8] + ' →';
      stage.classList.toggle('is-predicted', Boolean(to.predicted));
    }
    function paintMap(position = stops()[index].position, movingTo = index) {
      if (!map) return;
      const predicting = Boolean(stops()[movingTo].predicted);
      cursor.setLatLng(position);
      const cursorElement = cursor.getElement();
      cursorElement.classList.toggle('is-predicted', predicting);
      const from = movingTo > index ? index : Math.max(0, index - 1);
      const to = movingTo > index ? movingTo : index === 0 ? 1 : index;
      const heading = bearing(stops()[from].position, stops()[to].position);
      cursorElement.querySelector('svg').style.transform = `rotate(${heading}deg)`;
      cursorElement.querySelector('.tracking-truck-badge').style.transform = `rotate(${-heading}deg)`;
      const completed = observations().slice(0, Math.min(index + 1, observations().length)).map(stop => stop.position);
      travelled.setLatLngs(predicting ? completed : [...completed, position]);
      forecastTravelled.setLatLngs(predicting ? [observations().at(-1).position, position] : []);
      markers.forEach(({marker, stopIndex}) => marker.setStyle({fillColor: stopIndex === index ? '#d4ee85' : '#f5f6f0', weight: stopIndex === index ? 4 : 2}));
    }
    function renderStep() {
      const stop = stops()[index];
      current.querySelector('h4').textContent = stop.predicted ? '預測終點：' + stop.label : stop.label;
      current.querySelector('p').textContent = stop.description;
      current.classList.toggle('is-predicted', Boolean(stop.predicted));
      count.value = stop.predicted ? '預測終點' : `${index + 1} / ${observations().length}`;
      slider.value = index;
      slider.setAttribute('aria-valuetext', (stop.predicted ? '預測終點：' : '定位位置：') + stop.label);
      previous.disabled = index === 0; next.disabled = index === stops().length - 1;
      stopList.querySelectorAll('button').forEach((button, itemIndex) => {
        if (itemIndex === index) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
        button.classList.toggle('is-past', itemIndex < index);
      });
      renderDirection(Math.max(0, index - 1), index === 0 ? 1 : index);
      status.textContent = stop.predicted ? `黃色路段為推測：可能前往${destination().displayName}，尚待收運紀錄確認。` : `${routes[routeKey].name}：顯示${stop.label}的定位紀錄。`;
      updatePlayButton();
    }
    function chooseStop(value) {
      pause(); index = value; elapsed = 0; phase = 'hold';
      if (stops()[index].predicted) overview = true;
      fitRoute(true); renderStep(); paintMap();
    }
    function selectRoute(key) {
      pause(); routeKey = key; index = 0; elapsed = 0; phase = 'hold'; overview = false;
      tabs.forEach(tab => {const active = tab.dataset.route === key; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;});
      root.querySelector('#tracking-panel').setAttribute('aria-labelledby', 'tracking-' + key);
      root.querySelector('.tracking-route-name').textContent = routes[key].name + '出發';
      root.querySelector('.tracking-route-summary').textContent = routes[key].summary;
      const candidate = destination();
      root.querySelector('.tracking-forecast-name').textContent = candidate.displayName;
      root.querySelector('.tracking-forecast-region').textContent = candidate.region;
      root.querySelector('.tracking-forecast-reason').textContent = candidate.reasoning;
      root.querySelector('.tracking-forecast-limitation').textContent = candidate.limitation;
      const sourceList = root.querySelector('.tracking-forecast-sources');
      sourceList.replaceChildren();
      candidate.sources.forEach(source => {const link=document.createElement('a');link.href=source.url;link.textContent=source.name;link.target='_blank';link.rel='noreferrer';sourceList.append(link);});
      slider.max = stops().length - 1;
      stopList.style.setProperty('--stop-count', stops().length);
      stopList.replaceChildren();
      stops().forEach((stop, stopIndex) => {
        const item = document.createElement('li'), button = document.createElement('button');
        button.type = 'button'; button.textContent = stop.short; button.setAttribute('aria-label', '查看' + (stop.predicted ? '預測終點' : '') + stop.label);
        if (stop.predicted) button.className = 'tracking-prediction-stop';
        button.addEventListener('click', () => chooseStop(stopIndex)); item.append(button); stopList.append(item);
      });
      if (map) {
        routeLayer.clearLayers(); markers = [];
        const positions = observations().map(stop => stop.position);
        L.polyline(positions, {color:'#00695f',weight:4,opacity:.32,interactive:false}).addTo(routeLayer);
        travelled = L.polyline([], {color:'#00695f',weight:5,interactive:false}).addTo(routeLayer);
        L.polyline([positions.at(-1),destination().position], {color:'#a87317',weight:4,opacity:.6,dashArray:'8 10',interactive:false}).addTo(routeLayer);
        forecastTravelled = L.polyline([], {color:'#a87317',weight:5,dashArray:'8 10',interactive:false}).addTo(routeLayer);
        observations().forEach((stop, stopIndex) => {
          const marker = L.circleMarker(stop.position,{radius:9,color:'#123d38',fillColor:'#f5f6f0',fillOpacity:1,weight:2}).addTo(routeLayer);
          marker.bindTooltip(stop.label,{direction:'top'}); marker.on('click',() => chooseStop(stopIndex));
          const element = marker.getElement(); element.setAttribute('tabindex','0'); element.setAttribute('role','button'); element.setAttribute('aria-label','查看'+stop.label);
          element.addEventListener('keydown',event => {if(event.key==='Enter'||event.key===' '){event.preventDefault();chooseStop(stopIndex);}});
          markers.push({marker,stopIndex});
        });
        L.marker(destination().position,{icon:L.divIcon({className:'tracking-destination'+(routeKey==='chungchi'?' tracking-destination-left':''),html:`<strong>${destination().mapLabel}</strong><span>推測</span>`,iconSize:[112,56],iconAnchor:routeKey==='chungchi'?[126,28]:[56,28]})}).addTo(routeLayer).on('click',()=>chooseStop(stops().length-1));
        cursor = L.marker(positions[0],{
          interactive:false,keyboard:false,zIndexOffset:800,
          icon:L.divIcon({
            className:'tracking-cursor',iconSize:[64,80],iconAnchor:[32,40],
            html:`<svg viewBox="0 0 72 88" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 10Q15 4 23 4H49Q57 4 57 10V31H61V82H11V31H15Z" fill="#fffdf2" stroke="#fffdf2" stroke-width="6" stroke-linejoin="round"/>
              <g fill="#263c37" stroke="#15392f" stroke-width="2">
                <rect x="6" y="18" width="11" height="19" rx="4"/><rect x="55" y="18" width="11" height="19" rx="4"/>
                <rect x="6" y="58" width="11" height="20" rx="4"/><rect x="55" y="58" width="11" height="20" rx="4"/>
              </g>
              <path d="M9 22V32M63 22V32M9 62V74M63 62V74" stroke="#59756b" stroke-width="2" stroke-linecap="round"/>
              <rect x="12" y="32" width="48" height="49" rx="7" fill="var(--truck-body)" stroke="#174a3b" stroke-width="2"/>
              <path d="M18 37H54" stroke="#fffdf2" stroke-opacity=".42" stroke-width="3" stroke-linecap="round"/>
              <path d="M16 42V70M56 42V70" stroke="#f2d169" stroke-width="3" stroke-linecap="round"/>
              <path d="M21 42H51" stroke="#123d38" stroke-opacity=".22" stroke-width="2" stroke-linecap="round"/>
              <g transform="translate(36 57)"><g class="tracking-truck-badge">
                <circle r="11.5" fill="#fffdf2" stroke="#174a3b" stroke-width="1.5"/>
                <text x="0" y="7" text-anchor="middle" fill="#174a3b" font-family="Arial,sans-serif" font-size="21" font-weight="800">6</text>
              </g></g>
              <text x="36" y="76" text-anchor="middle" fill="#fffdf2" font-family="sans-serif" font-size="8" font-weight="700" letter-spacing="1">廚餘回收</text>
              <path d="M16 81H56" stroke="#174a3b" stroke-width="4" stroke-linecap="round"/>
              <path d="M18 81L22 77M28 81L32 77M38 81L42 77M48 81L52 77" stroke="#f2d169" stroke-width="2.5"/>
              <path d="M14 83H21M51 83H58" stroke="#df6b50" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M15 18H9M57 18H63" stroke="#174a3b" stroke-width="2.5"/>
              <rect x="5" y="13" width="5" height="9" rx="2" fill="#fffdf2" stroke="#174a3b" stroke-width="1.5"/>
              <rect x="62" y="13" width="5" height="9" rx="2" fill="#fffdf2" stroke="#174a3b" stroke-width="1.5"/>
              <path d="M16 12Q16 5 23 5H49Q56 5 56 12V30Q56 35 50 35H22Q16 35 16 30Z" fill="#fffdf2" stroke="#174a3b" stroke-width="2"/>
              <path d="M21 14Q36 10 51 14L48 26H24Z" fill="#72b9c8" stroke="#174a3b" stroke-width="1.7" stroke-linejoin="round"/>
              <path d="M26 15L23 21M33 14L29 24" stroke="#d5f1ee" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M25 26L31 24M41 24L47 26" stroke="#174a3b" stroke-width="1.4" stroke-linecap="round"/>
              <path d="M22 9H27M45 9H50" stroke="#f2d169" stroke-width="3.5" stroke-linecap="round"/>
              <path d="M30 8H42" stroke="#b6c9bd" stroke-width="2" stroke-linecap="round"/>
              <rect x="28" y="29" width="16" height="5" rx="2" fill="#f4b348" stroke="#bb842d" stroke-width="1"/>
              <path d="M33 30V33M39 30V33" stroke="#ffe7ac" stroke-width="1.2"/>
            </svg>`
          })
        }).addTo(routeLayer);
      }
      fitRoute(); renderStep(); paintMap();
      if (hasStarted && visible && !preference.matches) startPlayback();
    }
    function tick(time) {
      if (!running) return;
      if (lastTime) elapsed += time - lastTime;
      lastTime = time;
      if (phase === 'hold') {
        if (elapsed >= 700) {
          phase = 'travel'; elapsed = 0; renderDirection(index,index+1);
          if (stops()[index+1].predicted) {overview = true; fitRoute(true); status.textContent = `開始播放黃色推測路段：可能前往${destination().displayName}，並非已確認的終點。`;}
        }
      } else {
        const target = stops()[index+1];
        const amount = Math.min(elapsed/(target.predicted?3500:2100),1);
        const from = stops()[index].position, to = target.position;
        paintMap([from[0]+(to[0]-from[0])*amount,from[1]+(to[1]-from[1])*amount],index+1);
        if (amount === 1) {
          index += 1; elapsed = 0; phase = 'hold'; renderStep(); paintMap();
          if (index === stops().length-1) {pause();return;}
        }
      }
      frameId = requestAnimationFrame(tick);
    }
    function startPlayback() {
      if (index === stops().length-1) {index=0; elapsed=0; phase='hold'; overview=false;fitRoute();renderStep();paintMap();}
      running=true;hasStarted=true;lastTime=0;updatePlayButton();frameId=requestAnimationFrame(tick);
    }
    playButton.addEventListener('click',()=>{if(preference.matches){chooseStop(index===stops().length-1?0:index+1);return;}if(running)pause();else startPlayback();});
    overviewButton.addEventListener('click',()=>{overview=!overview;fitRoute(true);});
    previous.addEventListener('click',()=>chooseStop(index-1));next.addEventListener('click',()=>chooseStop(index+1));
    slider.addEventListener('input',()=>chooseStop(Number(slider.value)));
    tabs.forEach((tab,tabIndex)=>{
      tab.addEventListener('click',()=>selectRoute(tab.dataset.route));
      tab.addEventListener('keydown',event=>{let target;if(event.key==='ArrowRight'||event.key==='ArrowLeft')target=tabs[1-tabIndex];if(event.key==='Home')target=tabs[0];if(event.key==='End')target=tabs[1];if(target){event.preventDefault();target.focus();selectRoute(target.dataset.route);}});
    });
    if (window.L) {
      map=L.map(mapElement,{scrollWheelZoom:false}).setView([22.418,114.210],11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'}).addTo(map);
      routeLayer=L.layerGroup().addTo(map);
      new ResizeObserver(()=>{map.invalidateSize();fitRoute();}).observe(mapElement);
    } else mapElement.innerHTML='<p class="tracking-map-unavailable">地圖暫時未能載入。你仍可選擇下方位置，查看移動次序及預測終點。</p>';
    document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
    preference.addEventListener('change',pause);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible&&running)pause();if(visible&&!hasStarted&&!preference.matches)startPlayback();},{threshold:.2}).observe(mapElement);
    selectRoute('shho');
  };
})();
