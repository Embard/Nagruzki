'use strict';

const STORAGE_KEY = 'nagruzki-online-rows-v1';

const WaterMode = Object.freeze({ COLD: 0, HOT: 1, TOTAL: 2 });
const modeNames = {
  [WaterMode.COLD]: 'Холодная вода',
  [WaterMode.HOT]: 'Горячая вода',
  [WaterMode.TOTAL]: 'Общая вода'
};

let rows = [];
let selectedRowId = null;
let activeSummaryMode = 'all';

const els = {};

function $(id) {
  return document.getElementById(id);
}

function on(element, eventName, handler) {
  if (element) element.addEventListener(eventName, handler);
}

function init() {
  Object.assign(els, {
    consumerTypeSelect: $('consumerTypeSelect'),
    parameterSelect: $('parameterSelect'),
    consumerNameInput: $('consumerNameInput'),
    countInput: $('countInput'),
    hoursInput: $('hoursInput'),
    unitInput: $('unitInput'),
    manualDetails: $('manualDetails'),
    totalDailyInput: $('totalDailyInput'),
    hotDailyInput: $('hotDailyInput'),
    totalPeakInput: $('totalPeakInput'),
    hotPeakInput: $('hotPeakInput'),
    totalDeviceLpsInput: $('totalDeviceLpsInput'),
    totalDeviceHourlyInput: $('totalDeviceHourlyInput'),
    branchDeviceLpsInput: $('branchDeviceLpsInput'),
    branchDeviceHourlyInput: $('branchDeviceHourlyInput'),
    addButton: $('addButton'),
    applyButton: $('applyButton'),
    resetFormButton: $('resetFormButton'),
    upButton: $('upButton'),
    downButton: $('downButton'),
    duplicateButton: $('duplicateButton'),
    deleteButton: $('deleteButton'),
    clearButton: $('clearButton'),
    saveButton: $('saveButton'),
    loadButton: $('loadButton'),
    printButton: $('printButton'),
    wordButton: $('wordButton'),
    copyButton: $('copyButton'),
    helpButton: $('helpButton'),
    helpDialog: $('helpDialog'),
    summaryDetails: $('summaryDetails'),
    rowsTable: $('rowsTable'),
    selectedNormsPanel: $('selectedNormsPanel'),
    quickTotals: $('quickTotals'),
    summaryOutput: $('summaryOutput')
  });

  fillConsumerTypes();
  bindEvents();
  loadRowsFromStorage(false);
  refreshParameterOptions();
  renderAll();
}

function fillConsumerTypes() {
  els.consumerTypeSelect.innerHTML = '';
  CONSUMER_CATALOG.forEach((item, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = item.name;
    els.consumerTypeSelect.appendChild(option);
  });
}

function bindEvents() {
  on(els.consumerTypeSelect, 'change', refreshParameterOptions);
  on(els.parameterSelect, 'change', loadSelectedNormsToForm);
  on(els.addButton, 'click', addRowFromForm);
  on(els.applyButton, 'click', applyFormToSelectedRow);
  on(els.resetFormButton, 'click', resetForm);
  on(els.upButton, 'click', () => moveSelectedRow(-1));
  on(els.downButton, 'click', () => moveSelectedRow(1));
  on(els.duplicateButton, 'click', duplicateSelectedRow);
  on(els.deleteButton, 'click', deleteSelectedRow);
  on(els.clearButton, 'click', clearRows);
  on(els.saveButton, 'click', () => saveRowsToStorage(true));
  on(els.loadButton, 'click', () => loadRowsFromStorage(true));
  on(els.printButton, 'click', printReport);
  on(els.wordButton, 'click', downloadWordReport);
  on(els.copyButton, 'click', copySummary);
  const summaryActions = document.querySelector('.summary-actions');
  on(summaryActions, 'click', event => event.stopPropagation());
  on(summaryActions, 'keydown', event => event.stopPropagation());
  on(els.helpButton, 'click', () => {
    if (els.helpDialog && typeof els.helpDialog.showModal === 'function') els.helpDialog.showModal();
  });

  document.querySelectorAll('.mode-tab').forEach(button => {
    button.addEventListener('click', () => {
      activeSummaryMode = button.dataset.mode;
      document.querySelectorAll('.mode-tab').forEach(b => b.classList.toggle('active', b === button));
      updateSummary();
    });
  });

  ['input', 'change'].forEach(eventName => {
    document.querySelectorAll('input, select').forEach(input => {
      input.addEventListener(eventName, () => {
        if (input.closest('.input-card')) {
          updateManualState();
        }
      });
    });
  });
}

function refreshParameterOptions() {
  const type = getSelectedType();
  els.parameterSelect.innerHTML = '';
  type.parameterOptions.forEach((option, index) => {
    const item = document.createElement('option');
    item.value = String(index);
    item.textContent = option.name;
    els.parameterSelect.appendChild(item);
  });
  els.consumerNameInput.value = type.name;
  loadSelectedNormsToForm();
}

