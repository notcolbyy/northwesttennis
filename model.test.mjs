import test from 'node:test';
import assert from 'node:assert/strict';
import { nextMatch, validLink, validateUpdate, escapeHTML } from './model.mjs';
test('next match excludes finished and cancelled matches and respects team',()=>{
 const rows=[{team:'boys',status:'final',date:'2027-03-01T16:00:00-06:00'},{team:'girls',status:'scheduled',date:'2027-03-02T16:00:00-06:00'},{team:'boys',status:'cancelled',date:'2027-03-03T16:00:00-06:00'},{team:'boys',status:'scheduled',date:'2027-03-04T16:00:00-06:00'}];
 assert.equal(nextMatch(rows,'boys',new Date('2027-03-01')).date,rows[3].date);
 assert.equal(nextMatch([], 'girls'),null);
});
test('links permit https only and blank pending links',()=>{assert.equal(validLink(''),true);assert.equal(validLink('https://example.org/donate'),true);assert.equal(validLink('javascript:alert(1)'),false);assert.equal(validLink('http://example.org'),false)});
test('editing rejects missing opponent and malformed dates',()=>{assert.ok(validateUpdate({opponent:'',date:'',donation:''}));assert.ok(validateUpdate({opponent:'Team',date:'bad',donation:''}));assert.equal(validateUpdate({opponent:'Team',date:'2027-03-12T15:30',donation:''}),null)});
test('text is escaped before HTML rendering',()=>assert.equal(escapeHTML('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;'));
