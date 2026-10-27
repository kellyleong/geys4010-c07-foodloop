const menuButton = document.querySelector('.menu-button');
const chapterMenu = document.querySelector('#chapter-menu');
function closeMenu(){chapterMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';chapterMenu.hidden=open;menuButton.setAttribute('aria-expanded',String(!open));});
chapterMenu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!chapterMenu.hidden){closeMenu();menuButton.focus();}});
document.addEventListener('click',event=>{if(!chapterMenu.contains(event.target)&&!menuButton.contains(event.target))closeMenu();});

function wireTabs(selector, render){
  const buttons=[...document.querySelectorAll(selector)];
  function select(button){buttons.forEach(b=>{const active=b===button;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});render(button);}
  buttons.forEach((button,index)=>{button.addEventListener('click',()=>select(button));button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%buttons.length;if(event.key==='ArrowLeft')next=(index+buttons.length-1)%buttons.length;if(event.key==='Home')next=0;if(event.key==='End')next=buttons.length-1;if(next!==undefined){event.preventDefault();buttons[next].focus();select(buttons[next]);}});});
  select(buttons[0]);
}

async function initResearch(){
  const panel=document.querySelector('#survey-panel');
  try{
    const response=await fetch('data/research-content.json');
    if(!response.ok)throw new Error('Unable to load research');
    const data=await response.json();
    const survey=data.survey;
    const views={
      awareness:{title:'90.2% 不清楚或不確定去向',description:'你是否清楚知道，校園收集的廚餘會被送到哪裡？',rows:survey.q9DestinationAwareness,note:'Q9，n=61。90.2%為「聽過但不確定」與「完全不知道」合計（55人）。'},
      frequency:{title:'回收，還未成為多數人的習慣',description:'當你在校園產生廚餘，而且附近有回收設施時，你通常會進行分類及回收嗎？',rows:survey.q12Frequency,note:'Q12，n=61，包含9名不適用／沒有使用機會者。'},
      improvements:{title:'方便的位置，是最多人選擇的改善',description:'哪些措施能提升你參與廚餘回收的意願？',rows:survey.improvementMeasures,note:'Q13，可複選，百分比以61人計，總和可超過100%。環保署成效資料一項為圖表原題意義節錄。'}
    };
    wireTabs('[data-survey]',button=>{
      const view=views[button.dataset.survey];
      panel.setAttribute('aria-labelledby',button.id);
      panel.replaceChildren();
      const title=document.createElement('h3');title.textContent=view.title;
      const description=document.createElement('p');description.textContent=view.description;
      const bars=document.createElement('div');bars.className='chart-bars';bars.setAttribute('role','list');bars.setAttribute('aria-label','各選項人數與比例');
      view.rows.forEach(row=>{const item=document.createElement('div');item.className='chart-row';item.setAttribute('role','listitem');const label=document.createElement('span');label.textContent=row.label;const track=document.createElement('div');track.className='chart-track';track.setAttribute('aria-hidden','true');const fill=document.createElement('div');fill.className='chart-fill';fill.style.width=row.percent+'%';track.append(fill);const number=document.createElement('span');number.className='chart-number';number.textContent=row.percent.toFixed(1)+'%';number.setAttribute('aria-label',`${row.count}人，${row.percent}%`);number.title=`${row.count}／61人`;item.append(label,track,number);bars.append(item);});
      const caption=document.createElement('p');caption.className='chart-caption';caption.textContent=view.note+' 來源：我們的中期研究報告，2026年9至10月。';
      panel.append(title,description,bars,caption);
    });
    const list=document.querySelector('#interview-list');
    data.campus.interviews.forEach((interview,index)=>{const details=document.createElement('details');if(index===0)details.open=true;const summary=document.createElement('summary');summary.textContent=interview.place;const role=document.createElement('p');role.className='interview-role';role.textContent=interview.attribution;const content=document.createElement('p');content.textContent=interview.summary;const suggestion=document.createElement('p');suggestion.className='suggestion';suggestion.textContent='受訪者建議：'+interview.suggestion;details.append(summary,role,content,suggestion);list.append(details);});
  }catch{
    panel.innerHTML='<h3>問卷圖表暫時未能載入</h3><p>請重新整理頁面。上方仍保留61份問卷的主要結果。</p>';
    document.querySelector('#interview-list').innerHTML='<p>訪問摘要暫時未能載入，請重新整理頁面。</p>';
  }
}

const processDrawings={
  receive:'<path d="M33 145h160v-65H58v65m135-42h50l36 42v25h-86m-160-25v25h246"/><circle cx="76" cy="174" r="18"/><circle cx="237" cy="174" r="18"/><path d="M79 85V61h90v24M105 61V44h38v17M111 112h41m-20-20v40"/>',
  prepare:'<path d="M56 40h215l-65 81v70h-85v-70Z"/><path d="M102 79h120M139 135h48m-48 20h48M131 191v18m28-18v18m28-18v18"/><circle cx="107" cy="60" r="6"/><circle cx="157" cy="62" r="5"/><path d="m195 49 10 14m30-14-8 11"/>',
  digest:'<path d="M76 70q0-38 84-38t84 38v128H76Zm0 0q84 36 168 0M76 175h168M105 198v17m110-17v17M244 105h36v-65h-20"/><circle cx="140" cy="124" r="9"/><circle cx="182" cy="140" r="7"/><circle cx="172" cy="97" r="5"/><path d="M119 160q40-23 83 0"/>',
  resources:'<path d="M159 40v55m0 0-81 43m81-43 81 43M80 159v50m-27-2h54m-27-34q-36-12-32-37 31-3 32 37m0 11q37-12 35-37-33-3-35 37"/><path d="m249 128-35 43h26l-9 43 42-56h-29Z"/><circle cx="159" cy="40" r="17"/>'
};
const processContent={
  receive:{title:'先秤重，再接收',measure:'密封卸料',text:'收集車先經磅橋，記錄廚餘量，再將廚餘卸入儲存坑。抓斗把物料混合後送往裝料斗。密封卸料區設雙層閘門及除味系統。',note:'源頭分類，是整段處理旅程的起點。'},
  prepare:{title:'把雜質分離',measure:'16 mm',text:'廚餘製成漿狀物，篩走16毫米或以上的雜質，再去除沙石、玻璃及金屬，為後續的生物處理做好準備。',note:'預處理仍需要資源；投放時先去除包裝，可減輕處理負擔。'},
  digest:{title:'讓微生物工作',measure:'35°C · 23日',text:'廚餘漿在約35°C的無氧環境中停留約23日。微生物分解有機物，產生生物氣，並留下可繼續處理的消化殘渣。',note:'厭氧消化與堆肥是不同處理階段。'},
  resources:{title:'分成兩條資源路徑',measure:'電力 ＋ 堆肥',text:'生物氣除硫淨化後進入熱電聯產系統。消化殘渣脫水後，則在約55°C的堆肥隧道處理約20日。',note:'以下兩個章節，分別看看它們如何回到生活。'}
};
wireTabs('[data-process]',button=>{const key=button.dataset.process;const content=processContent[key];const panel=document.querySelector('#process-panel');panel.setAttribute('aria-labelledby',button.id);panel.innerHTML=`<svg class="process-figure" viewBox="0 0 330 240" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${processDrawings[key]}</svg><div class="process-info"><div class="process-measure">${content.measure}</div><h3>${content.title}</h3><p>${content.text}</p><p class="small">${content.note}</p></div>`;});

initResearch();
window.initBinMap?.();
window.initFoodGame?.();

window.initTrackerExplorer?.();
window.initSiteMotion?.();