function getSelectedType() {
  return CONSUMER_CATALOG[toInt(els.consumerTypeSelect.value, 0)] || CONSUMER_CATALOG[0];
}

function getSelectedOption() {
  const type = getSelectedType();
  return type.parameterOptions[toInt(els.parameterSelect.value, 0)] || type.parameterOptions[0];
}

function loadSelectedNormsToForm() {
  const type = getSelectedType();
  const option = getSelectedOption();
  els.consumerNameInput.value = type.name;
  els.unitInput.value = option.unit || type.unit || '';
  els.hoursInput.value = option.defaultHours || type.defaultHours || '';
  setNormInputs(option);
  updateManualState();
}

function setNormInputs(option) {
  els.totalDailyInput.value = valueOrEmpty(option.totalDailyLiters);
  els.hotDailyInput.value = valueOrEmpty(option.hotDailyLiters);
  els.totalPeakInput.value = valueOrEmpty(option.totalPeakHourLiters);
  els.hotPeakInput.value = valueOrEmpty(option.hotPeakHourLiters);
  els.totalDeviceLpsInput.value = valueOrEmpty(option.totalDeviceLps);
  els.totalDeviceHourlyInput.value = valueOrEmpty(option.totalDeviceHourlyLiters);
  els.branchDeviceLpsInput.value = valueOrEmpty(option.branchDeviceLps);
  els.branchDeviceHourlyInput.value = valueOrEmpty(option.branchDeviceHourlyLiters);
}

function updateManualState() {
  const option = getSelectedOption();
  if (option && option.isCustom) {
    els.manualDetails.open = true;
  }
}

function readNormInputs() {
  const base = cloneOption(getSelectedOption());
  base.unit = els.unitInput.value.trim() || base.unit;
  base.defaultHours = els.hoursInput.value.trim() || base.defaultHours;
  base.totalDailyLiters = toNum(els.totalDailyInput.value);
  base.hotDailyLiters = toNum(els.hotDailyInput.value);
  base.totalPeakHourLiters = toNum(els.totalPeakInput.value);
  base.hotPeakHourLiters = toNum(els.hotPeakInput.value);
  base.totalDeviceLps = toNum(els.totalDeviceLpsInput.value);
  base.totalDeviceHourlyLiters = toNum(els.totalDeviceHourlyInput.value);
  base.branchDeviceLps = toNum(els.branchDeviceLpsInput.value);
  base.branchDeviceHourlyLiters = toNum(els.branchDeviceHourlyInput.value);
  base.isCustom = base.isCustom || els.manualDetails.open;
  return base;
}

function cloneOption(option) {
  return JSON.parse(JSON.stringify(option));
}

function addRowFromForm() {
  const row = buildRowFromForm();
  rows.push(row);
  selectedRowId = row.id;
  renderAll();
}

function buildRowFromForm() {
  const type = getSelectedType();
  const option = readNormInputs();
  return {
    id: makeId(),
    include: true,
    consumerTypeName: type.name,
    consumerName: els.consumerNameInput.value.trim() || type.name,
    parameterName: option.name || type.defaultParameter,
    parameterGroupName: option.groupName || 'Параметры',
    unit: els.unitInput.value.trim() || option.unit || type.unit || '',
    uCount: cleanNumberString(els.countInput.value),
    usageHours: cleanNumberString(els.hoursInput.value || option.defaultHours || type.defaultHours || ''),
    selectedOption: option
  };
}

function applyFormToSelectedRow() {
  if (!selectedRowId) return;
  const index = rows.findIndex(row => row.id === selectedRowId);
  if (index < 0) return;
  const patched = buildRowFromForm();
  patched.id = selectedRowId;
  patched.include = rows[index].include;
  rows[index] = patched;
  renderAll();
}

function resetForm() {
  selectedRowId = null;
  els.countInput.value = '';
  refreshParameterOptions();
  renderAll();
}

function duplicateSelectedRow() {
  const source = getSelectedRow();
  if (!source) return;
  const copy = JSON.parse(JSON.stringify(source));
  copy.id = makeId();
  rows.push(copy);
  selectedRowId = copy.id;
  renderAll();
}

function moveSelectedRow(direction) {
  const index = getSelectedRowIndex();
  if (index < 0) return;

  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= rows.length) return;

  const current = rows[index];
  rows[index] = rows[targetIndex];
  rows[targetIndex] = current;
  renderAll();
}

function deleteSelectedRow() {
  if (!selectedRowId) return;
  rows = rows.filter(row => row.id !== selectedRowId);
  selectedRowId = null;
  renderAll();
}

function clearRows() {
  if (!rows.length) return;
  if (!confirm('Очистить все строки расчета?')) return;
  rows = [];
  selectedRowId = null;
  renderAll();
}

function normalizeLoadedRows(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter(row => row && typeof row === 'object')
    .map((row, index) => normalizeRow(row, index))
    .filter(Boolean);
}

