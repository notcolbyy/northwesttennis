export const SITE_URL='https://notcolbyy.github.io/northwesttennis/';
const pad=n=>String(n).padStart(2,'0');
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function fixtureFile(match){return `calendar/${match.team}-${match.date}-${slug(match.opponent)}.ics`;}
export function fixtureDownload(match){return typeof document!=='undefined'&&document.documentElement.dataset.public!=='true'?'data:text/calendar;charset=utf-8,'+encodeURIComponent(calendarICS([match])):fixtureFile(match);}
export function directionsURL(match){return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(match.address);}
export function localStart(match){return match.date.replaceAll('-','')+'T'+match.time.replace(':','')+'00';}
export function startUTC(match){
 const [y,m,d]=match.date.split('-').map(Number),[h,min]=match.time.split(':').map(Number);
 const approximate=new Date(Date.UTC(y,m-1,d,18));
 const offset=new Intl.DateTimeFormat('en-US',{timeZone:match.timeZone,timeZoneName:'shortOffset'}).formatToParts(approximate).find(p=>p.type==='timeZoneName').value;
 const [,sign,hours,minutes]=/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(offset)??[];
 if(!sign)throw new Error('Unsupported time zone offset: '+offset);
 const offsetMinutes=(sign==='+'?1:-1)*(Number(hours)*60+Number(minutes??0));
 return new Date(Date.UTC(y,m-1,d,h,min)-offsetMinutes*60_000);
}
export function eventTitle(match){return `Northwest Tennis ${match.venue==='Away'?'at':'vs.'} ${match.opponent}${match.timeStatus==='tentative'||match.locationStatus==='tentative'?' (tentative)':''}`;}
export function googleCalendarURL(match){
 const query=new URLSearchParams({action:'TEMPLATE',text:eventTitle(match),dates:`${localStart(match)}/${match.date.replaceAll('-','')}T180000`,ctz:match.timeZone,details:`Time and location tentative until confirmed. Latest schedule: ${SITE_URL}#schedule`,location:`${match.venueName}, ${match.address}`});
 return 'https://calendar.google.com/calendar/render?'+query.toString();
}
const esc=s=>String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
const fold=s=>{const bytes=new TextEncoder();let lines=[''];for(const char of s){const last=lines.length-1;if(bytes.encode(lines[last]+char).length>75){const space=lines[last].endsWith(' ')?' ':'';if(space)lines[last]=lines[last].slice(0,-1);lines.push(' '+space+char);}else lines[last]+=char;}return lines.join('\r\n');};
const zone=['BEGIN:VTIMEZONE','TZID:America/Chicago','BEGIN:DAYLIGHT','DTSTART:19700308T020000','RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU','TZOFFSETFROM:-0600','TZOFFSETTO:-0500','TZNAME:CDT','END:DAYLIGHT','BEGIN:STANDARD','DTSTART:19701101T020000','RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU','TZOFFSETFROM:-0500','TZOFFSETTO:-0600','TZNAME:CST','END:STANDARD','END:VTIMEZONE'];
export function calendarICS(matches,stamp=new Date()){
 const dtstamp=stamp.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Northwest Tennis//Schedule 2027//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',...zone];
 for(const match of matches){const id=slug(`${match.team}-${match.date}-${match.opponent}`);lines.push('BEGIN:VEVENT',`UID:${id}@notcolbyy.github.io`,`DTSTAMP:${dtstamp}`,`DTSTART;TZID=America/Chicago:${localStart(match)}`,`DTEND;TZID=America/Chicago:${match.date.replaceAll('-','')}T180000`,`SUMMARY:${esc(eventTitle(match))}`,`LOCATION:${esc(`${match.venueName}, ${match.address}`)}`,`DESCRIPTION:${esc(`Time and location tentative until confirmed. Latest schedule: ${SITE_URL}#schedule`)}`,`STATUS:${match.timeStatus==='confirmed'&&match.locationStatus==='confirmed'?'CONFIRMED':'TENTATIVE'}`,'END:VEVENT');}
 lines.push('END:VCALENDAR');return lines.map(fold).join('\r\n')+'\r\n';
}
