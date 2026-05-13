'use strict';

const AUTO_DRAFT_KEY = 'nagruzki-online-rows-v1';
const SAVED_CALCULATIONS_KEY = 'nagruzki-online-saved-calculations-v1';
const REPORT_META_KEY = 'nagruzki-online-report-meta-v1';
const EFFECT_LOGO_BASE64 = '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';
const EFFECT_LOGO_DATA_URI = `data:image/png;base64,${EFFECT_LOGO_BASE64}`;

const WaterMode = Object.freeze({ COLD: 0, HOT: 1, TOTAL: 2 });
const modeNames = {
  [WaterMode.COLD]: 'Холодная вода',
  [WaterMode.HOT]: 'Горячая вода',
  [WaterMode.TOTAL]: 'Общая вода'
};

let rows = [];
let selectedRowId = null;
let activeSummaryMode = 'all';
let selectedSavedCalculationId = null;

const DEFAULT_REPORT_META = Object.freeze({
  objectName: 'Наименование',
  residents: '',
  floors: '15',
  internalFireRule: 'autoResidential',
  longCorridor: 'true',
  internalFireFlow: '5,2',
  internalFireDescription: '2 струи по 2,6 л/с',
  autoFireFlow: '30',
  outdoorFireClass: 'f13f14',
  buildingVolume: '',
  outdoorFireFlow: '30',
  engineerPosition: 'Инженер ВК',
  engineerDate: formatRuDate(new Date()),
  engineerName: 'И.И. Иванов'
});

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
    saveDialog: $('saveDialog'),
    loadDialog: $('loadDialog'),
    calculationNameInput: $('calculationNameInput'),
    saveNamedCalculationButton: $('saveNamedCalculationButton'),
    savedCalculationsList: $('savedCalculationsList'),
    loadSelectedCalculationButton: $('loadSelectedCalculationButton'),
    deleteSavedCalculationButton: $('deleteSavedCalculationButton'),
    reportVariantSelect: $('reportVariantSelect'),
    objectNameInput: $('objectNameInput'),
    residentsInput: $('residentsInput'),
    floorsInput: $('floorsInput'),
    internalFireRuleSelect: $('internalFireRuleSelect'),
    longCorridorInput: $('longCorridorInput'),
    internalFireFlowInput: $('internalFireFlowInput'),
    internalFireDescriptionInput: $('internalFireDescriptionInput'),
    autoFireFlowInput: $('autoFireFlowInput'),
    outdoorFireClassSelect: $('outdoorFireClassSelect'),
    buildingVolumeInput: $('buildingVolumeInput'),
    outdoorFireFlowInput: $('outdoorFireFlowInput'),
    engineerPositionInput: $('engineerPositionInput'),
    engineerDateInput: $('engineerDateInput'),
    engineerNameInput: $('engineerNameInput'),
    summaryDetails: $('summaryDetails'),
    rowsTable: $('rowsTable'),
    selectedNormsPanel: $('selectedNormsPanel'),
    quickTotals: $('quickTotals'),
    summaryOutput: $('summaryOutput')
  });

  fillConsumerTypes();
  bindEvents();
  loadReportMetaFromStorage();
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
  on(els.saveButton, 'click', openSaveCalculationDialog);
  on(els.loadButton, 'click', openLoadCalculationDialog);
  on(els.saveNamedCalculationButton, 'click', saveNamedCalculationFromDialog);
  on(els.loadSelectedCalculationButton, 'click', loadSelectedSavedCalculation);
  on(els.deleteSavedCalculationButton, 'click', deleteSelectedSavedCalculation);
  on(els.printButton, 'click', printReport);
  on(els.wordButton, 'click', downloadWordReport);
  on(els.copyButton, 'click', copySummary);
  const summaryActions = document.querySelector('.summary-actions');
  on(summaryActions, 'click', event => event.stopPropagation());
  on(summaryActions, 'keydown', event => event.stopPropagation());

  document.querySelectorAll('.report-settings-card input, .report-settings-card select').forEach(input => {
    const updateReportData = () => {
      updateDerivedReportFields();
      updateSummary();
      saveReportMetaToStorage(false);
    };
    input.addEventListener('input', updateReportData);
    input.addEventListener('change', updateReportData);
  });
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
  updateDerivedReportFields();
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