function normalizeRow(row, index) {
  const typeName = safe(row.consumerTypeName || row.typeName || row.type || row.consumerName);
  const type = CONSUMER_CATALOG.find(item => item.name === typeName) || CONSUMER_CATALOG[0];
  const storedOption = row.selectedOption && typeof row.selectedOption === 'object' ? row.selectedOption : null;
  const optionName = storedOption?.name || row.parameterName || row.parameter || type.parameterOptions?.[0]?.name || '';
  const option = storedOption || type.parameterOptions.find(item => item.name === optionName) || type.parameterOptions[0] || {};

  return {
    id: row.id || makeId(),
    include: row.include !== false,
    number: index + 1,
    consumerTypeName: row.consumerTypeName || type.name || '',
    consumerName: row.consumerName || row.name || type.name || '',
    parameterName: row.parameterName || option.name || type.defaultParameter || '',
    parameterGroupName: row.parameterGroupName || option.groupName || 'Параметры',
    unit: row.unit || option.unit || type.unit || '',
    uCount: cleanNumberString(row.uCount ?? row.count ?? row.u ?? ''),
    usageHours: cleanNumberString(row.usageHours ?? row.hours ?? option.defaultHours ?? type.defaultHours ?? ''),
    selectedOption: {
      ...cloneOption(option),
      unit: row.unit || option.unit || type.unit || '',
      defaultHours: row.usageHours || option.defaultHours || type.defaultHours || ''
    }
  };
}

function getSelectedRow() {
  return rows.find(row => row.id === selectedRowId) || null;
}

function getSelectedRowIndex() {
  return rows.findIndex(row => row.id === selectedRowId);
}

function renderAll() {
  renumberRows();
  renderRowsTable();
  renderSelectedNormsPanel();
  updateButtonsState();
  updateSummary();
}

function renumberRows() {
  rows.forEach((row, index) => row.number = index + 1);
}

function renderRowsTable() {
  const tbody = els.rowsTable.querySelector('tbody');
  tbody.innerHTML = '';

  rows.forEach(row => {
    const tr = document.createElement('tr');
    tr.classList.toggle('selected', row.id === selectedRowId);
    tr.innerHTML = `
      <td class="center"><input type="checkbox" ${row.include ? 'checked' : ''} aria-label="Включить строку в расчет" title="Включить строку в расчет и отчет" /></td>
      <td class="num">${row.number}</td>
      <td>${escapeHtml(row.consumerName)}<div class="small-muted">${escapeHtml(row.consumerTypeName || '')}</div></td>
      <td>${escapeHtml(row.parameterName || '')}</td>
      <td class="num">${escapeHtml(row.uCount || '')}</td>
      <td class="num">${escapeHtml(row.usageHours || '')}</td>
      <td>${escapeHtml(row.unit || '')}</td>
    `;
    tr.addEventListener('click', event => {
      if (event.target instanceof HTMLInputElement && event.target.type === 'checkbox') return;
      selectRow(row.id);
    });
    const checkbox = tr.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      row.include = checkbox.checked;
      renderSelectedNormsPanel();
      updateSummary();
    });
    tbody.appendChild(tr);
  });
}

function selectRow(rowId) {
  selectedRowId = rowId;
  const row = getSelectedRow();
  if (row) loadRowToForm(row);
  renderAll();
}

function loadRowToForm(row) {
  const typeIndex = Math.max(0, CONSUMER_CATALOG.findIndex(item => item.name === row.consumerTypeName));
  els.consumerTypeSelect.value = String(typeIndex);
  refreshParameterOptions();

  const type = getSelectedType();
  const paramIndex = Math.max(0, type.parameterOptions.findIndex(item => item.name === row.parameterName));
  els.parameterSelect.value = String(paramIndex);

  els.consumerNameInput.value = row.consumerName || '';
  els.countInput.value = row.uCount || '';
  els.hoursInput.value = row.usageHours || '';
  els.unitInput.value = row.unit || '';
  setNormInputs(row.selectedOption || getSelectedOption());
  els.manualDetails.open = Boolean(row.selectedOption && row.selectedOption.isCustom);
}

function updateButtonsState() {
  const selectedIndex = getSelectedRowIndex();
  const hasSelection = selectedIndex >= 0;
  if (els.applyButton) els.applyButton.disabled = !hasSelection;
  if (els.deleteButton) els.deleteButton.disabled = !hasSelection;
  if (els.duplicateButton) els.duplicateButton.disabled = !hasSelection;
  if (els.upButton) els.upButton.disabled = !hasSelection || selectedIndex === 0;
  if (els.downButton) els.downButton.disabled = !hasSelection || selectedIndex === rows.length - 1;
}


