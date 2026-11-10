const fixtures=[
 ['03-09','Henry County','Away'],
 ['03-23','West Creek','Home'],
 ['03-25','Kenwood','Home'],
 ['03-30','West Creek','Away'],
 ['04-01','Kenwood','Away'],
 ['04-06','Dickson County','Home'],
 ['04-08','Dickson County','Away'],
 ['04-13','Henry County','Home']
];
export const seasonMatches=['boys','girls'].flatMap(team=>fixtures.map(([day,opponent,venue])=>({team,opponent,venue,date:'2027-'+day,location:'Court location TBD',status:'scheduled',timeTBD:true})));
