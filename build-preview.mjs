import fs from 'node:fs';
let html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('style.css','utf8');
const model=fs.readFileSync('model.mjs','utf8').replaceAll('export function','function');
const schedule=fs.readFileSync('schedule.mjs','utf8').replace('export const','const');
const players=fs.readFileSync('players.mjs','utf8').replace('export const','const');
const app=fs.readFileSync('app.mjs','utf8').split('\n').filter(line=>!line.startsWith('import ')).join('\n');
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+css+'</style>').replace('<script type="module" src="app.mjs"></script>',()=>'<script type="module">'+model+'\nconst e=escapeHTML;\n'+players+'\n'+schedule+'\n'+app+'</script>');
for(const filename of fs.existsSync('assets')?fs.readdirSync('assets'):[]){if(!/\.(jpe?g|png)$/i.test(filename))continue;const mime=/png$/i.test(filename)?'image/png':'image/jpeg';html=html.replaceAll('assets/'+filename,'data:'+mime+';base64,'+fs.readFileSync('assets/'+filename).toString('base64'));}
fs.writeFileSync('Northwest-Tennis-Preview.html',html);
console.log('Preview built. Available assets:',fs.existsSync('assets')?fs.readdirSync('assets'):[]);
