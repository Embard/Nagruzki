// Regression: a count edit must never import stale browser-restored selectors
// or hidden norms into another catalog consumer. No external DOM dependency.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const fields = {};
const field = id => fields[id] ||= {id, value: '', hidden: false, textContent: '', setAttribute(){}};
const ctx = vm.createContext({console, window: {addEventListener(){}}, document: {
  addEventListener(){}, getElementById: field
}});
vm.runInContext(['data.js','calculation.js','app.js','report-utils.js'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n'),ctx);
const run = s => vm.runInContext(s,ctx);
run(`
function seedEditor(ti=1, pi=5) {
  const type=CONSUMER_CATALOG[ti], option=type.parameterOptions[pi];
  const values={consumerTypeSelect:String(ti),parameterSelect:String(pi),consumerNameInput:type.name,
    countInput:'4',hoursInput:'24',cateringPsiInput:'0.55',unitInput:option.unit,
    totalDailyInput:String(option.totalDailyLiters),hotDailyInput:String(option.hotDailyLiters),
    totalPeakInput:String(option.totalPeakHourLiters),hotPeakInput:String(option.hotPeakHourLiters),
    totalDeviceLpsInput:String(option.totalDeviceLps),totalDeviceHourlyInput:String(option.totalDeviceHourlyLiters),
    branchDeviceLpsInput:String(option.branchDeviceLps),branchDeviceHourlyInput:String(option.branchDeviceHourlyLiters)};
  for(const [id,value] of Object.entries(values)) {els[id]=$(id);els[id].value=value;}
  els.rowEditor={querySelectorAll:()=>Object.keys(values).map(id=>els[id])};
  els.addButton=$('addButton');els.applyButton=$('applyButton');els.manualDetails=$('manualDetails');
  markEditorClean();
}
function edit(id,value) {els[id].value=value;recordEditorInput({target:els[id]});}
`);
let count=0;
function check(name,test){test();console.log('OK',name);count++;}
check('count-only edit preserves catalog type, parameter and all eight norms despite stale DOM values',()=>{
  run(`seedEditor();els.consumerTypeSelect.value='0';els.parameterSelect.value='1';els.totalDailyInput.value='4';els.totalPeakInput.value='0.3';edit('countInput','180');`);
  const row=run('buildRowFromForm()');
  assert.equal(row.consumerTypeName,'Жилые дома квартирного типа');
  assert.equal(row.parameterName,'с ваннами длиной от 1500 мм, оборудованными душами');
  assert.equal(row.uCount,'180');
  const expected=run('CONSUMER_CATALOG[1].parameterOptions[5]');
  for(const key of run('CalcNormFields')) assert.equal(row.selectedOption[key],expected[key],key);
  assert.equal(run("els.consumerTypeSelect.value"),'1');
  assert.equal(run("els.parameterSelect.value"),'5');
  assert.ok(Math.abs(run('Calc.line(buildRowFromForm(),2).qDay')-32.4)<1e-9);
});
check('restored hidden values do not dirty a clean editor',()=>{
  run(`seedEditor();els.hotDailyInput.value='999';`);
  assert.equal(run('hasEditorChanges()'),false);
  assert.equal(run('buildRowFromForm().selectedOption.hotDailyLiters'),70);
});
check('explicit manual norm edits are preserved and invalid hot-water balance is rejected',()=>{
  run(`seedEditor();edit('hotDailyInput','250');`);
  assert.equal(run('hasEditorChanges()'),true);
  assert.throws(()=>run('buildRowFromForm()'),/Суточная.*250.*180/);
  run(`seedEditor();edit('hotPeakInput','15');`);
  assert.throws(()=>run('buildRowFromForm()'),/Часовая.*15.*11.6/);
  run(`seedEditor();edit('hotDailyInput','75');`);
  assert.equal(run('buildRowFromForm().selectedOption.hotDailyLiters'),75);
  assert.equal(run('buildRowFromForm().selectedOption.isCustom'),true);
});
check('fractional catering draft keeps day/hour inputs through a render restore',()=>{
  run(`seedEditor(15,0);edit('countInput','1030.50001');edit('hoursInput','10.5');els.countInput.value='1030';restoreEditorValues();`);
  assert.equal(run('buildRowFromForm().uCount'),'1030.50001');
  assert.ok(Math.abs(run('Calc.hourlyU(buildRowFromForm())')-1030.50001/(10.5*.55))<1e-9);
});
check('cancel/reload establishes a clean baseline instead of retaining the previous manual draft',()=>{
  run(`seedEditor();edit('hotDailyInput','250');seedEditor();`);
  assert.equal(run('hasEditorChanges()'),false);
  assert.equal(run('buildRowFromForm().selectedOption.hotDailyLiters'),70);
});
console.log(`Passed ${count} editor regression groups.`);