function renderSelectedNormsPanel() {
  if (!els.selectedNormsPanel) return;
  const row = getSelectedRow();
  if (!row) {
    els.selectedNormsPanel.classList.add('empty');
    els.selectedNormsPanel.innerHTML = 'Выбери строку в таблице, чтобы посмотреть ее нормативы.';
    return;
  }

  els.selectedNormsPanel.classList.remove('empty');
  const modes = [
    [WaterMode.COLD, 'Холодная'],
    [WaterMode.HOT, 'Горячая'],
    [WaterMode.TOTAL, 'Общая']
  ];
  const cards = modes.map(([mode, title]) => {
    const norms = getNorms(row.selectedOption || {}, mode);
    return `<div class="norm-card">
      <h3>${title}</h3>
      <div class="norm-line"><span>q<sub>u,m</sub>, л/сут</span><strong>${format(norms.dailyLiters)}</strong></div>
      <div class="norm-line"><span>q<sub>hr,u</sub>, л/ч</span><strong>${format(norms.peakHourLiters)}</strong></div>
      <div class="norm-line"><span>q<sub>0</sub>, л/с</span><strong>${format(norms.deviceLps)}</strong></div>
      <div class="norm-line"><span>q<sub>0hr</sub>, л/ч</span><strong>${format(norms.deviceHourlyLiters)}</strong></div>
    </div>`;
  }).join('');

  els.selectedNormsPanel.innerHTML = `<div class="panel-title">Нормативы выбранной строки: ${escapeHtml(row.consumerName || '-')}</div><div class="norms-grid">${cards}</div>`;
}

function updateQuickTotals(reportRows) {
  if (!els.quickTotals) return;
  if (!reportRows.length) {
    els.quickTotals.classList.add('empty');
    els.quickTotals.innerHTML = 'Быстрые итоги появятся после добавления строк и включения их в расчет.';
    return;
  }

  els.quickTotals.classList.remove('empty');
  const modes = [
    [WaterMode.COLD, 'ХВ'],
    [WaterMode.HOT, 'ГВ'],
    [WaterMode.TOTAL, 'Общая']
  ];
  const cards = modes.map(([mode, title]) => {
    const data = calculateQuickModeTotals(reportRows, mode);
    return `<div class="quick-card">
      <h3>${title}</h3>
      <div class="quick-line"><span>Q<sub>сут</sub></span><strong>${format(data.totalQDay)} м³/сут</strong></div>
      <div class="quick-line"><span>Q<sub>ср.ч</sub></span><strong>${format(data.totalQT)} м³/ч</strong></div>
      <div class="quick-line"><span>q</span><strong>${format(data.q)} л/с</strong></div>
      <div class="quick-line"><span>q<sub>hr</sub></span><strong>${format(data.qhr)} м³/ч</strong></div>
    </div>`;
  }).join('');

  els.quickTotals.innerHTML = `<div class="quick-title">Быстрые итоги по отмеченным строкам</div><div class="quick-grid">${cards}</div><div class="quick-note">Полив и другие отдельные строки входят в Q<sub>сут</sub> и Q<sub>ср.ч</sub>, но не участвуют в NP / α / q / q<sub>hr</sub>.</div>`;
}

function calculateQuickModeTotals(reportRows, mode) {
  const allLines = reportRows.map(row => createReportLine(row, mode));
  const householdLines = allLines.filter(line => !line.isSpecial);
  const specialLines = allLines.filter(line => line.isSpecial);
  const householdTotals = calculateReportTotals(householdLines);
  return {
    totalQDay: householdTotals.totalQDay + sumBy(specialLines, line => line.qDay),
    totalQT: householdTotals.totalQT + sumBy(specialLines, line => line.qT),
    q: householdTotals.q,
    qhr: householdTotals.qhr
  };
}

function getRowsForReport() {
  return rows.filter(row => row.include);
}

function updateSummary() {
  const reportRows = getRowsForReport();
  els.summaryOutput.textContent = buildSummaryText(reportRows, activeSummaryMode);
  updateQuickTotals(reportRows);
}

function buildSummaryText(reportRows, modeFilter = 'all') {
  const lines = [];
  lines.push('Свод расчетных данных');
  lines.push('='.repeat(61));
  lines.push('Область отчета: отмеченные строки');
  lines.push('');

  if (!reportRows.length) {
    lines.push('Список водопотребителей пуст или строки не включены в отчет.');
    return lines.join('\n');
  }

  const modes = modeFilter === 'all'
    ? [WaterMode.COLD, WaterMode.HOT, WaterMode.TOTAL]
    : [modeFilter === 'cold' ? WaterMode.COLD : modeFilter === 'hot' ? WaterMode.HOT : WaterMode.TOTAL];

  modes.forEach(mode => appendModeSummary(lines, reportRows, mode));
  return lines.join('\n');
}

