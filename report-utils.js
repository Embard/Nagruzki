const CalcNormFields = ['totalDailyLiters','hotDailyLiters','totalPeakHourLiters','hotPeakHourLiters',
  'totalDeviceLps','totalDeviceHourlyLiters','branchDeviceLps','branchDeviceHourlyLiters'];

function showFormError(message) {
  if (message) alert(message);
}

function validateFire(meta) {
  for(const [key,basis,label] of [['internalFireFlow','internalFireDescription','Внутреннее'],['autoFireFlow','autoFireBasis','Автоматическое'],['outdoorFireFlow','outdoorFireBasis','Наружное']]) {
    if(meta[key]==='') continue;
    const n=Calc.number(meta[key]);
    if(!Number.isFinite(n)||n<0) throw new Error(label+' пожаротушение: расход должен быть неотрицательным числом.');
    if(!meta[basis]) throw new Error(label+' пожаротушение: укажите основание принятого расхода, в том числе для 0 л/с.');
  }
}
function validateForExport() {
  if (!requireAppliedEdits()) return false;
  try {
    const rs=getRowsForReport();
    if(!rs.length) throw new Error('Включите хотя бы одну строку в расчёт.');
    for(const mode of [0,1,2]) calculateQuickModeTotals(rs,mode);
    const m=getReportMeta(); validateFire(m);
    return true;
  } catch(e) {alert('Отчёт не сформирован: '+e.message);return false;}
}
function footerLines(meta) {
  const lines=['Нормативная база расчёта водопотребления: СП 30.13330.2020, предоставленная редакция с изменениями 1–5.',
    `Расчётное число жителей по отмеченным жилым строкам: ${meta.residents}.`];
  if(meta.floors) lines.push('Этажность объекта: '+meta.floors+'.');
  for(const [key,basis,label] of [['internalFireFlow','internalFireDescription','Внутреннее'],['autoFireFlow','autoFireBasis','Автоматическое'],['outdoorFireFlow','outdoorFireBasis','Наружное']])
    lines.push(`${label} пожаротушение: ${meta[key]===''?'расход не задан':format(Calc.number(meta[key]))+' л/с, ручной ввод. Основание: '+meta[basis]}.`);
  lines.push([meta.engineerPosition,meta.engineerName,meta.engineerDate].filter(Boolean).join(' · '));
  return lines;
}
function replaceDocxNarrative(xmlDoc, reportRows, meta) {
  const body=xmlDoc.getElementsByTagNameNS(DOCX_W_NS,'body')[0];
  const tables=getDocxChildElements(body,'tbl').filter(t=>getDocxNodeText(t).includes('Расчет расходов'));
  const last=tables.at(-1);
  if(!last) throw new Error('В шаблоне не найдена последняя расчётная таблица.');
  let after=false;
  for(const node of Array.from(body.childNodes)) {
    if(node===last) {after=true;continue;}
    if(node.localName==='sectPr') continue;
    if(after || (node.localName==='p'&&!getDocxNodeText(node).trim())) body.removeChild(node);
  }
  const section=getDocxChildElements(body,'sectPr')[0]||null;
  for(const line of footerLines(meta)) {
    const p=xmlDoc.createElementNS(DOCX_W_NS,'w:p'),run=xmlDoc.createElementNS(DOCX_W_NS,'w:r');
    const text=xmlDoc.createElementNS(DOCX_W_NS,'w:t');
    text.textContent=line;run.appendChild(text);p.appendChild(run);body.insertBefore(p,section);
  }
  // The template uses a fixed caption; accurately identify which calculations were enabled.
  for(const text of Array.from(body.getElementsByTagNameNS(DOCX_W_NS,'t'))) {
    text.textContent=text.textContent.replace('водопотребления и водоотведения','водопотребления');
  }
}
