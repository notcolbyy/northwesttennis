import { seasonMatches, schedulesIdentical, allMatchesConfirmed } from './schedule.mjs';
import { calendarPlatform, SEASON_FEED } from './calendar.mjs';
import { players } from './players.mjs';
import { nextMatch, sharedMatchLabel, matchDetails, tickerMarkup, escapeHTML as e } from './model.mjs';
import {nextMarkup,rowMarkup} from './match-markup.mjs';
const KEY='northwest-tennis-2027-v2';
const PUBLIC=true;
const defaults={matches:seasonMatches};
let data=structuredClone(defaults),rosterTeam='boys',scheduleTeam='boys';

const fmt=(date,options)=>new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',...options}).format(new Date(/^\d{4}-\d{2}-\d{2}$/.test(date)?date+'T12:00:00Z':date));

function render(){
 const shared=schedulesIdentical(data.matches);
 document.querySelector('#schedule-tabs').hidden=shared;
 document.querySelector('#schedule-shared-label').hidden=!shared;
 document.querySelector('#schedule-tentative-note').hidden=allMatchesConfirmed(data.matches);
 document.querySelectorAll('[data-schedule-team]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.scheduleTeam===scheduleTeam));
 document.querySelectorAll('[data-roster-team]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.rosterTeam===rosterTeam));
 const next=nextMatch(data.matches,shared?'boys':scheduleTeam);
 document.querySelector('#next-match').innerHTML=nextMarkup(next,data.matches);
 const rows=data.matches.filter(m=>m.team===(shared?'boys':scheduleTeam)).sort((a,b)=>(a.status==='final')-(b.status==='final')||new Date(a.date)-new Date(b.date));
 document.querySelector('#match-list').innerHTML=rows.map(rowMarkup).join('');
 document.querySelector('.ticker-track').innerHTML=tickerMarkup(data.matches);
 document.querySelector('#team-name').textContent=rosterTeam==='boys'?'Vikings':'Lady Vikings';
 document.querySelector('#player-list').innerHTML=players.filter(p=>p.team===rosterTeam).map(p=>`<article class="player-card reveal"><div class="player-photo"><span class="player-number">${String(p.position).padStart(2,'0')}</span><span class="player-placeholder" aria-hidden="true">${p.initials}</span><picture><source srcset="${e(p.image.replace(/\.jpg$/,'.webp'))}" type="image/webp"><img class="athlete-image" src="${e(p.image)}" width="${p.width??1200}" height="${p.height??(p.name==='Colby Carnagey'?1800:800)}" loading="lazy" alt="${e(p.name)} playing tennis" style="object-position:${e(p.focus)}"></picture><span class="pill">${p.captain?'TEAM CAPTAIN':'VARSITY'} · #${p.position}</span></div><div class="player-info"><div><h3>${e(p.name.toUpperCase())}</h3><p>${rosterTeam==='boys'?'BOYS TENNIS':'GIRLS TENNIS'} · LINEUP #${p.position}</p></div><span>${String(p.position).padStart(2,'0')}</span></div></article>`).join('');
 const appleOnly=calendarPlatform(navigator.userAgent,navigator.userAgentData?.platform??navigator.platform??'')==='google';
 document.querySelectorAll('[data-calendar-apple]').forEach(link=>link.hidden=appleOnly);
 document.querySelectorAll('.athlete-image').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;},{once:true}));
 observe();
}
let observer;
function observe(){if(!observer)return;document.querySelectorAll('.reveal:not(.visible)').forEach(el=>observer.observe(el));}
if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-motion');observer=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');observer.unobserve(x.target)}}),{threshold:.08});}
document.querySelectorAll('[data-roster-team]').forEach(b=>b.addEventListener('click',()=>{rosterTeam=b.dataset.rosterTeam;render()}));
document.querySelectorAll('[data-schedule-team]').forEach(b=>b.addEventListener('click',()=>{scheduleTeam=b.dataset.scheduleTeam;render()}));
document.querySelector('#copy-calendar-url').addEventListener('click',async event=>{try{await navigator.clipboard.writeText(SEASON_FEED);event.currentTarget.textContent='Feed URL copied';}catch{event.currentTarget.textContent=SEASON_FEED;}});
const menu=document.querySelector('#menu'),nav=document.querySelector('#nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);nav.classList.toggle('open',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',event=>{if(event.target===d){const r=d.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)d.close();}}));
const ticker=document.querySelector('.ticker');document.querySelector('#ticker-pause').addEventListener('click',event=>{const paused=ticker.classList.toggle('is-paused');event.currentTarget.setAttribute('aria-pressed',paused);event.currentTarget.textContent=paused?'Play':'Pause';event.currentTarget.setAttribute('aria-label',paused?'Play moving banner':'Pause moving banner');});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const open=document.querySelector('.calendar-disclosure[open]');if(!open)return;open.open=false;open.querySelector('summary').focus();event.stopPropagation();});
document.addEventListener('click',event=>{for(const open of document.querySelectorAll('.calendar-disclosure[open]'))if(!open.contains(event.target)){open.open=false;open.querySelector('summary').focus();}});
document.addEventListener('toggle',event=>{const card=event.target;if(!(card instanceof HTMLDetailsElement)||!card.classList.contains('match-card')||!card.open||matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(const score of card.querySelectorAll('.score-number[data-score]')){const end=Number(score.dataset.score);if(!Number.isInteger(end))continue;score.textContent='0';const start=performance.now();function tick(now){if(!card.open)return;const fraction=Math.min(1,(now-start)/500);score.textContent=String(Math.round(end*(1-Math.pow(1-fraction,3))));if(fraction<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}},true);

render();