function appendModeSummary(lines, reportRows, mode) {
  lines.push(modeNames[mode]);
  lines.push('-'.repeat(45));

  const allLines = reportRows.map(row => createReportLine(row, mode));
  const householdLines = allLines.filter(line => !line.isSpecial);
  const specialLines = allLines.filter(line => line.isSpecial);

  allLines.forEach((line, index) => {
    lines.push(`${index + 1}. ${safe(line.name)}${line.isSpecial ? ' — отдельная строка, не входит в NP/α/q' : ''}`);
    lines.push(`   U/F = ${format(line.u)}`);
    lines.push(`   q_u,m = ${format(line.qum)} л/сут; q_hr,u = ${format(line.qhru)} л/ч`);
    lines.push(`   q0hr = ${format(line.q0hr)} л/ч; q0 = ${format(line.q0)} л/с`);
    lines.push(`   Qсут = ${format(line.qDay)} м³/сут`);
    lines.push(`   q_hr,u·U = ${format(line.qPeakLh)} л/ч`);
    lines.push(`   qT = ${format(line.qT)} м³/ч`);
    lines.push(`   NP = ${format(line.np)}; NPhr = ${format(line.nphr)}`);
    lines.push('');
  });

  const householdTotals = calculateReportTotals(householdLines);
  const specialQDay = sumBy(specialLines, line => line.qDay);
  const specialQT = sumBy(specialLines, line => line.qT);

  lines.push('ИТОГО - хозяйственно-питьевые нужды:');
  lines.push(`Qсут = ${format(householdTotals.totalQDay)} м³/сут`);
  lines.push(`Qч,пик = ${format(householdTotals.totalPeakLh)} л/ч`);
  lines.push(`Qч,ср = ${format(householdTotals.totalQT)} м³/ч`);
  lines.push(`ΣNP = ${format(householdTotals.totalNp)}`);
  lines.push(`ΣNPhr = ${format(householdTotals.totalNphr)}`);
  lines.push(`q0экв = ${format(householdTotals.q0Eq)} л/с`);
  lines.push(`q0hr,экв = ${format(householdTotals.q0hrEq)} л/ч`);
  lines.push(`α = ${format(householdTotals.alpha)}; αhr = ${format(householdTotals.alphaHr)}`);
  lines.push(`q = ${format(householdTotals.q)} л/с; qhr = ${format(householdTotals.qhr)} м³/ч`);
  lines.push('');

  if (specialLines.length) {
    lines.push('ИТОГО с отдельными строками типа полива:');
    lines.push(`Qсут = ${format(householdTotals.totalQDay + specialQDay)} м³/сут`);
    lines.push(`Qч,ср = ${format(householdTotals.totalQT + specialQT)} м³/ч`);
    lines.push(`q = ${format(householdTotals.q)} л/с; qhr = ${format(householdTotals.qhr)} м³/ч`);
    lines.push('');
  }
}

function getNorms(option, mode) {
  option = option || {};
  const totalDaily = toNum(option.totalDailyLiters);
  const hotDaily = toNum(option.hotDailyLiters);
  const totalPeak = toNum(option.totalPeakHourLiters);
  const hotPeak = toNum(option.hotPeakHourLiters);
  const totalDeviceLps = toNum(option.totalDeviceLps);
  const totalDeviceHourly = toNum(option.totalDeviceHourlyLiters);
  const branchDeviceLps = toNum(option.branchDeviceLps);
  const branchDeviceHourly = toNum(option.branchDeviceHourlyLiters);

  if (mode === WaterMode.TOTAL) {
    return {
      dailyLiters: totalDaily,
      peakHourLiters: totalPeak,
      deviceLps: totalDeviceLps,
      deviceHourlyLiters: totalDeviceHourly
    };
  }

  if (mode === WaterMode.HOT) {
    const hasHot = hotDaily > 0 || hotPeak > 0;
    return {
      dailyLiters: hotDaily,
      peakHourLiters: hotPeak,
      deviceLps: hasHot ? branchDeviceLps : 0,
      deviceHourlyLiters: hasHot ? branchDeviceHourly : 0
    };
  }

  const coldDaily = Math.max(0, totalDaily - hotDaily);
  const coldPeak = Math.max(0, totalPeak - hotPeak);
  const coldDeviceLps = branchDeviceLps > 0 ? branchDeviceLps : totalDeviceLps;
  const coldDeviceHourly = branchDeviceHourly > 0 ? branchDeviceHourly : totalDeviceHourly;
  const hasCold = coldDaily > 0 || coldPeak > 0;
  return {
    dailyLiters: coldDaily,
    peakHourLiters: coldPeak,
    deviceLps: hasCold ? coldDeviceLps : 0,
    deviceHourlyLiters: hasCold ? coldDeviceHourly : 0
  };
}

function lookupAlpha(x) {
  const value = toNum(x);
  if (value < 0.015) return 0.2;
  const points = ALPHA_POINTS;
  for (const [px, py] of points) {
    if (Math.abs(value - px) < 1e-7) return py;
  }
  for (let i = 1; i < points.length; i += 1) {
    const left = points[i - 1];
    const right = points[i];
    if (value <= right[0]) {
      const t = (value - left[0]) / (right[0] - left[0]);
      return left[1] + (right[1] - left[1]) * t;
    }
  }
  return points[points.length - 1][1];
}

function isAreaBasedRow(row) {
  const dimension = (row.unit || '').toLowerCase();
  const name = (row.consumerName || '').toLowerCase();
  return dimension.includes('м²') || dimension.includes('м2') || name.includes('полив') || name.includes('катка');
}

function getUCountValue(row) {
  return toNum(row.uCount);
}

function getUsageHoursValue(row) {
  return toNum(row.usageHours);
}

