export function initScrollEffects(){
 const header=document.querySelector('header');
 const hero=document.querySelector('.hero');
 const photo=document.querySelector('.hero-photo');
 const ticker=document.querySelector('.ticker');
 const footer=document.querySelector('footer');
 const top=document.querySelector('#back-to-top');
 const links=[...document.querySelectorAll('#nav a[href^="#"]')];
 const sections=links.map(link=>({link,element:document.querySelector(link.getAttribute('href')),top:0})).filter(x=>x.element);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let heroBottom=0,documentHeight=0,viewportHeight=0,scheduled=false,heroVisible=true,footerVisible=false;
 function measure(){
  heroBottom=hero.getBoundingClientRect().bottom+scrollY;
  documentHeight=document.documentElement.scrollHeight;
  viewportHeight=innerHeight;
  for(const item of sections)item.top=item.element.getBoundingClientRect().top+scrollY;
  queue();
 }
 function update(){
  scheduled=false;
  const y=scrollY;
  const active=!reduced.matches;
  header.classList.toggle('is-compact',active&&y>80);
  header.style.setProperty('--scroll-progress',active?String(Math.min(1,y/Math.max(1,documentHeight-viewportHeight))):'0');
  top.classList.toggle('is-visible',y>heroBottom&&!footerVisible);
  let current=null;
  for(const item of sections)if(y+Math.min(180,viewportHeight*.32)>=item.top)current=item;
  for(const item of sections){if(active&&item===current)item.link.setAttribute('aria-current','location');else item.link.removeAttribute('aria-current');}
  const limit=innerWidth<=700?20:40;
  photo.style.setProperty('--hero-parallax',active&&heroVisible?`${-Math.min(limit,Math.max(0,y)*.11)}px`:'0px');
 }
 function queue(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
 top.addEventListener('click',()=>scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
 addEventListener('scroll',queue,{passive:true});
 addEventListener('resize',measure,{passive:true});
 addEventListener('northwest:layout',measure);
 reduced.addEventListener('change',()=>{measure();ticker.classList.toggle('is-offscreen',reduced.matches)});
 if('IntersectionObserver'in window){
  new IntersectionObserver(([entry])=>{heroVisible=entry.isIntersecting;queue()}).observe(hero);
  new IntersectionObserver(([entry])=>ticker.classList.toggle('is-offscreen',!entry.isIntersecting||reduced.matches)).observe(ticker);
  new IntersectionObserver(([entry])=>{footerVisible=entry.isIntersecting;queue()}).observe(footer);
 }
 measure();
 return {refresh:measure};
}