async function printReport() {
  const reportRows = getRowsForReport();
  const variant = getSelectedReportVariant();

  if (variant === 'formatted') {
    await downloadFormattedDocxReport(reportRows, { showPrintNotice: true });
    return;
  }

  const html = buildReportDocumentHtml(reportRows, false, variant);

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

async function downloadWordReport() {
  const reportRows = getRowsForReport();
  const variant = getSelectedReportVariant();

  if (variant === 'formatted') {
    await downloadFormattedDocxReport(reportRows);
    return;
  }

  const html = buildReportDocumentHtml(reportRows, true, variant);
  const wordContent = ['\ufeff', html].join('');
  const blob = new Blob([wordContent], { type: 'application/msword;charset=utf-8' });
  downloadBlob(blob, `Черновой_расчет_водопотребления_${timestamp()}.doc`);
}

async function downloadFormattedDocxReport(reportRows, options = {}) {
  try {
    if (!window.JSZip) {
      alert('Не удалось загрузить модуль формирования DOCX. Проверь подключение к интернету и обнови страницу.');
      return;
    }

    const response = await fetch('templates/formatted-report-template.docx', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Template fetch failed: ${response.status}`);

    const templateBuffer = await response.arrayBuffer();
    const zip = await JSZip.loadAsync(templateBuffer);
    const documentFile = zip.file('word/document.xml');
    if (!documentFile) throw new Error('В шаблоне не найден word/document.xml');

    const xmlText = await documentFile.async('string');
    const serialized = fillFormattedDocxTemplateXml(xmlText, reportRows);
    zip.file('word/document.xml', serialized);

    const blob = await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    downloadBlob(blob, `Оформленный_отчет_водопотребления_${timestamp()}.docx`);

    if (options.showPrintNotice) {
      alert('Оформленный отчет сформирован из Word-шаблона и скачан. Для печати открой скачанный DOCX в Word и печатай оттуда — так шапка шаблона не пересобирается сайтом.');
    }
  } catch (error) {
    console.error(error);
    alert('Не удалось сформировать оформленный DOCX из шаблона. Проверь, что файл templates/formatted-report-template.docx загружен в репозиторий рядом с сайтом.');
  }
}

function fillFormattedDocxTemplate(xmlDoc, reportRows) {
  const meta = getReportMeta();
  const values = {
    '{objectName}': safe(meta.objectName || 'Наименование'),
    '{residents}': safe(meta.residents || calculateResidentsForReport()),
    '{floors}': safe(meta.floors || ''),
    '{internalFireFlow}': safe(meta.internalFireFlow || ''),
    '{internalFireDescription}': safe(meta.internalFireDescription || ''),
    '{autoFireFlow}': safe(meta.autoFireFlow || '30'),
    '{outdoorFireFlow}': safe(meta.outdoorFireFlow || ''),
    '{engineerPosition}': safe(meta.engineerPosition || ''),
    '{engineerDate}': safe(meta.engineerDate || ''),
    '{engineerName}': safe(meta.engineerName || '')
  };

  replaceTextTokensInDocument(xmlDoc, values);
  fillFormattedDocxTables(xmlDoc, reportRows);
}

function fillFormattedDocxTemplateXml(xmlText, reportRows) {
  const meta = getReportMeta();
  let xml = xmlText;
  const values = {
    '{objectName}': safe(meta.objectName || 'Наименование'),
    '{residents}': safe(meta.residents || calculateResidentsForReport()),
    '{floors}': safe(meta.floors || ''),
    '{internalFireFlow}': safe(meta.internalFireFlow || ''),
    '{internalFireDescription}': safe(meta.internalFireDescription || ''),
    '{autoFireFlow}': safe(meta.autoFireFlow || '30'),
    '{outdoorFireFlow}': safe(meta.outdoorFireFlow || ''),
    '{engineerPosition}': safe(meta.engineerPosition || ''),
    '{engineerDate}': safe(meta.engineerDate || ''),
    '{engineerName}': safe(meta.engineerName || '')
  };

  Object.entries(values).forEach(([token, value]) => {
    xml = replaceAllLiteral(xml, token, escapeXmlText(value));
  });

  xml = replaceFormattedDocxTablesInXml(xml, reportRows);
  return xml;
}

function replaceFormattedDocxTablesInXml(xml, reportRows) {
  return xml.replace(/<w:tbl[\s\S]*?<\/w:tbl>/g, tableXml => {
    if (tableXml.includes('Расчет расходов холодной воды')) {
      return fillFormattedDocxReportTableXml(tableXml, reportRows, WaterMode.COLD);
    }
    if (tableXml.includes('Расчет расходов горячей воды')) {
      return fillFormattedDocxReportTableXml(tableXml, reportRows, WaterMode.HOT);
    }
    if (tableXml.includes('Расчет расходов воды общий')) {
      return fillFormattedDocxReportTableXml(tableXml, reportRows, WaterMode.TOTAL);
    }
    return tableXml;
  });
}

function fillFormattedDocxReportTableXml(tableXml, reportRows, mode) {
  const allLines = reportRows.map(row => createReportLine(row, mode));
  const householdLines = allLines.filter(line => !line.isSpecial);
  const specialLines = allLines.filter(line => line.isSpecial);
  const householdTotals = calculateReportTotals(householdLines);
  const specialQDay = sumBy(specialLines, line => line.qDay);
  const specialQT = sumBy(specialLines, line => line.qT);

  const householdRows = (householdLines.length ? householdLines : [createEmptyReportLine('Нет данных')])
    .map(line => buildFormattedDocxDataRowXml(tableXml, '{Строка хозяйственно-питьевых нужд}', line, false))
    .join('');
  tableXml = replaceDocxRowsContaining(tableXml, '{Строка хозяйственно-питьевых нужд}', householdRows);

  tableXml = transformDocxRowContaining(tableXml, 'q₀={q0}', rowXml => replaceDocxTokensInXml(rowXml, {
    '{q0}': format(householdTotals.q0Eq),
    '{q0,hr}': format(householdTotals.q0hrEq)
  }));

  tableXml = transformDocxRowContaining(tableXml, 'Итог - хозяйственно-питьевые нужды', rowXml => replaceDocxTokensInXml(rowXml, {
    '{Qсут}': format(householdTotals.totalQDay),
    '{qhr,u·U}': format(householdTotals.totalPeakLh),
    '{qT}': format(householdTotals.totalQT),
    '{NP}': format(householdTotals.totalNp),
    '{NPhr}': format(householdTotals.totalNphr),
    '{α}': format(householdTotals.alpha),
    '{αhr}': format(householdTotals.alphaHr),
    '{q}': format(householdTotals.q),
    '{qhr}': format(householdTotals.qhr)
  }));

  const specialRows = specialLines
    .map(line => buildFormattedDocxDataRowXml(tableXml, '{Поливка / спец. строка}', line, true))
    .join('');
  tableXml = replaceDocxRowsContaining(tableXml, '{Поливка / спец. строка}', specialRows);

  tableXml = transformDocxFinalTotalRow(tableXml, rowXml => replaceDocxTokensInXml(rowXml, {
    '{Qсут}': format(householdTotals.totalQDay + specialQDay),
    '{qhr,u·U}': '-',
    '{qT}': format(householdTotals.totalQT + specialQT),
    '{NP}': '-',
    '{NPhr}': '-',
    '{α}': '-',
    '{αhr}': '-',
    '{q}': format(householdTotals.q),
    '{qhr}': format(householdTotals.qhr)
  }));

  return tableXml;
}

function buildFormattedDocxDataRowXml(tableXml, token, line, specialMode) {
  const templateRow = findDocxRowContaining(tableXml, token);
  if (!templateRow) return '';
  const dash = '-';
  const specialValue = value => specialMode && Math.abs(toNum(value)) < 1e-7 ? dash : format(value);
  return replaceDocxTokensInXml(templateRow, {
    '{Строка хозяйственно-питьевых нужд}': safe(line.name),
    '{Поливка / спец. строка}': safe(line.name),
    '{U/F}': format(line.u),
    '{q_u}': specialValue(line.qum),
    '{q_hr,u}': specialValue(line.qhru),
    '{q0,hr}': specialValue(line.q0hr),
    '{q0}': specialValue(line.q0),
    '{Qсут}': specialValue(line.qDay),
    '{qhr,u·U}': specialValue(line.qPeakLh),
    '{qT}': specialValue(line.qT),
    '{NP}': specialMode ? dash : format(line.np),
    '{NPhr}': specialMode ? dash : format(line.nphr),
    '{α}': '',
    '{αhr}': '',
    '{q}': '',
    '{qhr}': ''
  });
}

function findDocxRowContaining(xml, marker) {
  const rows = xml.match(/<w:tr[\s\S]*?<\/w:tr>/g) || [];
  return rows.find(rowXml => rowXml.includes(marker)) || '';
}

function replaceDocxRowsContaining(xml, marker, replacementRowsXml) {
  return xml.replace(/<w:tr[\s\S]*?<\/w:tr>/g, rowXml => rowXml.includes(marker) ? replacementRowsXml : rowXml);
}

function transformDocxRowContaining(xml, marker, transform) {
  let done = false;
  return xml.replace(/<w:tr[\s\S]*?<\/w:tr>/g, rowXml => {
    if (!done && rowXml.includes(marker)) {
      done = true;
      return transform(rowXml);
    }
    return rowXml;
  });
}

function transformDocxFinalTotalRow(xml, transform) {
  let done = false;
  return xml.replace(/<w:tr[\s\S]*?<\/w:tr>/g, rowXml => {
    if (!done && rowXml.includes('Итог:') && rowXml.includes('{Qсут}')) {
      done = true;
      return transform(rowXml);
    }
    return rowXml;
  });
}

function replaceDocxTokensInXml(xml, tokenMap) {
  let result = xml;
  Object.entries(tokenMap).forEach(([token, value]) => {
    result = replaceAllLiteral(result, token, escapeXmlText(value));
  });
  return result;
}

function replaceAllLiteral(text, search, replacement) {
  return String(text).split(search).join(String(replacement));
}

function escapeXmlText(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceTextTokensInDocument(xmlDoc, tokenMap) {
  const textNodes = Array.from(xmlDoc.getElementsByTagNameNS(DOCX_W_NS, 't'));
  textNodes.forEach(node => {
    let value = node.textContent || '';
    Object.entries(tokenMap).forEach(([token, replacement]) => {
      value = value.split(token).join(String(replacement));
    });
    node.textContent = value;
  });
}

const DOCX_W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

function fillFormattedDocxTables(xmlDoc, reportRows) {
  const tables = Array.from(xmlDoc.getElementsByTagNameNS(DOCX_W_NS, 'tbl'));
  tables.forEach(table => {
    const text = getDocxNodeText(table);
    if (text.includes('Расчет расходов холодной воды')) {
      fillFormattedDocxReportTable(table, reportRows, WaterMode.COLD);
    } else if (text.includes('Расчет расходов горячей воды')) {
      fillFormattedDocxReportTable(table, reportRows, WaterMode.HOT);
    } else if (text.includes('Расчет расходов воды общий')) {
      fillFormattedDocxReportTable(table, reportRows, WaterMode.TOTAL);
    }
  });
}

function fillFormattedDocxReportTable(table, reportRows, mode) {
  const allLines = reportRows.map(row => createReportLine(row, mode));
  const householdLines = allLines.filter(line => !line.isSpecial);
  const specialLines = allLines.filter(line => line.isSpecial);
  const householdTotals = calculateReportTotals(householdLines);
  const specialQDay = sumBy(specialLines, line => line.qDay);
  const specialQT = sumBy(specialLines, line => line.qT);

  const rows = getDocxChildElements(table, 'tr');
  const householdRow = rows.find(row => getDocxNodeText(row).includes('{Строка хозяйственно-питьевых нужд}'));
  const q0Row = rows.find(row => getDocxNodeText(row).includes('q₀=') || getDocxNodeText(row).includes('q0='));
  const householdTotalRow = rows.find(row => getDocxNodeText(row).includes('Итог - хозяйственно-питьевые нужды'));
  const specialRow = rows.find(row => getDocxNodeText(row).includes('{Поливка / спец. строка}'));
  const finalTotalRow = rows.find(row => {
    const text = getDocxNodeText(row).replace(/\s+/g, ' ').trim();
    return text.startsWith('Итог:');
  });

  if (householdRow) {
    const anchor = householdRow;
    const linesToInsert = householdLines.length ? householdLines : [createEmptyReportLine('Нет данных')];
    linesToInsert.forEach(line => {
      const clone = householdRow.cloneNode(true);
      populateDocxDataRow(clone, line, false);
      table.insertBefore(clone, anchor);
    });
    table.removeChild(householdRow);
  }

  if (q0Row) {
    setDocxCellTextByVisualIndex(q0Row, 13, `q₀=${format(householdTotals.q0Eq)}`);
    setDocxCellTextByVisualIndex(q0Row, 14, `q₀,hr=${format(householdTotals.q0hrEq)}`);
  }

  if (householdTotalRow) {
    setDocxCellTextByVisualIndex(householdTotalRow, 6, format(householdTotals.totalQDay));
    setDocxCellTextByVisualIndex(householdTotalRow, 7, format(householdTotals.totalPeakLh));
    setDocxCellTextByVisualIndex(householdTotalRow, 8, format(householdTotals.totalQT));
    setDocxCellTextByVisualIndex(householdTotalRow, 9, format(householdTotals.totalNp));
    setDocxCellTextByVisualIndex(householdTotalRow, 10, format(householdTotals.totalNphr));
    setDocxCellTextByVisualIndex(householdTotalRow, 11, format(householdTotals.alpha));
    setDocxCellTextByVisualIndex(householdTotalRow, 12, format(householdTotals.alphaHr));
    setDocxCellTextByVisualIndex(householdTotalRow, 13, format(householdTotals.q));
    setDocxCellTextByVisualIndex(householdTotalRow, 14, format(householdTotals.qhr));
  }

  if (specialRow) {
    const anchor = specialRow;
    specialLines.forEach(line => {
      const clone = specialRow.cloneNode(true);
      populateDocxDataRow(clone, line, true);
      table.insertBefore(clone, anchor);
    });
    table.removeChild(specialRow);
  }

  if (finalTotalRow) {
    setDocxCellTextByVisualIndex(finalTotalRow, 6, format(householdTotals.totalQDay + specialQDay));
    setDocxCellTextByVisualIndex(finalTotalRow, 7, '-');
    setDocxCellTextByVisualIndex(finalTotalRow, 8, format(householdTotals.totalQT + specialQT));
    setDocxCellTextByVisualIndex(finalTotalRow, 9, '-');
    setDocxCellTextByVisualIndex(finalTotalRow, 10, '-');
    setDocxCellTextByVisualIndex(finalTotalRow, 11, '-');
    setDocxCellTextByVisualIndex(finalTotalRow, 12, '-');
    setDocxCellTextByVisualIndex(finalTotalRow, 13, format(householdTotals.q));
    setDocxCellTextByVisualIndex(finalTotalRow, 14, format(householdTotals.qhr));
  }
}

function createEmptyReportLine(name) {
  return {
    name,
    isSpecial: false,
    u: 0,
    qum: 0,
    qhru: 0,
    q0hr: 0,
    q0: 0,
    qDay: 0,
    qPeakLh: 0,
    qT: 0,
    np: 0,
    nphr: 0
  };
}

function populateDocxDataRow(row, line, specialMode) {
  const dash = '-';
  const specialValue = value => specialMode && Math.abs(toNum(value)) < 1e-7 ? dash : format(value);
  const values = [
    safe(line.name),
    format(line.u),
    specialValue(line.qum),
    specialValue(line.qhru),
    specialValue(line.q0hr),
    specialValue(line.q0),
    specialValue(line.qDay),
    specialValue(line.qPeakLh),
    specialValue(line.qT),
    specialMode ? dash : format(line.np),
    specialMode ? dash : format(line.nphr),
    '',
    '',
    '',
    ''
  ];
  values.forEach((value, index) => setDocxCellTextByVisualIndex(row, index, value));
}

function getDocxChildElements(node, localName) {
  return Array.from(node.childNodes).filter(child => child.nodeType === 1 && child.localName === localName && child.namespaceURI === DOCX_W_NS);
}

function getDocxNodeText(node) {
  return Array.from(node.getElementsByTagNameNS(DOCX_W_NS, 't')).map(textNode => textNode.textContent || '').join('');
}

function getDocxGridSpan(cell) {
  const gridSpan = cell.getElementsByTagNameNS(DOCX_W_NS, 'gridSpan')[0];
  if (!gridSpan) return 1;
  const value = gridSpan.getAttributeNS(DOCX_W_NS, 'val') || gridSpan.getAttribute('w:val') || gridSpan.getAttribute('val');
  return Math.max(1, toInt(value, 1));
}

function getDocxCellByVisualIndex(row, visualIndex) {
  const cells = getDocxChildElements(row, 'tc');
  let current = 0;
  for (const cell of cells) {
    const span = getDocxGridSpan(cell);
    if (visualIndex >= current && visualIndex < current + span) return cell;
    current += span;
  }
  return null;
}

function setDocxCellTextByVisualIndex(row, visualIndex, value) {
  const cell = getDocxCellByVisualIndex(row, visualIndex);
  if (!cell) return;
  setDocxCellText(cell, value);
}

function setDocxCellText(cell, value) {
  const textNodes = Array.from(cell.getElementsByTagNameNS(DOCX_W_NS, 't'));
  if (textNodes.length) {
    textNodes.forEach((node, index) => {
      node.textContent = index === 0 ? String(value) : '';
      if (index === 0) node.setAttribute('xml:space', 'preserve');
    });
    return;
  }

  let paragraph = cell.getElementsByTagNameNS(DOCX_W_NS, 'p')[0];
  if (!paragraph) {
    paragraph = cell.ownerDocument.createElementNS(DOCX_W_NS, 'w:p');
    cell.appendChild(paragraph);
  }
  let run = paragraph.getElementsByTagNameNS(DOCX_W_NS, 'r')[0];
  if (!run) {
    run = cell.ownerDocument.createElementNS(DOCX_W_NS, 'w:r');
    paragraph.appendChild(run);
  }
  const text = cell.ownerDocument.createElementNS(DOCX_W_NS, 'w:t');
  text.setAttribute('xml:space', 'preserve');
  text.textContent = String(value);
  run.appendChild(text);
}

function buildWordMhtmlDocument(html) {
  const boundary = `----=_NextPart_Nagruzki_${Date.now()}`;
  const htmlWithLocation = html.replace('<html ', '<html xmlns:v="urn:schemas-microsoft-com:vml" ');
  return [
    'MIME-Version: 1.0',
    `Content-Type: multipart/related; boundary="${boundary}"; type="text/html"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="utf-8"',
    'Content-Transfer-Encoding: 8bit',
    'Content-Location: report.html',
    '',
    htmlWithLocation,
    '',
    `--${boundary}`,
    'Content-Type: image/png',
    'Content-Transfer-Encoding: base64',
    'Content-Location: effect-logo.png',
    '',
    splitBase64(EFFECT_LOGO_BASE64),
    '',
    `--${boundary}--`
  ].join('\r\n');
}

function splitBase64(value) {
  return String(value || '').replace(/.{1,76}/g, '$&\r\n').trim();
}

function getSelectedReportVariant() {
  return els.reportVariantSelect?.value === 'formatted' ? 'formatted' : 'draft';
}

function buildReportDocumentHtml(reportRows, forWord, variant = 'draft') {
  const generatedAt = new Date().toLocaleString('ru-RU', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
  const meta = getReportMeta();
  const title = variant === 'formatted' ? 'Предварительный расчет водопотребления и водоотведения' : 'Отчет по расчету водопотребления';
  const sectionClass = variant === 'formatted' ? 'FormattedSection' : 'DraftSection';
  const content = variant === 'formatted'
    ? buildFormattedReportContent(reportRows, meta, forWord)
    : buildDraftReportContent(reportRows, generatedAt);

  return `<!doctype html>
<html lang="ru" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>${escapeHtml(title)}</title>
<style>${buildReportStyles(variant)}</style>
</head>
<body class="report-body report-${escapeHtml(variant)}"><div class="${sectionClass}">${content}</div></body></html>`;
}


function buildDraftReportContent(reportRows, generatedAt) {
  return `
    <h1 class="draft-report-title">Отчет по расчету водопотребления</h1>
    <p class="draft-meta">Дата формирования: ${escapeHtml(generatedAt)}</p>
    <p class="draft-meta">Нормативная база: СП 30.13330.2020, таблица А.2.</p>
    ${buildDraftReportTable(reportRows)}
  `;
}


function buildFormattedReportContent(reportRows, meta, forWord = false) {
  const logoSrc = forWord ? 'effect-logo.png' : EFFECT_LOGO_DATA_URI;
  return `
    ${buildCompanyHeaderBlock(logoSrc)}
    <h1 class="formatted-report-title">Предварительный расчет водопотребления и водоотведения.<br>Объект: «${escapeHtml(meta.objectName)}»</h1>
    ${buildFormattedReportTable(reportRows)}
    ${buildReportFooter(meta)}
  `;
}

function buildCompanyHeaderBlock(logoSrc) {
  return `<table class="company-header-table" role="presentation" cellspacing="0" cellpadding="0">
    <tr>
      <td class="company-logo-cell"><img class="company-logo" src="${escapeAttribute(logoSrc)}" alt="Эффект"></td>
      <td class="company-text-cell">
        <p>Акционерное общество</p>
        <p>проектная компания «Эффект»</p>
        <p>ИНН 9701256261 КПП 770101001</p>
        <p>101000, г. Москва, муниципальный округ Басманный,</p>
        <p>б-р Чистопрудный, д.13, стр.1, помещ.1/1</p>
        <p>тел./факс: +7(3952)500-171, e-mail: info@pk-effect.ru</p>
      </td>
      <td class="company-spacer-cell"></td>
    </tr>
  </table>`;
}

function buildReportFooter(meta) {
  const residentsText = safe(meta.residents);
  const floorsText = safe(meta.floors);
  const internalFlow = safe(meta.internalFireFlow);
  const internalDescription = safe(meta.internalFireDescription);
  const autoFlow = safe(meta.autoFireFlow);
  const outdoorFlow = safe(meta.outdoorFireFlow);
  const internalText = internalFlow === '0' || internalFlow === '—'
    ? 'Максимальный расход воды на внутреннее пожаротушение по выбранным параметрам не учитывается.'
    : `Максимальный расход воды на внутреннее пожаротушение определен в соответствии с СП 10.13130.2020 и составляет не менее ${escapeHtml(internalFlow)} л/с (${escapeHtml(internalDescription)}).`;
  const outdoorText = outdoorFlow === '—'
    ? 'Максимальный расход воды на наружное пожаротушение по заданной этажности и строительному объему требует ручной проверки по СП 8.13130.2020.'
    : `Максимальный расход воды на наружное пожаротушение определен в соответствии с СП 8.13130.2020 и составляет ${escapeHtml(outdoorFlow)} л/с.`;

  return `
    <div class="report-footer-text">
      <p>Расчёт выполнен в соответствии с СП 30.13330.2020.</p>
      <p>Количество проживающих в квартире жилого многоквартирного дома для определения расчётных расходов воды принято по формуле:</p>
      <p class="formula-line">N<sub>кв.жит.</sub> = К+1</p>
      <p>где N<sub>кв.жит.</sub> – расчетное количество жителей в квартире; К – количество жилых комнат в квартире.</p>
      <p>Расчет выполнен для ${escapeHtml(residentsText)} жителей, этажность жилого дома – ${escapeHtml(floorsText)} этажей.</p>
      <p>${internalText}</p>
      <p>Максимальный расход воды на автоматическое пожаротушение определен в соответствии с СП 485.1311500.2020 и составляет не менее ${escapeHtml(autoFlow)} л/с.</p>
      <p>${outdoorText}</p>
      <table class="signature-table"><tr>
        <td>${escapeHtml(meta.engineerPosition)}</td>
        <td>${escapeHtml(meta.engineerName)}</td>
      </tr><tr>
        <td>${escapeHtml(meta.engineerDate)}</td>
        <td></td>
      </tr></table>
    </div>
  `;
}

function buildReportStyles(variant = 'draft') {
  const isFormatted = variant === 'formatted';
  const pageCss = isFormatted
    ? `@page { size: 841.9pt 595.3pt; margin: 0.9cm 1cm 0.75cm 1cm; mso-page-orientation: landscape; }`
    : `@page { size: A4 landscape; margin: 10mm; }`;
  return `
  ${pageCss}
  html, body { margin: 0; padding: 0; }
  body { font-family: 'Times New Roman', Times, serif; color: #000; background: #fff; }
  .report-body { box-sizing: border-box; }
  .DraftSection { font-size: 8pt; }
  .FormattedSection { font-size: 11pt; }
  .draft-report-title { font-size: 14pt; text-align: center; margin: 0 0 8pt; }
  .draft-meta { margin: 0 0 4pt; font-size: 9pt; }
  .company-header-table { width: 100%; border-collapse: collapse; border: 0 none !important; table-layout: fixed; margin: 0 0 14pt 0; }
  .company-header-table td { border: 0 none !important; padding: 0; vertical-align: top; }
  .company-logo-cell { width: 37%; text-align: left; }
  .company-text-cell { width: 40%; padding-top: 1pt !important; font-family: Arial, sans-serif; font-size: 9pt; line-height: 1.12; color: #666; }
  .company-spacer-cell { width: 23%; }
  .company-logo { width: 245pt; height: auto; display: block; margin: 0; }
  .company-text-cell p { margin: 0 0 1pt; }
  .formatted-report-title { margin: 0 0 8pt; font-size: 14pt; line-height: 1.05; text-align: center; font-weight: bold; }
  .report-footer-text { margin-top: 12pt; font-size: 11pt; line-height: 1.1; page-break-inside: avoid; }
  .report-footer-text p { margin: 0 0 2pt; }
  .formula-line { text-align: center; color: #b00000; font-style: italic; }
  .signature-table { border-collapse: collapse; margin-top: 16pt; width: 60%; table-layout: fixed; }
  .signature-table td { border: 0 none !important; padding: 0 18pt 0 0; font-size: 11pt; text-align: left; vertical-align: top; }
  table.report-table { border-collapse: collapse; table-layout: fixed; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  table.draft-report-table { width: 100%; }
  table.formatted-report-table { width: 100%; margin: 0 auto; }
  .report-table th, .report-table td { border: 0.5pt solid #000; mso-border-alt: solid #000 0.5pt; vertical-align: middle; word-wrap: break-word; overflow-wrap: anywhere; }
  .draft-report-table th, .draft-report-table td { padding: 1pt 1.6pt; line-height: 1.05; }
  .formatted-report-table th, .formatted-report-table td { padding: 0.45pt 1pt; line-height: 1.0; overflow-wrap: normal; }
  .report-table th { font-weight: bold; text-align: center; }
  .draft-report-table th { background: #fff; }
  .formatted-report-table th { background: #fff; }
  .report-table td { text-align: center; }
  .report-table td.left { text-align: left; }
  .draft-report-table .section-row th { background: #fff; font-size: 8.5pt; padding: 1pt 1.5pt; }
  .formatted-report-table .section-row th { background: #fff; font-size: 10pt; padding: 0.5pt 1pt; }
  .report-table .total-label { font-weight: bold; text-align: center; }
  .draft-report-table .number-row td { font-weight: bold; background: #fff; }
  .formatted-report-table .number-row td { font-weight: bold; background: #fff; }
  .report-table-gap { height: 8pt; line-height: 8pt; }
  .nowrap { white-space: nowrap; }
  @media print { body { margin: 0; } }
  `;
}



function buildDraftReportTable(reportRows) {
  return buildReportTable([
    [WaterMode.COLD, 'Расчет расходов холодной воды'],
    [WaterMode.HOT, 'Расчет расходов горячей воды'],
    [WaterMode.TOTAL, 'Расчет расходов воды общий']
  ], reportRows, {
    className: 'report-table draft-report-table',
    colWidths: [23.128, 5.628, 4.874, 4.874, 4.874, 4.874, 4.874, 4.874, 4.874, 5.205, 5.205, 5.139, 5.139, 8.214, 8.221]
  });
}

function buildFormattedReportTable(reportRows) {
  const firstTable = buildReportTable([
    [WaterMode.COLD, 'Расчет расходов холодной воды'],
    [WaterMode.HOT, 'Расчет расходов горячей воды']
  ], reportRows, {
    className: 'report-table formatted-report-table',
    colWidths: [23.128, 5.628, 4.874, 4.874, 4.874, 4.874, 4.874, 4.874, 4.874, 5.205, 5.205, 5.139, 5.139, 8.214, 8.221]
  });
  const secondTable = buildReportTable([
    [WaterMode.TOTAL, 'Расчет расходов воды общий']
  ], reportRows, {
    className: 'report-table formatted-report-table',
    colWidths: [23.128, 5.628, 4.874, 4.874, 4.874, 4.874, 4.874, 4.874, 4.874, 5.205, 5.205, 5.139, 5.139, 8.214, 8.221]
  });
  return `${firstTable}<div class="report-table-gap"></div>${secondTable}`;
}

function buildReportTable(sectionsDefinition, reportRows, options = {}) {
  const colWidths = options.colWidths || [23.128, 5.628, 4.874, 4.874, 4.874, 4.874, 4.874, 4.874, 4.874, 5.205, 5.205, 5.139, 5.139, 8.214, 8.221];
  const className = options.className || 'report-table';
  const colgroup = colWidths.map(width => `<col style="width:${width}%">`).join('');
  const sections = sectionsDefinition.map(([mode, title]) => buildReportSection(reportRows, mode, title)).join('');

  return `<table class="${className}" border="1" cellspacing="0" cellpadding="0">
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
      <th rowspan="3">коли-<br>чество<br>U<br>сутки<br>час</th>
      <th colspan="2">нормы рас-<br>хода воды</th>
      <th colspan="2">расход воды<br>прибором</th>
      <th colspan="3">расход воды<br>водопотребителями</th>
      <th rowspan="3">NP<br>q<sub>hr,u</sub> · U<br>q<sub>0</sub> · 3600</th>
      <th rowspan="3">NP<sub>hr</sub><br>q<sub>hr,u</sub> · U<br>q<sub>0,hr</sub></th>
      <th rowspan="3">α</th>
      <th rowspan="3">α<sub>hr</sub></th>
      <th rowspan="3">макси-<br>мальный<br>расчетный<br>расход<br>5 · q<sub>0</sub> · α<br>q<sup>c</sup>, q<sup>h</sup><br>л/с</th>
      <th rowspan="3">макси-<br>мальный<br>часовой<br>расход<br>0,005 · q<sub>0,hr</sub> · α<sub>hr</sub><br>q<sup>c</sup><sub>hr</sub>, q<sup>h</sup><sub>hr</sub><br>м³/ч</th>
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
      <th>q<sup>c</sup><sub>u</sub><br>q<sup>h</sup><sub>u</sub><br>л/сут</th>
      <th>q<sup>c</sup><sub>hr,u</sub><br>q<sup>h</sup><sub>hr,u</sub><br>л/ч</th>
      <th>q<sup>c</sup><sub>0,hr</sub><br>q<sup>h</sup><sub>0,hr</sub><br>л/ч</th>
      <th>q<sup>c</sup><sub>0</sub><br>q<sup>h</sup><sub>0</sub><br>л/с</th>
      <th>q<sup>c</sup><sub>0</sub> · U<br>1000<br>q<sup>h</sup><sub>u</sub> · U<br>1000<br>м³/сут</th>
      <th>q<sup>c</sup><sub>hr</sub> · U<br>q<sup>h</sup><sub>hr</sub> · U<br>л/ч</th>
      <th>q<sup>c</sup><sub>T</sub><br>q<sup>h</sup><sub>T</sub><br>м³/ч</th>
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
  localStorage.setItem(AUTO_DRAFT_KEY, JSON.stringify(rows));
  saveReportMetaToStorage(false);
  if (showMessage) toast('Текущий черновик сохранен автоматически в браузере.');
}

function loadRowsFromStorage(showMessage) {
  const raw = localStorage.getItem(AUTO_DRAFT_KEY);
  if (!raw) {
    if (showMessage) toast('Автоматического черновика нет.');
    return;
  }
  try {
    const loaded = JSON.parse(raw);
    rows = normalizeLoadedRows(loaded);
    selectedRowId = rows[0]?.id || null;
    renderAll();
    if (showMessage) toast(rows.length ? 'Автоматический черновик загружен.' : 'Автоматического черновика нет.');
  } catch (error) {
    rows = [];
    selectedRowId = null;
    localStorage.removeItem(AUTO_DRAFT_KEY);
    renderAll();
    if (showMessage) alert('Не удалось прочитать автоматический черновик. Черновик сброшен.');
    console.error(error);
  }
}

function clearAutoSave() {
  localStorage.removeItem(AUTO_DRAFT_KEY);
}

function openSaveCalculationDialog() {
  if (!rows.length) {
    toast('Сначала добавь хотя бы одну строку расчета.');
    return;
  }
  const defaultName = `Расчет ${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  els.calculationNameInput.value = defaultName;
  if (els.saveDialog && typeof els.saveDialog.showModal === 'function') {
    els.saveDialog.showModal();
    setTimeout(() => els.calculationNameInput.focus(), 30);
  } else {
    const name = prompt('Название расчета', defaultName);
    if (name) saveNamedCalculation(name);
  }
}

function saveNamedCalculationFromDialog() {
  const name = (els.calculationNameInput.value || '').trim();
  if (!name) {
    alert('Укажи название расчета.');
    return;
  }
  saveNamedCalculation(name);
  if (els.saveDialog) els.saveDialog.close();
}

function saveNamedCalculation(name) {
  const calculations = getSavedCalculations();
  const existingIndex = calculations.findIndex(item => item.name.toLowerCase() === name.toLowerCase());
  if (existingIndex >= 0 && !confirm(`Расчет «${name}» уже есть. Заменить его?`)) return;

  const item = {
    id: existingIndex >= 0 ? calculations[existingIndex].id : makeId(),
    name,
    savedAt: new Date().toISOString(),
    rows: JSON.parse(JSON.stringify(rows)),
    reportMeta: getReportMeta()
  };

  if (existingIndex >= 0) calculations[existingIndex] = item;
  else calculations.unshift(item);

  localStorage.setItem(SAVED_CALCULATIONS_KEY, JSON.stringify(calculations));
  saveRowsToStorage(false);
  toast(`Расчет «${name}» сохранен.`);
}

function openLoadCalculationDialog() {
  renderSavedCalculationsList();
  if (els.loadDialog && typeof els.loadDialog.showModal === 'function') {
    els.loadDialog.showModal();
  } else {
    const calculations = getSavedCalculations();
    if (!calculations.length) {
      toast('Сохраненных расчетов нет.');
      return;
    }
    const names = calculations.map((item, index) => `${index + 1}. ${item.name}`).join('\n');
    const value = prompt(`Введите номер расчета:\n${names}`, '1');
    const index = Number(value) - 1;
    if (Number.isInteger(index) && calculations[index]) loadSavedCalculation(calculations[index].id);
  }
}

function renderSavedCalculationsList() {
  const calculations = getSavedCalculations();
  selectedSavedCalculationId = calculations[0]?.id || null;
  els.savedCalculationsList.innerHTML = '';

  if (!calculations.length) {
    els.savedCalculationsList.innerHTML = '<div class="empty-saved-list">Сохраненных расчетов пока нет.</div>';
    updateSavedCalculationButtons();
    return;
  }

  calculations.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'saved-calculation-item';
    button.dataset.id = item.id;
    button.innerHTML = `
      <span class="saved-calculation-name">${escapeHtml(item.name)}</span>
      <span class="saved-calculation-meta">${escapeHtml(formatSavedDate(item.savedAt))} · строк: ${item.rows?.length || 0}</span>
    `;
    button.addEventListener('click', () => {
      selectedSavedCalculationId = item.id;
      renderSavedCalculationsSelection();
    });
    els.savedCalculationsList.appendChild(button);
  });

  renderSavedCalculationsSelection();
  updateSavedCalculationButtons();
}

function renderSavedCalculationsSelection() {
  els.savedCalculationsList.querySelectorAll('.saved-calculation-item').forEach(button => {
    button.classList.toggle('selected', button.dataset.id === selectedSavedCalculationId);
  });
  updateSavedCalculationButtons();
}

function updateSavedCalculationButtons() {
  const hasSelection = Boolean(selectedSavedCalculationId);
  if (els.loadSelectedCalculationButton) els.loadSelectedCalculationButton.disabled = !hasSelection;
  if (els.deleteSavedCalculationButton) els.deleteSavedCalculationButton.disabled = !hasSelection;
}

function loadSelectedSavedCalculation() {
  if (!selectedSavedCalculationId) return;
  loadSavedCalculation(selectedSavedCalculationId);
}

function loadSavedCalculation(id) {
  const calculations = getSavedCalculations();
  const item = calculations.find(calc => calc.id === id);
  if (!item) {
    toast('Выбранный расчет не найден.');
    renderSavedCalculationsList();
    return;
  }
  rows = normalizeLoadedRows(item.rows || []);
  setReportMetaInputs(item.reportMeta || loadReportMetaFromStorage(true));
  selectedRowId = rows[0]?.id || null;
  renderAll();
  saveRowsToStorage(false);
  if (els.loadDialog) els.loadDialog.close();
  toast(`Расчет «${item.name}» открыт.`);
}

function deleteSelectedSavedCalculation() {
  if (!selectedSavedCalculationId) return;
  const calculations = getSavedCalculations();
  const item = calculations.find(calc => calc.id === selectedSavedCalculationId);
  if (!item) return;
  if (!confirm(`Удалить сохраненный расчет «${item.name}»?`)) return;
  const updated = calculations.filter(calc => calc.id !== selectedSavedCalculationId);
  localStorage.setItem(SAVED_CALCULATIONS_KEY, JSON.stringify(updated));
  selectedSavedCalculationId = updated[0]?.id || null;
  renderSavedCalculationsList();
  toast('Сохраненный расчет удален.');
}

function getSavedCalculations() {
  try {
    const raw = localStorage.getItem(SAVED_CALCULATIONS_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data.filter(item => item && item.id && item.name && Array.isArray(item.rows)) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function formatSavedDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'без даты';
  return date.toLocaleString('ru-RU', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}

function getReportMeta() {
  const raw = {
    objectName: els.objectNameInput?.value,
    residents: els.residentsInput?.value,
    floors: els.floorsInput?.value,
    internalFireRule: els.internalFireRuleSelect?.value,
    longCorridor: els.longCorridorInput?.checked ? 'true' : 'false',
    internalFireFlow: els.internalFireFlowInput?.value,
    internalFireDescription: els.internalFireDescriptionInput?.value,
    autoFireFlow: els.autoFireFlowInput?.value,
    outdoorFireClass: els.outdoorFireClassSelect?.value,
    buildingVolume: els.buildingVolumeInput?.value,
    outdoorFireFlow: els.outdoorFireFlowInput?.value,
    engineerPosition: els.engineerPositionInput?.value,
    engineerDate: els.engineerDateInput?.value,
    engineerName: els.engineerNameInput?.value
  };
  const meta = normalizeReportMeta(raw);
  const derived = calculateDerivedReportMeta(meta);
  return { ...meta, ...derived };
}

function setReportMetaInputs(meta) {
  const normalized = normalizeReportMeta(meta);
  if (els.objectNameInput) els.objectNameInput.value = normalized.objectName;
  if (els.floorsInput) els.floorsInput.value = normalized.floors;
  if (els.internalFireRuleSelect) els.internalFireRuleSelect.value = normalized.internalFireRule;
  if (els.longCorridorInput) els.longCorridorInput.checked = normalized.longCorridor !== 'false';
  if (els.outdoorFireClassSelect) els.outdoorFireClassSelect.value = normalized.outdoorFireClass;
  if (els.buildingVolumeInput) els.buildingVolumeInput.value = normalized.buildingVolume;
  if (els.engineerPositionInput) els.engineerPositionInput.value = normalized.engineerPosition;
  if (els.engineerDateInput) els.engineerDateInput.value = normalized.engineerDate;
  if (els.engineerNameInput) els.engineerNameInput.value = normalized.engineerName;
  updateDerivedReportFields();
  saveReportMetaToStorage(false);
}

function normalizeReportMeta(meta) {
  const source = meta && typeof meta === 'object' ? meta : {};
  const result = {};
  Object.keys(DEFAULT_REPORT_META).forEach(key => {
    const value = source[key];
    result[key] = value === null || value === undefined || String(value).trim() === ''
      ? DEFAULT_REPORT_META[key]
      : String(value).trim();
  });
  return result;
}

function updateDerivedReportFields() {
  const meta = normalizeReportMeta({
    objectName: els.objectNameInput?.value,
    floors: els.floorsInput?.value,
    internalFireRule: els.internalFireRuleSelect?.value,
    longCorridor: els.longCorridorInput?.checked ? 'true' : 'false',
    outdoorFireClass: els.outdoorFireClassSelect?.value,
    buildingVolume: els.buildingVolumeInput?.value,
    engineerPosition: els.engineerPositionInput?.value,
    engineerDate: els.engineerDateInput?.value,
    engineerName: els.engineerNameInput?.value
  });
  const derived = calculateDerivedReportMeta(meta);
  if (els.residentsInput) els.residentsInput.value = derived.residents;
  if (els.internalFireFlowInput) els.internalFireFlowInput.value = derived.internalFireFlow;
  if (els.internalFireDescriptionInput) els.internalFireDescriptionInput.value = derived.internalFireDescription;
  if (els.autoFireFlowInput) els.autoFireFlowInput.value = derived.autoFireFlow;
  if (els.outdoorFireFlowInput) els.outdoorFireFlowInput.value = derived.outdoorFireFlow;
}

function calculateDerivedReportMeta(meta) {
  const internal = calculateInternalFire(meta);
  return {
    residents: String(calculateResidentsForReport()),
    internalFireFlow: internal.flow,
    internalFireDescription: internal.description,
    autoFireFlow: '30',
    outdoorFireFlow: calculateOutdoorFireFlow(meta)
  };
}

function calculateResidentsForReport() {
  return rows
    .filter(row => row.include && isResidentRow(row))
    .reduce((sum, row) => sum + getUCountValue(row), 0);
}

function isResidentRow(row) {
  const unit = safe(row.unit).toLowerCase();
  const typeName = safe(row.consumerTypeName).toLowerCase();
  const name = safe(row.consumerName).toLowerCase();
  return unit.includes('жител') || typeName.includes('жилые дома') || name.includes('секция');
}

function calculateInternalFire(meta) {
  const floors = Math.floor(toNum(meta.floors));
  const longCorridor = meta.longCorridor !== 'false';
  let streams = 0;

  if (floors >= 17 && floors <= 25) streams = 2;
  else if (floors >= 12 && floors <= 16) streams = longCorridor ? 2 : 1;
  else if (floors > 25) streams = 2;
  else streams = 0;

  const flow = streams * 2.6;
  if (streams <= 0) {
    return {
      flow: '0',
      description: 'для жилого дома по заданной этажности не требуется'
    };
  }

  return {
    flow: formatFixedSmart(flow, 1),
    description: `${streams} ${streams === 1 ? 'струя' : 'струи'} по 2,6 л/с`
  };
}


function calculateOutdoorFireFlow(meta) {
  const floors = Math.floor(toNum(meta.floors));
  const volume = toNum(meta.buildingVolume);
  if (floors <= 0 || volume <= 0) return DEFAULT_REPORT_META.outdoorFireFlow;

  const volumeIndex = getOutdoorVolumeIndex(volume);
  const rowsTable = meta.outdoorFireClass === 'f1f2f3f4'
    ? OUTDOOR_FIRE_FLOW_TABLE.f1f2f3f4
    : OUTDOOR_FIRE_FLOW_TABLE.f13f14;
  const row = rowsTable.find(item => floors >= item.minFloors && floors <= item.maxFloors) || rowsTable[rowsTable.length - 1];
  const value = row.values[volumeIndex];
  return value === null || value === undefined ? '—' : String(value).replace('.', ',');
}

function getOutdoorVolumeIndex(volumeThousandM3) {
  const value = toNum(volumeThousandM3);
  if (value <= 1) return 0;
  if (value <= 5) return 1;
  if (value <= 25) return 2;
  if (value <= 50) return 3;
  if (value <= 150) return 4;
  if (value <= 300) return 5;
  if (value <= 800) return 6;
  return 7;
}

const OUTDOOR_FIRE_FLOW_TABLE = Object.freeze({
  f13f14: [
    { minFloors: 0, maxFloors: 2, values: [10, 10, 15, 20, 25, 30, 35, 40] },
    { minFloors: 3, maxFloors: 12, values: [10, 15, 15, 20, 25, 30, 35, 40] },
    { minFloors: 13, maxFloors: 16, values: [null, 20, 20, 25, 30, 35, 40, 45] },
    { minFloors: 17, maxFloors: 25, values: [null, null, 20, 25, 30, 35, 50, 60] },
    { minFloors: 26, maxFloors: 999, values: [null, null, 60, 80, 90, 100, 100, 100] }
  ],
  f1f2f3f4: [
    { minFloors: 0, maxFloors: 2, values: [10, 10, 15, 20, 30, 30, 35, 40] },
    { minFloors: 3, maxFloors: 6, values: [10, 15, 20, 25, 30, 35, 40, 40] },
    { minFloors: 7, maxFloors: 12, values: [15, 20, 25, 30, 35, 40, 40, 50] },
    { minFloors: 13, maxFloors: 16, values: [null, null, 30, 30, 35, 50, 50, 60] },
    { minFloors: 17, maxFloors: 25, values: [null, null, 30, 35, 40, 50, 50, 60] },
    { minFloors: 26, maxFloors: 999, values: [null, null, 70, 90, 100, 100, 100, 100] }
  ]
});

function saveReportMetaToStorage(showMessage) {
  try {
    localStorage.setItem(REPORT_META_KEY, JSON.stringify(getReportMeta()));
    if (showMessage) toast('Данные оформленного отчета сохранены.');
  } catch (error) {
    console.error(error);
  }
}

function loadReportMetaFromStorage(returnOnly = false) {
  let meta = DEFAULT_REPORT_META;
  try {
    const raw = localStorage.getItem(REPORT_META_KEY);
    if (raw) meta = normalizeReportMeta(JSON.parse(raw));
  } catch (error) {
    console.error(error);
    meta = DEFAULT_REPORT_META;
  }
  if (returnOnly) return meta;
  setReportMetaInputs(meta);
  return meta;
}

function formatFixedSmart(value, decimals = 1) {
  const number = roundTo(toNum(value), decimals);
  return String(number).replace('.', ',');
}

function formatRuDate(date) {
  const d = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} г.`;
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

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
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
