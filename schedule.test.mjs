import test from 'node:test';
import assert from 'node:assert/strict';
import {seasonMatches} from './schedule.mjs';
import {nextMatch} from './model.mjs';
test('both teams have the eight confirmed spring 2027 fixtures and no invented scores or times',()=>{for(const team of ['boys','girls']){const rows=seasonMatches.filter(m=>m.team===team);assert.equal(rows.length,8);assert.deepEqual(rows.map(m=>[m.date,m.opponent,m.venue]),[['2027-03-09','Henry County','Away'],['2027-03-23','West Creek','Home'],['2027-03-25','Kenwood','Home'],['2027-03-30','West Creek','Away'],['2027-04-01','Kenwood','Away'],['2027-04-06','Dickson County','Home'],['2027-04-08','Dickson County','Away'],['2027-04-13','Henry County','Home']]);assert.ok(rows.every(m=>m.timeTBD&&!m.score));}});
test('a time-TBD fixture remains upcoming throughout its Central calendar date',()=>assert.equal(nextMatch(seasonMatches,'boys',new Date('2027-03-10T02:00:00Z')).date,'2027-03-09'));
