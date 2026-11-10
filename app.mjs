import { seasonMatches } from './schedule.mjs';
import { players } from './players.mjs';
import { nextMatch, validLink, escapeHTML as e } from './model.mjs';
const KEY='northwest-tennis-2027-v2';
const PUBLIC=true;
const defaults={donation:'',matches:seasonMatches};
let data=structuredClone(defaults),team='boys';

const fmt=(date,options)=>new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',...options}).format(new Date(/^\d{4}-\d{2}-\d{2}$/.test(date)?date+'T12:00:00Z':date));

function render(){
 document.querySelectorAll('[data-team]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.team===team));
 const next=nextMatch(data.matches,team);
 document.querySelector('#next-match').innerHTML=next?`<div><span class="eyebrow">${team.toUpperCase()} TENNIS · SPRING 2027</span><p class="next-opponent">NORTHWEST <span class="gold-text">${next.venue==='Away'?'at':'vs.'}</span> ${e(next.opponent)}</p></div><p class="next-details"><strong>${e(fmt(next.date,{weekday:'short',month:'short',day:'numeric'}))} · ${next.timeTBD?'Time TBD':e(fmt(next.date,{hour:'numeric',minute:'2-digit'}))+' CT'}</strong><br>${e(next.venue)} · ${e(next.location)}</p>`:'<p class="next-opponent">The next chapter is coming.</p><p class="next-details">No upcoming match announced.<br>Check back for the season schedule.</p>';
 const rows=data.matches.filter(m=>m.team===team).sort((a,b)=>(a.status==='final')-(b.status==='final')||new Date(a.date)-new Date(b.date));
 document.querySelector('#match-list').innerHTML=rows.map(m=>`<article class="match-row"><div class="match-date">${e(fmt(m.date,{month:'short'}).toUpperCase())}<strong>${e(fmt(m.date,{day:'2-digit'}))}</strong></div><h3 class="match-opponent"><span>${m.venue==='Away'?'at':'vs'}</span>${e(m.opponent)}</h3><p class="match-location">${e(m.venue)} · ${e(m.location)}<br>${m.timeTBD?'Time TBD':e(fmt(m.date,{hour:'numeric',minute:'2-digit'}))+' CT'}</p><div class="status">${m.status==='final'?`FINAL <b>${e(m.score)}</b>`:`<span class="pill">${e(m.status.toUpperCase())}</span>`}</div></article>`).join('');
 document.querySelector('#team-name').textContent=team==='boys'?'Vikings':'Lady Vikings';
 document.querySelector('#player-list').innerHTML=players.filter(p=>p.team===team).map(p=>`<article class="player-card reveal"><div class="player-photo"><span class="player-number">${String(p.position).padStart(2,'0')}</span><span class="player-placeholder" aria-hidden="true">${p.initials}</span><picture><source srcset="${e(p.image.replace(/\.jpg$/,'.webp'))}" type="image/webp"><img class="athlete-image" src="${e(p.image)}" width="${p.width??1200}" height="${p.height??(p.name==='Colby Carnagey'?1800:800)}" loading="lazy" alt="${e(p.name)} playing tennis" style="object-position:${e(p.focus)}"></picture><span class="pill">${p.captain?'TEAM CAPTAIN':'VARSITY'} · #${p.position}</span></div><div class="player-info"><div><h3>${e(p.name.toUpperCase())}</h3><p>${team==='boys'?'BOYS TENNIS':'GIRLS TENNIS'} · LINEUP #${p.position}</p></div><span>${String(p.position).padStart(2,'0')}</span></div></article>`).join('');
 document.querySelectorAll('.athlete-image').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;},{once:true}));
 const donation=typeof data.donation==='string'&&data.donation&&validLink(data.donation);
 document.querySelector('#donate-link').hidden=!donation;document.querySelector('#donate-pending').hidden=!!donation;
 if(donation){const a=document.querySelector('#donate-link');a.href=data.donation;a.target='_blank';a.rel='noopener';}
 observe();
}
let observer;
function observe(){if(!observer)return;document.querySelectorAll('.reveal:not(.visible)').forEach(el=>observer.observe(el));}
if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-motion');observer=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');observer.unobserve(x.target)}}),{threshold:.08});}
document.querySelectorAll('[data-team]').forEach(b=>b.addEventListener('click',()=>{team=b.dataset.team;render()}));
const menu=document.querySelector('#menu'),nav=document.querySelector('#nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);nav.classList.toggle('open',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',event=>{if(event.target===d){const r=d.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)d.close();}}));
const ticker=document.querySelector('.ticker');document.querySelector('#ticker-pause').addEventListener('click',event=>{const paused=ticker.classList.toggle('is-paused');event.currentTarget.setAttribute('aria-pressed',paused);event.currentTarget.textContent=paused?'Play':'Pause';event.currentTarget.setAttribute('aria-label',paused?'Play moving banner':'Pause moving banner');});

render();
