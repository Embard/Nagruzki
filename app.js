'use strict';

const AUTO_DRAFT_KEY = 'nagruzki-online-rows-v1';
const SAVED_CALCULATIONS_KEY = 'nagruzki-online-saved-calculations-v1';
const REPORT_META_KEY = 'nagruzki-online-report-meta-v1';

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

function printReport() {
  const reportRows = getRowsForReport();
  const html = buildReportDocumentHtml(reportRows, false, getSelectedReportVariant());

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
  const variant = getSelectedReportVariant();
  const html = buildReportDocumentHtml(reportRows, true, variant);
  const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
  const prefix = variant === 'formatted' ? 'Оформленный_отчет_водопотребления' : 'Черновой_расчет_водопотребления';
  downloadBlob(blob, `${prefix}_${timestamp()}.doc`);
}

function getSelectedReportVariant() {
  return els.reportVariantSelect?.value === 'formatted' ? 'formatted' : 'draft';
}

function buildReportDocumentHtml(reportRows, forWord, variant = 'draft') {
  const generatedAt = new Date().toLocaleString('ru-RU', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
  const bodyClass = forWord ? 'WordSection1' : 'print-section';
  const meta = getReportMeta();
  const title = variant === 'formatted' ? 'Предварительный расчет водопотребления и водоотведения' : 'Отчет по расчету водопотребления';
  const content = variant === 'formatted'
    ? buildFormattedReportContent(reportRows, meta)
    : buildDraftReportContent(reportRows, generatedAt);
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
  <style>${buildReportStyles()}</style>
  </head><body><div class="${bodyClass}">${content}</div></body></html>`;
}

function buildDraftReportContent(reportRows, generatedAt) {
  return `
    <h1>Отчет по расчету водопотребления</h1>
    <p class="meta">Дата формирования: ${escapeHtml(generatedAt)}</p>
    <p class="meta">Нормативная база: СП 30.13330.2020, таблица А.2.</p>
    ${buildDraftReportTable(reportRows)}
  `;
}

function buildFormattedReportContent(reportRows, meta) {
  return `
    <div class="company-block">
      <p>Акционерное общество</p>
      <p>проектная компания «Эффект»</p>
      <p>ИНН 9701256261 КПП 770101001</p>
      <p>101000, г. Москва, муниципальный округ Басманный,</p>
      <p>б-р Чистопрудный, д.13, стр.1, помещ.1/1</p>
      <p>тел./факс: +7(3952)500-171, e-mail: info@pk-effect.ru</p>
    </div>
    <h1 class="formatted-report-title">Предварительный расчет водопотребления и водоотведения.<br>Объект: «${escapeHtml(meta.objectName)}»</h1>
    ${buildFormattedReportTable(reportRows)}
    ${buildReportFooter(meta)}
  `;
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

function buildReportStyles() {
  return `
  @page WordSection1 { size: 841.9pt 595.3pt; mso-page-orientation: landscape; margin: 2.5cm 1cm 0.75cm 1.5cm; }
  @page { size: A4 landscape; margin: 25mm 10mm 7.5mm 15mm; }
  div.WordSection1 { page: WordSection1; }
  body { font-family: "Times New Roman", serif; font-size: 11pt; color: #111; background: white; }
  h1 { font-size: 14pt; text-align: center; margin: 0 0 8pt; }
  .meta { margin: 0 0 2pt; font-size: 11pt; }
  .company-block { text-align: center; margin: 0 0 16pt; font-size: 11pt; line-height: 1.15; }
  .company-block p { margin: 0 0 2pt; }
  .formatted-report-title { margin: 0 0 10pt; font-size: 14pt; line-height: 1.15; }
  .report-footer-text { margin-top: 12pt; font-size: 11pt; line-height: 1.1; page-break-inside: avoid; }
  .report-footer-text p { margin: 0 0 2pt; }
  .formula-line { text-align: center; color: #b00000; font-style: italic; }
  .signature-table { border-collapse: collapse; margin-top: 16pt; width: 60%; table-layout: fixed; }
  .signature-table td { border: 0; padding: 0 18pt 0 0; font-size: 11pt; text-align: left; vertical-align: top; }
  table.report-table { width: 10.5in; border-collapse: collapse; table-layout: fixed; margin: 0 auto; }
  .report-table th, .report-table td { border: 1px solid #000; padding: 0.5pt 1.2pt; vertical-align: middle; line-height: 1.0; word-wrap: break-word; overflow-wrap: normal; }
  .report-table th { font-weight: bold; text-align: center; background: white; }
  .report-table td { text-align: center; }
  .report-table td.left { text-align: left; }
  .report-table .section-row th { background: white; font-size: 11pt; padding: 0.5pt 1.2pt; }
  .report-table .total-label { font-weight: bold; text-align: center; }
  .report-table .number-row td { font-weight: bold; background: white; }
  .report-page-break { page-break-before: always; height: 0; line-height: 0; }
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
    colWidths: [18, 5, 6, 6, 6, 5, 7, 7, 6, 5.5, 5.5, 4.5, 4.5, 6.5, 7.5]
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
  return `${firstTable}<div class="report-page-break"></div>${secondTable}`;
}

function buildReportTable(sectionsDefinition, reportRows, options = {}) {
  const colWidths = options.colWidths || [23.128, 5.628, 4.874, 4.874, 4.874, 4.874, 4.874, 4.874, 4.874, 5.205, 5.205, 5.139, 5.139, 8.214, 8.221];
  const className = options.className || 'report-table';
  const colgroup = colWidths.map(width => `<col style="width:${width}%">`).join('');
  const sections = sectionsDefinition.map(([mode, title]) => buildReportSection(reportRows, mode, title)).join('');

  return `<table class="${className}">
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
  const rule = meta.internalFireRule || DEFAULT_REPORT_META.internalFireRule;
  let streams = 0;

  if (rule === 'oneStream') streams = 1;
  else if (rule === 'twoStreams') streams = 2;
  else if (rule === 'none') streams = 0;
  else {
    const floors = Math.floor(toNum(meta.floors));
    const longCorridor = meta.longCorridor !== 'false';
    if (floors >= 17) streams = 2;
    else if (floors >= 12) streams = longCorridor ? 2 : 1;
    else streams = 0;
  }

  const flow = streams * 2.6;
  if (streams <= 0) return { flow: '0', description: 'не требуется по выбранным параметрам' };
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
