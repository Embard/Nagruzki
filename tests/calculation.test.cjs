const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const ctx=vm.createContext({console,window:{addEventListener(){}},document:{addEventListener(){},getElementById(){return null;}}});
vm.runInContext(['data.js','calculation.js','app.js','report-utils.js'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n'),ctx);
const run=s=>vm.runInContext(s,ctx);
run(`function fixture(ti,oi,u,t,extra={}) {
  const type=CONSUMER_CATALOG[ti],o=JSON.parse(JSON.stringify(type.parameterOptions[oi]));
  return {id:'test',schemaVersion:3,catalogId:o.catalogId,include:true,consumerName:type.name,
    consumerTypeName:type.name,parameterName:o.name,unit:o.unit,uCount:String(u),usageHours:String(t??o.defaultHours),
    selectedOption:o,cateringPsi:'0.55',...extra};
}
function total(row,mode=2) {return Calc.totals([Calc.line(row,mode)]);}
`);
let count=0;
function check(name,test) {test();count++;console.log('OK',name);}
function close(a,b){assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);}
check('decimal storage never uses display rounding or commas',()=>{
  assert.equal(run(`cleanNumberString('1030,50001')`),'1030.50001');
  assert.equal(run(`cleanNumberString('0,55')`),'0.55');
  assert.equal(run(`cleanNumberString(0)`),'0');
});
check('catering day/hour and fractional edit round trip',()=>{
  const r=run(`(()=>{const r=fixture(15,0,1030.5,10.5,{fixtureCount:'200'});const m=normalizeRow(JSON.parse(JSON.stringify(r)),0);return {u:m.uCount,t:m.usageHours,psi:m.cateringPsi,line:Calc.line(m,2)};})()`);
  assert.equal(r.u,'1030.5');assert.equal(r.t,'10.5');assert.equal(r.psi,'0.55');
  close(r.line.qDay,12.366);close(r.line.uHour,1030.5/(10.5*.55));
});
check('legacy comma values are migrated without loss',()=>{
  const r=run(`normalizeRow({...fixture(15,0,1030,10),schemaVersion:undefined,uCount:'1030,5',usageHours:'10,5',cateringPsi:'0,55'},0)`);
  assert.equal(r.uCount,'1030.5');assert.equal(r.usageHours,'10.5');assert.equal(r.cateringPsi,'0.55');
});
check('grocery square metre annotation is a standard consumer',()=>{
  const r=run(`Calc.line(fixture(16,0,10),2)`);assert.equal(r.isSpecial,false);close(r.qDay,2.5);assert.ok(run(`total(fixture(16,0,10)).q`)>0);
});
check('report name and unit do not choose calculation method',()=>{
  close(run(`total(fixture(16,0,10)).q`),run(`total(fixture(16,0,10,8,{consumerName:'полив катка',unit:'м²'})).q`));
});
run(`const irrigation=fixture(26,0,1000,2,{irrigationCycles:'2',directTotalQ:'1',directHotQ:'0',directTotalQhr:'2',directHotQhr:'0',directBasis:'Тест: шланг и график',sewerIncluded:false});`);
check('two irrigations use the original T/n field, no manual peaks',()=>{
  const r=run('total(irrigation)');close(r.totalQDay,6);close(r.q,0);close(r.qhr,0);
  close(run('total(irrigation,0).totalQDay'),6);close(run('total(irrigation,1).totalQDay'),0);
});
check('pool replenishment is 10% of volume in cubic metres',()=>{
  const r=run(`total(fixture(22,2,100,8,{directTotalQ:'.5',directHotQ:'0',directTotalQhr:'1.25',directHotQhr:'0',directBasis:'Технологическое задание',sewerIncluded:false}))`);
  close(r.totalQDay,10);close(r.totalQT,10/8);
});
check('pool spectators use corrected A.2 values',()=>{
  const r=run('fixture(22,0,100)');assert.equal(r.usageHours,'6');close(r.selectedOption.branchDeviceLps,.1);close(r.selectedOption.branchDeviceHourlyLiters,40);
});
check('legacy default norms update; manual overrides survive',()=>{
  const a=run(`normalizeRow({...fixture(22,0,100),schemaVersion:undefined,usageHours:'8',selectedOption:LEGACY_CATALOG[22].parameterOptions[0]},0)`);
  close(a.selectedOption.branchDeviceLps,.1);assert.equal(a.usageHours,'6');
  const b=run(`normalizeRow({...fixture(22,0,100),schemaVersion:undefined,selectedOption:{...LEGACY_CATALOG[22].parameterOptions[0],hotDailyLiters:2}},0)`);
  close(b.selectedOption.hotDailyLiters,2);assert.equal(b.selectedOption.isCustom,true);
});
check('old pool inputs cannot silently change units',()=>assert.equal(run(`normalizeRow({...fixture(22,2,100),schemaVersion:undefined},0).uCount`),''));
check('legacy irrigation frequency remains meaningful',()=>{
  const r=run(`normalizeRow({...fixture(26,0,1000,2),schemaVersion:undefined},0)`);
  assert.equal(r.usageHours,'2');assert.equal('irrigationCycles' in r,false);
});
check('industrial showers use 10 simultaneous heads',()=>{
  const r=run('total(fixture(24,0,10))');close(r.q,2);close(r.qhr,5);close(r.totalQDay,5);
  close(run('total(fixture(24,0,10),1).q'),1.4);
});
check('missing technological norms stop laundry calculation',()=>assert.throws(()=>run(`total(fixture(8,0,100,8,{fixtureCount:'20'}))`),/ручные нормативы/));
check('invalid counts, time and water balance are rejected',()=>{
  assert.throws(()=>run('total(fixture(1,5,-100))'),/больше нуля/);
  assert.throws(()=>run('total(fixture(15,0,1030,0))'),/больше нуля/);
  assert.throws(()=>run('total(fixture(1,5,100,25))'),/24/);
  assert.throws(()=>run(`(()=>{const r=fixture(1,5,100);r.selectedOption.hotDailyLiters=999;return total(r);})()`),/ГВС/);
});
check('equivalent device flow keeps full precision',()=>{
  const r=run(`Calc.totals([Calc.line(fixture(1,5,100),2),Calc.line(fixture(9,0,100),2)])`);
  close(r.q0Eq,(1160+400)/(1160/.3+400/.14));close(r.q,5*r.q0Eq*r.alpha);
  assert.notEqual(r.q0Eq,Math.round(r.q0Eq*100)/100);
});
check('fire values migrate from old auto rules to empty and remain manual',()=>{
  assert.equal(run(`normalizeReportMeta({autoFireFlow:'30'}).autoFireFlow`),'');
  assert.equal(run(`normalizeReportMeta({schemaVersion:'2',autoFireFlow:'12.5',autoFireBasis:'Расчёт'}).autoFireFlow`),'12.5');
  assert.doesNotThrow(()=>run(`validateFire({...DEFAULT_REPORT_META,autoFireFlow:'30'})`));
});

check('optional fire inputs allow export and distinguish blank, zero and supplied basis',()=>{
  assert.doesNotThrow(()=>run(`validateFire({...DEFAULT_REPORT_META})`));
  assert.doesNotThrow(()=>run(`validateFire({...DEFAULT_REPORT_META,internalFireFlow:'5.2',outdoorFireFlow:'24'})`));
  assert.doesNotThrow(()=>run(`validateFire({...DEFAULT_REPORT_META,autoFireFlow:'0'})`));
  for(const key of ['internalFireFlow','autoFireFlow','outdoorFireFlow']) {
    assert.throws(()=>run(`validateFire({...DEFAULT_REPORT_META,${key}:'-1'})`),/неотрицательным/);
    assert.throws(()=>run(`validateFire({...DEFAULT_REPORT_META,${key}:'abc'})`),/числом/);
  }
  const lines=run(`footerLines({...DEFAULT_REPORT_META,internalFireFlow:'5.2',autoFireFlow:'0',outdoorFireBasis:'По заданию'})`);
  assert.ok(lines.includes('Внутреннее пожаротушение: 5,2 л/с, ручной ввод.'));
  assert.ok(lines.includes('Автоматическое пожаротушение: 0 л/с, ручной ввод.'));
  assert.ok(lines.includes('Наружное пожаротушение: расход не задан. Основание: По заданию.'));
});

check('formatted template report is the default and table-only export remains explicit',()=>{
  assert.equal(run('getSelectedReportVariant()'),'formatted');
  run(`els.reportVariantSelect={value:'draft'}`);
  assert.equal(run('getSelectedReportVariant()'),'draft');
  run(`els.reportVariantSelect.value='formatted'`);
  assert.equal(run('getSelectedReportVariant()'),'formatted');
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.match(html,/<option value="formatted" selected>/);
});

check('mean flows use each row T and are summed',()=>{
  const r=run(`Calc.totals([Calc.line(fixture(15,0,1000,10),2),Calc.line(fixture(16,0,10,8),2)])`);
  close(r.totalQDay,14.5);close(r.totalQT,12/10+2.5/8);
  assert.notEqual(r.totalQT,r.totalQDay/24);
});
check('expanded irrigation saves restore n and discard additional fields',()=>{
  const m=run(`normalizeRow(fixture(26,0,1000,4,{schemaVersion:2,irrigationCycles:'2',directTotalQ:'9',directBasis:'old'}),0)`);
  assert.equal(m.usageHours,'2');assert.equal(m.schemaVersion,3);
  assert.equal('irrigationCycles' in m,false);assert.equal('directTotalQ' in m,false);
});
check('removed inputs never affect totals and are discarded on load',()=>{
  const base=run('total(fixture(15,0,1030.5,10.5))');
  const edited=run(`total(fixture(15,0,1030.5,10.5,{fixtureCount:'7',coldFixtureCount:'2',hotFixtureCount:'1',peakCount:'999',directTotalQ:'999',directTotalQhr:'999',sewerIncluded:true}))`);
  assert.equal(JSON.stringify(base),JSON.stringify(edited));
  const m=run(`normalizeRow(fixture(15,0,1030.5,10.5,{schemaVersion:2,fixtureCount:'7',coldFixtureCount:'2',hotFixtureCount:'1',peakCount:'999',directTotalQ:'999',sewerIncluded:true}),0)`);
  for(const k of ['fixtureCount','coldFixtureCount','hotFixtureCount','peakCount','directTotalQ','sewerIncluded']) assert.equal(k in m,false);
  assert.equal(run(`'sewerEnabled' in normalizeReportMeta({schemaVersion:'2',sewerEnabled:'true'})`),false);
});
check('B.2 interpolation, all tabulated values and bounds',()=>{
  close(run('Calc.alpha(.0155).value'),.2035);
  assert.equal(run('ALPHA_POINTS.length'),581);
  assert.equal(run(`ALPHA_POINTS.every(([x,y])=>Math.abs(Calc.alpha(x).value-y)<1e-9)`),true);
  assert.throws(()=>run('Calc.alpha(4000)'),/вне таблицы/);
  assert.throws(()=>run('Calc.alpha(-1)'),/неотрицательным/);
});
check('report and HTML contain no removed controls or added notes',()=>{
  const draft=run(`buildDraftReportContent([fixture(15,0,1000,10)],'12.10.2026')`);
  const formatted=run(`buildFormattedReportContent([fixture(15,0,1000,10)],DEFAULT_REPORT_META)`);
  for(const content of [draft,formatted,fs.readFileSync(path.join(root,'index.html'),'utf8')]) {
    for(const bad of ['sewer','directTotal','fixtureCount','peakCount','irrigationCycles','за 24 ч','Расчётные условия','Максимумы по оборудованию']) assert.ok(!content.includes(bad),bad);
  }
  assert.ok(draft.includes('<td>1,2</td>'));
  assert.ok(formatted.includes('пожаротушение'));
});

console.log(`Passed ${count} regression groups.`);