function printReport() {
  const reportRows = getRowsForReport();
  const html = buildReportDocumentHtml(reportRows, false);

  // Печать через временный iframe безопаснее, чем window.open/document.write:
  // после закрытия окна печати основная страница не теряет обработчики кнопок.
  document.querySelectorAll('iframe[data-print-frame="nagruzki"]').forEach(frame => frame.remove());

  const frame = document.createElement('iframe');
  frame.dataset.printFrame = 'nagruzki';
  frame.setAttribute('aria-hidden', 'true');
  frame.style.position = 'fixed';
  frame.style.right = '0';
  frame.style.bottom = '0';
  frame.style.width = '0';
  frame.style.height = '0';
  frame.style.border = '0';
  frame.style.opacity = '0';
  frame.style.pointerEvents = 'none';

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    setTimeout(() => {
      if (frame.parentNode) frame.parentNode.removeChild(frame);
    }, 300);
  };

  document.body.appendChild(frame);

  const printWindow = frame.contentWindow;
  const printDocument = frame.contentDocument || printWindow?.document;
  if (!printWindow || !printDocument) {
    cleanup();
    alert('Не удалось открыть область печати. Обнови страницу и попробуй еще раз.');
    return;
  }

  printWindow.addEventListener('afterprint', cleanup);
  printWindow.onafterprint = cleanup;

  printDocument.open();
  printDocument.write(html);
  printDocument.close();

  setTimeout(() => {
    try {
      printWindow.focus();
      printWindow.print();
      // Резервная очистка для браузеров, где afterprint не срабатывает при отмене печати.
      setTimeout(cleanup, 15000);
    } catch (error) {
      cleanup();
      console.error(error);
      alert('Не удалось открыть печать. Попробуй скачать отчет Word.');
    }
  }, 150);
}

function downloadWordReport() {
  const reportRows = getRowsForReport();
  const html = buildReportDocumentHtml(reportRows, true);
  const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
  downloadBlob(blob, `Расчет_водопотребления_${timestamp()}.doc`);
}

