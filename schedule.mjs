const schools={
 Northwest:{venueName:'Northwest High School tennis courts',address:'800 Lafayette Road, Clarksville, TN 37042'},
 'West Creek':{venueName:'West Creek High School',address:'1210 West Creek Coyote Trail, Clarksville, TN 37042'},
 Kenwood:{venueName:'Kenwood High School',address:'251 East Pine Mountain Road, Clarksville, TN 37042'},
 'Dickson County':{venueName:'Dickson County High School',address:'509 Henslee Drive, Dickson, TN 37055'},
 'Henry County':{venueName:'near Henry County High School',address:'315 South Wilson Street, Paris, TN 38242'}
};
const fixtures=[['03-09','Henry County','Away'],['03-23','West Creek','Home'],['03-25','Kenwood','Home'],['03-30','West Creek','Away'],['04-01','Kenwood','Away'],['04-06','Dickson County','Home'],['04-08','Dickson County','Away'],['04-13','Henry County','Home']];
export const seasonMatches=['boys','girls'].flatMap(team=>fixtures.map(([day,opponent,venue])=>({team,opponent,venue,date:'2027-'+day,time:'16:00',timeZone:'America/Chicago',timeStatus:'tentative',locationStatus:'tentative',...(venue==='Home'?schools.Northwest:schools[opponent]),status:'scheduled'})));
export function validateFixture(match){
 if(!['boys','girls'].includes(match.team)||!['Home','Away'].includes(match.venue)||!/^2027-\d{2}-\d{2}$/.test(match.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(match.time)||match.timeZone!=='America/Chicago'||!['tentative','confirmed'].includes(match.timeStatus)||!['tentative','confirmed'].includes(match.locationStatus)||!match.venueName?.trim()||!match.address?.trim())throw new Error('Invalid fixture fields');
 return match;
}
seasonMatches.forEach(validateFixture);
