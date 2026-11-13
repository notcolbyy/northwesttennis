export const defaultLineupLimits=Object.freeze({singles:6,doubles:3});
export function validateMatchResult(match){
 if(!['scheduled','final','postponed','canceled','cancelled','rescheduled'].includes(match.status))throw new Error('Invalid match status');
 if(match.rescheduledDate&&!/^\d{4}-\d{2}-\d{2}$/.test(match.rescheduledDate))throw new Error('Invalid new date');
 if(match.statusReason!==undefined&&(typeof match.statusReason!=='string'||match.statusReason.length>240))throw new Error('Invalid status reason');
 const r=match.result;if(r===undefined)return match;
 if(!r||typeof r!=='object'||Array.isArray(r)||typeof r.approved!=='boolean')throw new Error('Invalid result approval');
 const limits=r.lineupLimits??defaultLineupLimits;
 if(!Number.isInteger(limits.singles)||!Number.isInteger(limits.doubles)||limits.singles<0||limits.doubles<0||limits.singles+limits.doubles<1||limits.singles+limits.doubles>20)throw new Error('Invalid lineup limits');
 if(!Number.isInteger(r.teamScore)||!Number.isInteger(r.opponentScore)||r.teamScore<0||r.opponentScore<0||r.teamScore>20||r.opponentScore>20)throw new Error('Invalid team score');
 if(!Array.isArray(r.lines)||r.lines.length>limits.singles+limits.doubles)throw new Error('Invalid result lines');
 const seen=new Set();for(const line of r.lines){const max=limits[line?.type];if(!max||!Number.isInteger(line.number)||line.number<1||line.number>max||typeof line.setScores!=='string'||!/^\d{1,2}[-–]\d{1,2}(?:,\s*\d{1,2}[-–]\d{1,2}){1,2}$/.test(line.setScores)||!['W','L'].includes(line.outcome))throw new Error('Invalid individual result');const key=line.type+line.number;if(seen.has(key))throw new Error('Duplicate lineup position');seen.add(key)}
 if(r.recap!==undefined&&(typeof r.recap!=='string'||r.recap.length>3000))throw new Error('Invalid recap');
 if(r.photo!==undefined&&(!r.photo||typeof r.photo.src!=='string'||!/^assets\/[a-z0-9][a-z0-9._-]*\.(?:jpe?g|png|webp)$/i.test(r.photo.src)||typeof r.photo.alt!=='string'||!r.photo.alt.trim()||!Number.isInteger(r.photo.width)||!Number.isInteger(r.photo.height)||r.photo.width<1||r.photo.height<1))throw new Error('Invalid photo');
 if(r.quote!==undefined&&(!r.quote||typeof r.quote.text!=='string'||!r.quote.text.trim()||typeof r.quote.attribution!=='string'||!r.quote.attribution.trim()))throw new Error('Invalid quote');
 if(r.lastUpdated!==undefined&&(typeof r.lastUpdated!=='string'||!Number.isFinite(Date.parse(r.lastUpdated))))throw new Error('Invalid update time');return match;
}
export function approvedResult(match){return match.status==='final'&&match.result?.approved===true?match.result:null;}
export function resultCounts(result){return result.lines.reduce((n,line)=>(n[line.outcome==='W'?'wins':'losses']++,n),{wins:0,losses:0});}