function buildReportDocumentHtml(reportRows, forWord) {
  const generatedAt = new Date().toLocaleString('ru-RU', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
  const bodyClass = forWord ? 'WordSection1' : 'print-section';
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Отчет по расчету водопотребления</title>
  <style>${buildReportStyles()}</style>
  </head><body><div class="${bodyClass}">
    <h1>Отчет по расчету водопотребления</h1>
    <p class="meta">Дата формирования: ${escapeHtml(generatedAt)}</p>
    <p class="meta">Нормативная база: СП 30.13330.2020, таблица А.2.</p>
    ${buildMainReportTable(reportRows)}
  </div></body></html>`;
}

function buildReportStyles() {
  return `
  @page WordSection1 { size: 841.9pt 595.3pt; mso-page-orientation: landscape; margin: 0.5cm 0.5cm 0.5cm 0.5cm; }
  @page { size: A4 landscape; margin: 10mm; }
  div.WordSection1 { page: WordSection1; }
  body { font-family: "Times New Roman", serif; font-size: 8pt; color: #111; background: white; }
  h1 { font-size: 14pt; text-align: center; margin: 0 0 8pt; }
  .meta { margin: 0 0 4pt; font-size: 9pt; }
  table.report-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  .report-table th, .report-table td { border: 1px solid #000; padding: 2.5pt 3pt; vertical-align: middle; line-height: 1.12; word-wrap: break-word; overflow-wrap: anywhere; }
  .report-table th { font-weight: bold; text-align: center; background: #d9d9d9; }
  .report-table td { text-align: center; }
  .report-table td.left { text-align: left; }
  .report-table .section-row th { background: #d9d9d9; font-size: 9pt; padding: 4pt 3pt; }
  .report-table .total-label { font-weight: bold; text-align: center; }
  .report-table .number-row td { font-weight: bold; background: #f2f2f2; }
  .nowrap { white-space: nowrap; }
  @media print { body { margin: 0; } }
  `;
}

function buildMainReportTable(reportRows) {
  const colWidths = [18, 5, 6, 6, 6, 5, 7, 7, 6, 5.5, 5.5, 4.5, 4.5, 6.5, 7.5];
  const colgroup = colWidths.map(width => `<col style="width:${width}%">`).join('');
  const sections = [
    [WaterMode.COLD, 'Расчет расходов холодной воды'],
    [WaterMode.HOT, 'Расчет расходов горячей воды'],
    [WaterMode.TOTAL, 'Расчет расходов воды общий']
  ].map(([mode, title]) => buildReportSection(reportRows, mode, title)).join('');

  return `<table class="report-table">
    <colgroup>${colgroup}</colgroup>
    <thead>${buildReportTableHeader()}</thead>
    <tbody>${sections}</tbody>
  </table>`;
}

function buildReportTableHeader() {
  const nums = Array.from({ length: 15 }, (_, index) => `<td>${index + 1}</td>`).join('');
  return `
    <tr>
      <th rowspan="3">Наименование<br>водопотребителей</th>
      <th rowspan="3">коли-<br>чество<br>U</th>
      <th colspan="2">нормы рас-<br>хода воды</th>
      <th colspan="2">расход воды<br>прибором</th>
      <th colspan="3">расход воды<br>водопотребителями</th>
      <th rowspan="3">NP<br>q<sub>hr,u</sub> · U<br>q<sub>0</sub> · 3600</th>
      <th rowspan="3">NPhr<br>q<sub>hr,u</sub> · U<br>q<sub>0,hr</sub></th>
      <th rowspan="3">α</th>
      <th rowspan="3">αhr</th>
      <th rowspan="3">макси-<br>мальный<br>расчетный<br>расход<br>5 · q<sub>0</sub> · α<br>q<sub>c</sub>, q<sub>h</sub><br>л/с</th>
      <th rowspan="3">макси-<br>мальный<br>часовой<br>расход<br>0.005 · q<sub>0,hr</sub> · αhr<br>q<sub>chr</sub>, q<sub>hhr</sub><br>м³/ч</th>
    </tr>
    <tr>
      <th>сутки</th>
      <th>час</th>
      <th>час</th>
      <th>сек</th>
      <th>сутки</th>
      <th>час</th>
      <th>ср.час</th>
    </tr>
    <tr>
      <th>qᶜ<sub>u</sub><br>qʰ<sub>u</sub><br>л/сут</th>
      <th>qᶜ<sub>hr,u</sub><br>qʰ<sub>hr,u</sub><br>л/ч</th>
      <th>qᶜ<sub>0,hr</sub><br>qʰ<sub>0,hr</sub><br>л/ч</th>
      <th>qᶜ<sub>0</sub><br>qʰ<sub>0</sub><br>л/с</th>
      <th>q · U<br>1000<br>м³/сут</th>
      <th>q<sub>hr,u</sub> · U<br>л/ч</th>
      <th>q<sub>T</sub><br>м³/ч</th>
    </tr>
    <tr class="number-row">${nums}</tr>`;
}

function buildReportSection(reportRows, mode, title) {
  const allLines = reportRows.map(row => createReportLine(row, mode));
  const householdLines = allLines.filter(line => !line.isSpecial);
  const specialLines = allLines.filter(line => line.isSpecial);
  const sectionRows = [];
  sectionRows.push(`<tr class="section-row"><th colspan="15">${escapeHtml(title)}</th></tr>`);

  if (!allLines.length) {
    sectionRows.push(`<tr><td colspan="15" class="left">Нет данных</td></tr>`);
    return sectionRows.join('');
  }

  householdLines.forEach(line => sectionRows.push(buildReportDataRow(line, false)));

  const householdTotals = calculateReportTotals(householdLines);
  sectionRows.push(`<tr>
    <td colspan="13" class="left"></td>
    <td>q<sub>0</sub>=${format(householdTotals.q0Eq)}</td>
    <td>q<sub>0,hr</sub>=${format(householdTotals.q0hrEq)}</td>
  </tr>`);

  sectionRows.push(`<tr>
    <td colspan="6" class="total-label">Итог - хозяйственно-питьевые нужды:</td>
    <td>${format(householdTotals.totalQDay)}</td>
    <td>${format(householdTotals.totalPeakLh)}</td>
    <td>${format(householdTotals.totalQT)}</td>
    <td>${format(householdTotals.totalNp)}</td>
    <td>${format(householdTotals.totalNphr)}</td>
    <td>${format(householdTotals.alpha)}</td>
    <td>${format(householdTotals.alphaHr)}</td>
    <td>${format(householdTotals.q)}</td>
    <td>${format(householdTotals.qhr)}</td>
  </tr>`);

  specialLines.forEach(line => sectionRows.push(buildReportDataRow(line, true)));

  const specialQDay = sumBy(specialLines, line => line.qDay);
  const specialQT = sumBy(specialLines, line => line.qT);
  sectionRows.push(`<tr>
    <td colspan="6" class="total-label">Итог:</td>
    <td>${format(householdTotals.totalQDay + specialQDay)}</td>
    <td>-</td>
    <td>${format(householdTotals.totalQT + specialQT)}</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>${format(householdTotals.q)}</td>
    <td>${format(householdTotals.qhr)}</td>
  </tr>`);

  return sectionRows.join('');
}

function buildReportDataRow(line, specialMode) {
  const dash = '-';
  const specialValue = value => specialMode && Math.abs(value) < 1e-7 ? dash : format(value);
  const qhru = specialValue(line.qhru);
  const q0hr = specialValue(line.q0hr);
  const q0 = specialValue(line.q0);
  const qPeak = specialValue(line.qPeakLh);
  const np = specialMode ? dash : format(line.np);
  const nphr = specialMode ? dash : format(line.nphr);

  return `<tr>
    <td class="left">${escapeHtml(line.name)}</td>
    <td>${format(line.u)}</td>
    <td>${specialValue(line.qum)}</td>
    <td>${qhru}</td>
    <td>${q0hr}</td>
    <td>${q0}</td>
    <td>${specialValue(line.qDay)}</td>
    <td>${qPeak}</td>
    <td>${specialValue(line.qT)}</td>
    <td>${np}</td>
    <td>${nphr}</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>`;
}

function createReportLine(row, mode) {
  const norms = getNorms(row.selectedOption, mode);
  const u = getUCountValue(row);
  const t = getUsageHoursValue(row);
  const special = isAreaBasedRow(row);
  const qDay = norms.dailyLiters * u / 1000;
  const qPeakLh = norms.peakHourLiters * u;
  const qT = special
    ? (mode === WaterMode.COLD && qDay > 0 ? qDay / 24 : 0)
    : (t > 0 ? qDay / t : 0);
  const np = norms.deviceLps > 0 ? qPeakLh / (norms.deviceLps * 3600) : 0;
  const nphr = norms.deviceHourlyLiters > 0 ? qPeakLh / norms.deviceHourlyLiters : 0;

  return {
    name: row.consumerName || row.consumerTypeName || '-',
    isSpecial: special,
    u,
    qum: norms.dailyLiters,
    qhru: special ? 0 : norms.peakHourLiters,
    q0hr: special ? 0 : norms.deviceHourlyLiters,
    q0: special ? 0 : norms.deviceLps,
    qDay,
    qPeakLh: special ? 0 : qPeakLh,
    qT,
    np: special ? 0 : np,
    nphr: special ? 0 : nphr
  };
}

function calculateReportTotals(lines) {
  const totalQDay = sumBy(lines, line => line.qDay);
  const totalPeakLh = sumBy(lines, line => line.qPeakLh);
  const totalQT = sumBy(lines, line => line.qT);
  const totalNp = sumBy(lines, line => line.np);
  const totalNphr = sumBy(lines, line => line.nphr);
  const q0EqRaw = totalNp > 0 ? totalPeakLh / (3600 * totalNp) : 0;
  const q0hrEqRaw = totalNphr > 0 ? totalPeakLh / totalNphr : 0;
  const q0Eq = roundTo(q0EqRaw, 2);
  const q0hrEq = roundTo(q0hrEqRaw, 2);
  const alpha = lookupAlpha(totalNp);
  const alphaHr = lookupAlpha(totalNphr);
  const q = 5 * q0Eq * alpha;
  const qhr = 0.005 * q0hrEq * alphaHr;

  return { totalQDay, totalPeakLh, totalQT, totalNp, totalNphr, q0Eq, q0hrEq, alpha, alphaHr, q, qhr };
}

function sumBy(items, selector) {
  return items.reduce((sum, item) => sum + toNum(selector(item)), 0);
}

function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round((toNum(value) + Number.EPSILON) * factor) / factor;
}

async function copySummary() {
  try {
    await navigator.clipboard.writeText(els.summaryOutput.textContent || '');
    toast('Свод скопирован.');
  } catch {
    alert('Не удалось скопировать текст.');
  }
}

function saveRowsToStorage(showMessage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  if (showMessage) toast('Расчет сохранен в браузере.');
}

function loadRowsFromStorage(showMessage) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    if (showMessage) toast('Сохраненных строк нет.');
    return;
  }
  try {
    const loaded = JSON.parse(raw);
    rows = normalizeLoadedRows(loaded);
    selectedRowId = rows[0]?.id || null;
    renderAll();
    if (showMessage) toast(rows.length ? 'Расчет восстановлен.' : 'Сохраненных строк нет.');
  } catch (error) {
    rows = [];
    selectedRowId = null;
    localStorage.removeItem(STORAGE_KEY);
    renderAll();
    if (showMessage) alert('Не удалось прочитать сохраненный расчет. Сохранение сброшено.');
    console.error(error);
  }
}

function clearAutoSave() {
  localStorage.removeItem(STORAGE_KEY);
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function toast(message) {
  const node = document.createElement('div');
  node.textContent = message;
  node.style.position = 'fixed';
  node.style.right = '18px';
  node.style.bottom = '18px';
  node.style.background = '#0b6f8f';
  node.style.color = 'white';
  node.style.padding = '10px 14px';
  node.style.borderRadius = '10px';
  node.style.boxShadow = '0 8px 24px rgba(0,0,0,.18)';
  node.style.zIndex = '9999';
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 1800);
}

function timestamp() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function makeId() {
  return `row_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function toNum(value) {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = Number(String(value).replace(',', '.').trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function cleanNumberString(value) {
  const text = String(value || '').replace(',', '.').trim();
  if (text === '') return '';
  const number = Number(text);
  return Number.isFinite(number) ? format(number) : '';
}

function format(value) {
  const number = toNum(value);
  if (Math.abs(number) < 1e-7) return '0';
  return number.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
    useGrouping: false
  });
}

function valueOrEmpty(value) {
  return Math.abs(toNum(value)) < 1e-7 ? '0' : String(value);
}

function safe(value) {
  const text = String(value ?? '').trim();
  return text || '-';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

window.addEventListener('beforeunload', () => {
  if (rows.length) saveRowsToStorage(false);
  else clearAutoSave();
});

document.addEventListener('DOMContentLoaded', init);
