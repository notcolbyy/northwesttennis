import test from 'node:test';
import assert from 'node:assert/strict';
import {players} from './players.mjs';
test('player lineup follows Colby’s confirmed team positions',()=>assert.deepEqual(players.map(p=>[p.name,p.team,p.position]),[['Hayden Swanson','boys',1],['Colby Carnagey','boys',2],['Anniston Heron','girls',1],['Chloe Montjoy','girls',3]]));
test('only Hayden and Anniston are captains',()=>assert.deepEqual(players.filter(p=>p.captain).map(p=>p.name),['Hayden Swanson','Anniston Heron']));
test('Anniston uses her black outfit photo and Colby keeps a higher portrait focal point',()=>{assert.equal(players.find(p=>p.name==='Anniston Heron').image,'assets/anniston-heron.jpeg');assert.equal(players.find(p=>p.name==='Colby Carnagey').focus,'50% 18%');});
