(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Climate = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const scenarios = [
    { id: 'ssp119', label: 'SSP1–1.9', level: 'Very low emissions', color: '#26998d', dash: '' },
    { id: 'ssp126', label: 'SSP1–2.6', level: 'Low emissions', color: '#4b88c4', dash: '9 3' },
    { id: 'ssp245', label: 'SSP2–4.5', level: 'Intermediate emissions', color: '#8064bc', dash: '3 3' },
    { id: 'ssp370', label: 'SSP3–7.0', level: 'High emissions', color: '#e57f2c', dash: '10 3 2 3' },
    { id: 'ssp585', label: 'SSP5–8.5', level: 'Very high emissions', color: '#c64036', dash: '14 4' }
  ];
  function quantile(values, p) {
    if (!values.length) return NaN;
    const sorted = [...values].sort((a, b) => a - b);
    const position = (sorted.length - 1) * p;
    const low = Math.floor(position), fraction = position - low;
    return sorted[low] + ((sorted[low + 1] ?? sorted[low]) - sorted[low]) * fraction;
  }
  function summarize(records, periods, selected) {
    return selected.map(scenario => ({ scenario, points: periods.map(period => {
      const members = records.filter(r => r.scenario === scenario && r.period === period);
      const values = members.map(r => r.value);
      return { period, n: values.length, members, median: quantile(values, .5),
               low: quantile(values, .1), high: quantile(values, .9) };
    }) }));
  }
  function compareModelCases(records, periods, definitions) {
    if (definitions.length !== 2) throw new Error('A model comparison requires two cases.');
    const cases = definitions.map(definition => ({ ...definition, points: periods.map(period => {
      const matches = records.filter(r => r.model === definition.model && r.scenario === definition.scenario && r.period === period);
      if (matches.length !== 1 || !Number.isFinite(matches[0].value)) {
        throw new Error(`Missing or ambiguous model value: ${definition.model}/${definition.scenario}/${period}`);
      }
      return matches[0];
    }) }));
    const comparisons = periods.map((period, index) => {
      const a = cases[0].points[index], b = cases[1].points[index];
      const delta = b.value - a.value;
      return { period, a, b, delta, winner: delta > 0 ? cases[1].id : delta < 0 ? cases[0].id : null };
    });
    return { cases, comparisons };
  }
  return { scenarios, quantile, summarize, compareModelCases };
});
