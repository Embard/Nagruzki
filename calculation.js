/* Pure calculations: no DOM, storage or display rounding. */
const Calc = (() => {
  const normKeys = ['totalDailyLiters','hotDailyLiters','totalPeakHourLiters','hotPeakHourLiters',
    'totalDeviceLps','totalDeviceHourlyLiters','branchDeviceLps','branchDeviceHourlyLiters'];
  const normLabels = ['общая суточная норма','суточная норма ГВС','общая часовая норма','часовая норма ГВС',
    'общий секундный расход прибором','общий часовой расход прибором','секундный расход прибором ветви','часовой расход прибором ветви'];
  const number = value => value === '' || value == null ? NaN : Number(String(value).trim().replace(',', '.'));
  const canonical = value => Number.isFinite(number(value)) ? String(number(value)) : '';
  const fail = message => { throw new Error(message); };
  const positive = (value, label) => {
    const n = number(value);
    if (!Number.isFinite(n) || n <= 0) fail(`${label}: укажите число больше нуля.`);
    return n;
  };
  const nonnegative = (value, label) => {
    const n = number(value);
    if (!Number.isFinite(n) || n < 0) fail(`${label}: укажите число не меньше нуля.`);
    return n;
  };
  function catalogOption(row, catalog = CONSUMER_CATALOG) {
    const id = row.catalogId || row.selectedOption?.catalogId;
    return catalog.flatMap(t => t.parameterOptions).find(o => id && o.catalogId === id)
      || catalog.find(t => t.name === row.consumerTypeName)?.parameterOptions.find(o => o.name === row.parameterName);
  }
  const kind = row => catalogOption(row)?.calculationKind || row.selectedOption?.calculationKind || 'standard';
  const catering = row => (row.catalogId || catalogOption(row)?.catalogId || '').startsWith('a2-15-');
  function migrate(row) {
    const current = catalogOption(row);
    const old = catalogOption(row, LEGACY_CATALOG);
    const saved = row.selectedOption;
    const changed = !row.schemaVersion && saved && old && normKeys.some(k => number(saved[k]) !== number(old[k]));
    const result = {...row, schemaVersion: 3};
    if (current) {
      result.catalogId = current.catalogId;
      result.selectedOption = row.schemaVersion >= 2 || changed ? {...current,...saved} : {...current};
      result.selectedOption.calculationKind = current.calculationKind;
      result.selectedOption.isCustom = Boolean(current.isCustom || changed || (row.schemaVersion >= 2 && saved?.isCustom));
      if (!row.schemaVersion && current.catalogId === 'a2-22-0' && number(row.usageHours) === 8) result.usageHours = '6';
      if (!row.schemaVersion && current.calculationKind === 'pool') {
        // The previous input was described as percent, not volume. Never reinterpret it silently.
        result.uCount = '';
        result.unit = current.unit;
        result.migrationNote = 'Пополнение бассейна: заново введите вместимость в м³; старое поле имело другую размерность.';
      }
    }
    // Version 2 used a separate irrigation count. Restore the original T / n field.
    if (row.schemaVersion === 2 && kind(result) === 'irrigation') {
      result.usageHours = canonical(row.irrigationCycles);
    }
    if (row.schemaVersion === 2 && kind(result) === 'ice') result.usageHours = current?.defaultHours || '1';
    ['uCount','usageHours','cateringPsi'].forEach(k => { result[k] = canonical(result[k]); });
    for (const key of ['fixtureCount','coldFixtureCount','hotFixtureCount','irrigationCycles','peakCount',
      'directTotalQ','directHotQ','directTotalQhr','directHotQhr','directBasis','sewerIncluded']) delete result[key];
    if (result.selectedOption) {
      delete result.selectedOption.requiresFixtureCount;
      delete result.selectedOption.requiresPeakCount;
    }
    return result;
  }
  function norms(row, mode) {
    const o = row.selectedOption || {};
    const total = mode === 2, hot = mode === 1;
    const daily = total ? number(o.totalDailyLiters) : hot ? number(o.hotDailyLiters) : number(o.totalDailyLiters)-number(o.hotDailyLiters);
    const peak = total ? number(o.totalPeakHourLiters) : hot ? number(o.hotPeakHourLiters) : number(o.totalPeakHourLiters)-number(o.hotPeakHourLiters);
    const active = daily > 0 || peak > 0;
    return {dailyLiters:daily, peakHourLiters:peak,
      deviceLps: active ? number(o[total ? 'totalDeviceLps' : 'branchDeviceLps']) : 0,
      deviceHourlyLiters: active ? number(o[total ? 'totalDeviceHourlyLiters' : 'branchDeviceHourlyLiters']) : 0};
  }
  function validate(row) {
    const u = positive(row.uCount, 'Количество U / площадь / объём');
    const k = kind(row);
    const t = positive(row.usageHours, k === 'irrigation' ? 'Число поливок в сутки' : 'T, часов в сутки');
    if (k === 'irrigation') {
      if (!Number.isInteger(t)) fail('Число поливок должно быть целым.');
    } else if (t > 24) fail('T не может превышать 24 часа в сутки.');
    const o = row.selectedOption || {};
    normKeys.forEach((key,i) => nonnegative(o[key], normLabels[i]));
    if (number(o.hotDailyLiters)>number(o.totalDailyLiters) || number(o.hotPeakHourLiters)>number(o.totalPeakHourLiters)) fail('Норма ГВС не может превышать общую норму.');
    if (number(o.totalDailyLiters)<=0) fail('Общая суточная норма должна быть больше нуля.');
    if (catering(row) && ![0.45,0.55,1].includes(positive(row.cateringPsi, 'ψ'))) fail('Выберите ψ = 0,45; 0,55 или 1.');
    if (k === 'standard') {
      for (const mode of [0,1,2]) {
        const v = norms(row,mode);
        if ((v.dailyLiters>0 || v.peakHourLiters>0) && !(v.peakHourLiters>0 && v.deviceLps>0 && v.deviceHourlyLiters>0)) {
          fail('Не заданы часовая норма или расходы прибором. Заполните ручные нормативы строки.');
        }
      }
    } else if (k === 'showers' && !Number.isInteger(u)) fail('Число душевых сеток должно быть целым.');
    return true;
  }
  const hourlyU = row => catering(row) ? number(row.uCount)/(number(row.usageHours)*number(row.cateringPsi)) : number(row.uCount);
  const daily = (row,mode) => norms(row,mode).dailyLiters*number(row.uCount)/1000*(kind(row)==='irrigation'?number(row.usageHours):1);
  function bracket(axis, value, label) {
    if (!Number.isFinite(value) || value < axis[0] || value > axis.at(-1)) fail(`${label}: значение ${value} вне таблицы (${axis[0]}…${axis.at(-1)}); экстраполяция не выполняется.`);
    const i=axis.findIndex(x=>x>=value);
    return axis[i]===value ? [i,i,0] : [i-1,i,(value-axis[i-1])/(axis[i]-axis[i-1])];
  }
  function alpha(np) {
    if (!Number.isFinite(np) || np < 0) fail('NP должно быть неотрицательным числом.');
    if (np===0) return {value:0};
    if (np<0.015) return {value:0.2};
    const [a,b,t]=bracket(ALPHA_POINTS.map(r=>r[0]),np,'Б.2, NP');
    return {value:ALPHA_POINTS[a][1]+t*(ALPHA_POINTS[b][1]-ALPHA_POINTS[a][1])};
  }
  function line(row,mode) {
    validate(row);
    const v=norms(row,mode), k=kind(row), special=k!=='standard';
    const u=number(row.uCount), t=number(row.usageHours), uh=hourlyU(row);
    const peak=v.peakHourLiters*uh, qDay=daily(row,mode);
    // Preserve the original irrigation/ice daily-only rule; normal rows use their own T.
    const area = k==='irrigation' || k==='ice';
    const qT = area ? (mode===0 ? qDay/24 : 0) : qDay/t;
    const directQ=k==='showers'?(mode===2?0.2:0.14)*u:0;
    const directQhr=k==='showers'?v.peakHourLiters*u/1000:0;
    return {name:row.consumerName||row.consumerTypeName,isSpecial:special,isCatering:catering(row),
      u,uDay:u,uHour:uh,t,cateringPsi:catering(row)?number(row.cateringPsi):0,
      qum:v.dailyLiters,qhru:special?0:v.peakHourLiters,q0hr:special?0:v.deviceHourlyLiters,q0:special?0:v.deviceLps,
      qDay,qT,qPeakLh:special?0:peak,np:!special&&peak?peak/(v.deviceLps*3600):0,
      nphr:!special&&peak?peak/v.deviceHourlyLiters:0,directQ,directQhr,kind:k};
  }
  const sum=(ls,key)=>ls.reduce((s,l)=>s+l[key],0);
  function totals(lines) {
    const regular=lines.filter(l=>!l.isSpecial);
    const totalQDay=sum(lines,'qDay'), totalPeakLh=sum(regular,'qPeakLh');
    const totalNp=sum(regular,'np'),totalNphr=sum(regular,'nphr');
    const q0Eq=totalNp?totalPeakLh/(3600*totalNp):0;
    const q0hrEq=totalNphr?totalPeakLh/totalNphr:0;
    const a=alpha(totalNp),h=alpha(totalNphr);
    return {totalQDay,totalQT:sum(lines,'qT'),totalPeakLh,totalNp,totalNphr,q0Eq,q0hrEq,
      alpha:a.value,alphaHr:h.value,q:5*q0Eq*a.value+sum(lines,'directQ'),
      qhr:0.005*q0hrEq*h.value+sum(lines,'directQhr')};
  }
  return {number,canonical,catalogOption,kind,catering,migrate,validate,norms,hourlyU,daily,alpha,line,totals};
})();
