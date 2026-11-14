(async function () {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const status = $('#load-status');
  try {
    if (!window.d3 || !window.Climate) throw new Error('A local JavaScript file could not be loaded.');
    const { records, metadata } = await d3.json('data/climate.json');
    $('#model-count').textContent = metadata.models.length;
    $('#model-sample-count').textContent = `The same ${metadata.models.length} models per scenario`;
    const { scenarios, summarize, compareModelCases } = Climate;
    const periods = metadata.periods;
    const byId = new Map(scenarios.map(d => [d.id, d]));
    const numberFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const format = n => numberFormat.format(n);
    const periodLabel = s => s.replace('-', '–');
    const params = new URLSearchParams(location.search);
    const requested = (params.get('scenarios') || '').split(',').filter(id => byId.has(id));
    const state = { selected: new Set(requested.length ? requested : scenarios.map(d => d.id)),
      decade: /^[0-8]$/.test(params.get('decade') || '') ? +params.get('decade') : 3,
      showRange: params.get('bands') !== '0', pinnedModel: null };
    const predictionData = compareModelCases(records, periods, [
      { id: 'a', model: 'CanESM5', scenario: 'ssp119' },
      { id: 'b', model: 'GFDL-ESM4', scenario: 'ssp585' }
    ]);
    const prediction = { guess: null, revealed: false, savedView: null };
    const predictionAnswer = predictionData.comparisons[periods.length - 1];
    let series = [], preview = null, hoveredModel = null;
    let width = 1350, height = 650, x, y;
    let margin = {};
    const modelRows = d3.group(records, d => d.model);
    const selectedIds = () => scenarios.filter(d => state.selected.has(d.id)).map(d => d.id);
    const inspectedModel = () => hoveredModel || state.pinnedModel;
    const focusIndex = () => preview ?? state.decade;
    function modelTracks() {
      if (prediction.revealed) return predictionData.cases.map(d => ({
        key: d.id, model: d.model, scenario: d.scenario, values: d.points, prediction: true
      }));
      const model = inspectedModel();
      return model ? series.map(s => ({ key: `${model}/${s.scenario}`, model, scenario: s.scenario,
        values: periods.map(period => modelRows.get(model).find(r => r.scenario === s.scenario && r.period === period)) })) : [];
    }
    function updateAddress() {
      const query = new URLSearchParams({ scenarios: selectedIds().join(','), decade: String(state.decade), bands: state.showRange ? '1' : '0' });
      try { history.replaceState(null, '', `${location.pathname}?${query}${location.hash}`); } catch { /* Preview embedding may restrict history. */ }
    }
    d3.select('#scenario-buttons').selectAll('button').data(scenarios).join('button')
      .attr('type', 'button').attr('class', 'scenario-button').attr('data-scenario', d => d.id)
      .style('--scenario-color', d => d.color).attr('aria-pressed', d => state.selected.has(d.id))
      .attr('aria-label', d => `${d.label}, ${d.level}`)
      .each(function (d) {
        const button = d3.select(this);
        button.append('span').attr('class', 'scenario-dot').attr('aria-hidden', 'true');
        button.append('span').text(d.label);
      }).on('click', (event, d) => {
        if (prediction.revealed) clearPrediction(false);
        if (state.selected.has(d.id)) {
          if (state.selected.size === 1) {
            $('#action-status').textContent = 'Keep at least one pathway selected. Select another pathway before hiding this one.';
            return;
          }
          state.selected.delete(d.id);
        } else state.selected.add(d.id);
        preview = null;
        hoveredModel = null;
        if (state.pinnedModel && !modelRows.get(state.pinnedModel).some(r => state.selected.has(r.scenario))) state.pinnedModel = null;
        render();
      });
    const svg = d3.select('#chart').append('svg').attr('role', 'img').attr('tabindex', -1)
      .attr('aria-labelledby', 'svg-title svg-description');
    svg.append('title').attr('id', 'svg-title').text('Global surface temperature anomaly by emissions pathway');
    svg.append('desc').attr('id', 'svg-description');
    const defs = svg.append('defs');
    defs.append('clipPath').attr('id', 'plot-clip').append('rect');
    const grid = svg.append('g').attr('class', 'grid');
    const references = svg.append('g');
    const plot = svg.append('g').attr('clip-path', 'url(#plot-clip)');
    const bands = plot.append('g');
    const lines = plot.append('g');
    const traces = plot.append('g');
    const focus = plot.append('g').attr('pointer-events', 'none');
    const axes = svg.append('g').attr('class', 'axis');
    const modelLabel = svg.append('text').attr('class', 'model-trace-label');
    const hit = svg.append('rect').attr('class', 'chart-hit');

    function render() {
      series = summarize(records, periods, selectedIds());
      d3.selectAll('.scenario-button').attr('aria-pressed', d => state.selected.has(d.id));
      $('#show-range').checked = state.showRange;
      draw();
      updateAddress();
    }
    function draw() {
      width = $('#chart').getBoundingClientRect().width;
      if (!width) return;
      height = width < 600 ? 370 : Math.round(width * 650 / 1350);
      margin = width < 600 ? { top: 49, right: 20, bottom: 43, left: 41 }
        : { top: 68, right: 75, bottom: 65, left: 94 };
      const trackData = modelTracks();
      const model = prediction.revealed ? null : inspectedModel();
      const modelMax = d3.max(trackData.flatMap(d => d.values.filter(Boolean)), r => r.value) || 0;
      const upper = Math.max(7, Math.ceil(modelMax || 0));
      x = d3.scaleLinear().domain([2015.5, 2100]).range([margin.left, width - margin.right]);
      y = d3.scaleLinear().domain([.6, upper]).range([height - margin.bottom, margin.top]);
      svg.attr('viewBox', `0 0 ${width} ${height}`).attr('data-prediction', prediction.revealed ? 'revealed' : null);
      defs.select('rect').attr('x', margin.left - 6).attr('y', margin.top - 5)
        .attr('width', width - margin.left - margin.right + 12).attr('height', height - margin.top - margin.bottom + 10);
      grid.attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickValues(d3.range(1, upper + 1)).tickSize(-(width - margin.left - margin.right)).tickFormat(d => `${d}°`));
      axes.attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickValues(width < 600 ? [2020, 2060, 2100] : [2020, 2040, 2060, 2080, 2100]).tickFormat(d3.format('d')).tickSize(6));
      axes.selectAll('.tick').filter(d => d === 2100).select('text').attr('text-anchor', 'end');
      references.selectAll('line').data([1.5, 2]).join('line').attr('class', 'threshold')
        .attr('x1', margin.left).attr('x2', width - margin.right).attr('y1', y).attr('y2', y);
      references.selectAll('text').data([1.5, 2]).join('text').attr('class', 'threshold-label')
        .attr('x', margin.left + 8).attr('y', d => y(d) - 7).text(d => `${d}°C`);
      const area = d3.area().x((d, i) => x(2015.5 + i * 10)).y0(d => y(d.low)).y1(d => y(d.high));
      const line = d3.line().x((d, i) => x(2015.5 + i * 10)).y(d => y(d.median));
      bands.selectAll('path').data(state.showRange ? series : [], d => d.scenario).join('path')
        .attr('d', d => area(d.points)).attr('fill', d => byId.get(d.scenario).color)
        .attr('fill-opacity', model || prediction.revealed ? .035 : .10);
      lines.selectAll('path').data(series, d => d.scenario).join('path').attr('class', 'median-line')
        .attr('d', d => line(d.points)).attr('stroke', d => byId.get(d.scenario).color);
      lines.selectAll('g').data(series, d => d.scenario).join('g').each(function (s) {
        d3.select(this).selectAll('circle').data(s.points).join('circle').attr('class', 'median-dot')
          .attr('cx', (d, i) => x(2015.5 + i * 10)).attr('cy', d => y(d.median)).attr('r', width < 600 ? 2 : 2.7)
          .attr('fill', byId.get(s.scenario).color);
      });
      const traceLine = d3.line().defined(d => !!d).x((d, i) => x(2015.5 + i * 10)).y(d => y(d.value));
      traces.selectAll('path').data(trackData, d => d.key).join('path')
        .attr('class', d => d.prediction ? 'model-trace prediction-trace' : 'model-trace')
        .attr('data-case', d => d.prediction ? d.key : null).attr('data-model', d => d.model)
        .attr('data-scenario', d => d.scenario)
        .attr('stroke', d => byId.get(d.scenario).color).attr('d', d => traceLine(d.values));
      modelLabel.attr('x', margin.left).attr('y', width < 600 ? 35 : 39)
        .text(prediction.revealed ? 'A / B: model runs · faded lines: medians' : model ? `${model} · dashed model trajectories` : '');
      hit.attr('x', margin.left).attr('y', margin.top).attr('width', width - margin.left - margin.right)
        .attr('height', height - margin.top - margin.bottom);
      updateFocus();
    }
    function updateFocus() {
      if (!x) return;
      const index = focusIndex();
      const points = series.map(s => ({ ...s.points[index], scenario: s.scenario }));
      const sorted = [...points].sort((a, b) => a.median - b.median);
      const low = sorted[0], high = sorted[sorted.length - 1];
      const span = high.median - low.median;
      focus.selectAll('*').remove();
      focus.append('line').attr('class', 'focus-line').attr('x1', x(2015.5 + index * 10))
        .attr('x2', x(2015.5 + index * 10)).attr('y1', margin.top).attr('y2', height - margin.bottom);
      focus.selectAll('circle').data(points).join('circle').attr('class', 'median-dot')
        .attr('cx', x(2015.5 + index * 10)).attr('cy', d => y(d.median)).attr('r', width < 600 ? 4 : 5.7)
        .attr('fill', d => byId.get(d.scenario).color);
      const model = prediction.revealed ? null : inspectedModel();
      const trackPoints = modelTracks().flatMap(track => track.values[index] ? [{ ...track.values[index], key: track.key }] : []);
      focus.selectAll('.individual-dot').data(trackPoints).join('rect').attr('class', 'individual-dot')
        .attr('x', x(2015.5 + index * 10) - 3).attr('y', d => y(d.value) - 3)
        .attr('width', 6).attr('height', 6).attr('fill', d => byId.get(d.scenario).color).attr('stroke', '#ffffff');
      focus.selectAll('.prediction-case-label').data(prediction.revealed ? trackPoints : []).join('text')
        .attr('class', 'prediction-case-label').attr('x', x(2015.5 + index * 10) + 8)
        .attr('y', d => y(d.value) + 4).text(d => d.key.toUpperCase());
      $('#decade').value = index;
      $('#decade').setAttribute('aria-valuetext', periodLabel(periods[index]));
      $('#decade-value').textContent = periodLabel(periods[index]);
      $('#model-period').textContent = periodLabel(periods[index]);
      $('#insight-heading').textContent = prediction.revealed ? 'TWO MODELS, TWO PATHWAYS' : 'WHAT THE MODELS SHOW';
      const pair = predictionData.comparisons[index];
      $('#insight-text').textContent = prediction.revealed
        ? pair.winner
          ? `Case ${pair.winner.toUpperCase()} is ${format(Math.abs(pair.delta))}°C warmer than Case ${pair.winner === 'a' ? 'B' : 'A'} in ${periodLabel(periods[index])}.`
          : `Cases A and B have the same projected warming in ${periodLabel(periods[index])}.`
        : points.length === 1
        ? `${byId.get(low.scenario).label} has a median warming of ${format(low.median)}°C in ${periodLabel(periods[index])}. Select another pathway to compare futures.`
        : `${span < .5 ? 'The futures still look similar' : span < 2 ? 'The futures are beginning to pull apart' : 'The futures have diverged'}: the selected medians span ${format(span)}°C in ${periodLabel(periods[index])}, from ${byId.get(low.scenario).label} to ${byId.get(high.scenario).label}.`;
      d3.select('#scenario-cards').selectAll('article').data(points, d => d.scenario).join(enter => {
        const card = enter.append('article').attr('class', 'scenario-card');
        card.append('p').attr('class', 'scenario-name');
        card.append('p').attr('class', 'scenario-value');
        card.append('p').attr('class', 'scenario-range');
        return card;
      }).style('--scenario-color', d => byId.get(d.scenario).color).each(function (d) {
        const card = d3.select(this), s = byId.get(d.scenario);
        card.select('.scenario-name').text(`${s.label} · ${s.level.replace(' emissions', '')}`);
        card.select('.scenario-value').text(`${format(d.median)}°`);
        card.select('.scenario-range').text(`80% range ${format(d.low)}–${format(d.high)}°C · n=${d.n}`);
      });
      updateTable(points);
      $('#svg-description').textContent = `${points.length} selected CMIP6 pathways. In ${periodLabel(periods[index])}: ${points.map(p => `${byId.get(p.scenario).label} median ${format(p.median)} degrees Celsius`).join('; ')}. ${state.showRange ? 'Shading shows the 10th–90th percentiles of models.' : 'Model range shading is hidden.'} Use the focus decade slider for keyboard and touch exploration.${model ? ` Dashed lines show individual model ${model}.` : ''}${prediction.revealed ? ` Prediction comparison: A is ${predictionData.cases[0].model} under ${byId.get(predictionData.cases[0].scenario).label}, ${format(pair.a.value)} degrees Celsius; B is ${predictionData.cases[1].model} under ${byId.get(predictionData.cases[1].scenario).label}, ${format(pair.b.value)} degrees Celsius. Dashed model traces and A/B markers are highlighted; the scenario median lines are faded context.` : ''}`;
    }
    function updateTable(points) {
      const models = [...new Set(points.flatMap(p => p.members.map(r => r.model)))].sort();
      const headers = [{ key: 'model', label: 'Model' }, ...points.map(p => ({ key: p.scenario, label: byId.get(p.scenario).label }))];
      d3.select('#model-table thead').selectAll('tr').data([headers]).join('tr').selectAll('th').data(d => d, d => d.key).join('th')
        .attr('scope', 'col').style('color', d => byId.get(d.key)?.color || null).text(d => d.label);
      d3.select('#model-table tbody').selectAll('tr').data(models, d => d).join(enter => {
        const row = enter.append('tr');
        row.append('td').append('button').attr('type', 'button')
          .on('pointerenter', (event, model) => inspect(model))
          .on('pointerleave', () => inspect(null))
          .on('focus', (event, model) => inspect(model))
          .on('blur', () => inspect(null))
          .on('click', (event, model) => {
            if (prediction.revealed) clearPrediction(false);
            state.pinnedModel = state.pinnedModel === model ? null : model;
            hoveredModel = null;
            draw();
          });
        return row;
      }).attr('data-active', model => inspectedModel() === model).each(function (model) {
        const row = d3.select(this);
        row.select('button').datum(model).attr('aria-pressed', state.pinnedModel === model)
          .attr('aria-label', `Inspect ${model}`).text(model);
        row.selectAll('td.model-value').data(points.map(p => ({ scenario: p.scenario, row: p.members.find(r => r.model === model) })), d => d.scenario)
          .join('td').attr('class', 'model-value').text(d => d.row ? `${format(d.row.value)}°C` : '—');
      });
      $('#model-help').textContent = prediction.revealed
        ? 'A and B are highlighted in the chart. Select a model here to leave the prediction comparison and inspect that model.'
        : state.pinnedModel
        ? `${state.pinnedModel} is pinned as dashed trajectories on the main chart. Click its name again to clear. “—” means this model is not available for that pathway.`
        : 'Hover or focus a model to inspect its dashed trajectories above. Click to pin. “—” means unavailable for that pathway.';
    }
    function inspect(model) {
      // Keep the prediction visible during incidental hover/focus. An explicit
      // model selection above returns to ordinary model inspection.
      if (prediction.revealed) return;
      if (hoveredModel === model) return;
      hoveredModel = model;
      draw();
    }
    function selectDecade(index) {
      state.decade = Math.max(0, Math.min(8, index));
      preview = null;
      updateFocus();
      updateAddress();
    }
    function updatePredictionUI() {
      $('#prediction-options').disabled = prediction.revealed;
      document.querySelectorAll('input[name="warming-prediction"]').forEach(input => {
        input.checked = input.value === prediction.guess;
      });
      $('#prediction-reveal').disabled = !prediction.guess;
      $('#prediction-reveal').textContent = prediction.revealed ? 'View comparison on chart ↑' : 'Reveal comparison';
      $('#prediction-exit').hidden = !prediction.revealed;
      $('#prediction-result').hidden = !prediction.revealed;
      if (!prediction.revealed) return;
      const winner = predictionAnswer.winner;
      $('#prediction-verdict').textContent = winner
        ? prediction.guess === winner
          ? `Your prediction matches the source values: Case ${winner.toUpperCase()} projects more warming.`
          : `The source values show Case ${winner.toUpperCase()} projects more warming.`
        : 'The two cases have the same projected warming.';
      $('#prediction-values').textContent = `${periodLabel(predictionAnswer.period)}: A (${predictionData.cases[0].model} / ${byId.get(predictionData.cases[0].scenario).label}) = ${format(predictionAnswer.a.value)}°C; B (${predictionData.cases[1].model} / ${byId.get(predictionData.cases[1].scenario).label}) = ${format(predictionAnswer.b.value)}°C. Difference: ${format(Math.abs(predictionAnswer.delta))}°C. Values are ten-year means above 1850–1900.`;
      $('#prediction-takeaway').textContent = winner === 'b'
        ? 'In this pair, the very high-emissions case is warmer despite the difference between models. These are individual model runs, not scenario medians or probabilities.'
        : 'Model differences also affect the outcome of this pair. These are individual model runs, not scenario medians or probabilities.';
      $('#prediction-next').textContent = predictionData.comparisons.some(d => d.winner !== winner)
        ? 'The ordering changes earlier in the century. View the highlighted chart, then move the focus decade backward to find when.'
        : 'View the highlighted chart, then move the focus decade backward to explore how the gap changes.';
    }
    function clearPrediction(restoreView) {
      const saved = prediction.savedView;
      Object.assign(prediction, { guess: null, revealed: false, savedView: null });
      if (restoreView && saved) {
        Object.assign(state, saved, { selected: new Set(saved.selected) });
        preview = null;
        hoveredModel = null;
        $('#chart-tooltip').hidden = true;
      }
      updatePredictionUI();
      $('#prediction-challenge').open = false;
      if (restoreView && saved) render();
    }
    predictionData.cases.forEach(d => {
      $(`#prediction-${d.id}-model`).textContent = `${d.id.toUpperCase()} · ${d.model}`;
      $(`#prediction-${d.id}-path`).textContent = `${byId.get(d.scenario).label} · ${byId.get(d.scenario).level}`;
    });
    $('#prediction-period').textContent = periodLabel(predictionAnswer.period);
    document.querySelectorAll('input[name="warming-prediction"]').forEach(input => input.addEventListener('change', () => {
      if (!['a', 'b'].includes(input.value) || prediction.revealed) return;
      prediction.guess = input.value;
      updatePredictionUI();
    }));
    $('#prediction-reveal').addEventListener('click', () => {
      if (!prediction.guess) return;
      const alreadyRevealed = prediction.revealed;
      if (!alreadyRevealed) prediction.savedView = { ...state, selected: new Set(state.selected) };
      prediction.revealed = true;
      predictionData.cases.forEach(d => state.selected.add(d.scenario));
      state.decade = periods.length - 1;
      state.pinnedModel = null;
      hoveredModel = null;
      preview = null;
      $('#chart-tooltip').hidden = true;
      updatePredictionUI();
      render();
      if (alreadyRevealed) {
        $('.chart-figure').scrollIntoView({ block: 'center',
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        svg.node().focus({ preventScroll: true });
      }
    });
    $('#prediction-exit').addEventListener('click', () => {
      clearPrediction(true);
      $('#prediction-summary').focus({ preventScroll: true });
    });
    $('#prediction-challenge').addEventListener('toggle', () => {
      if (!$('#prediction-challenge').open) clearPrediction(true);
    });
    function nearestDecade(event) {
      return Math.max(0, Math.min(8, Math.round((x.invert(d3.pointer(event, svg.node())[0]) - 2015.5) / 10)));
    }
    function showTooltip(event) {
      const tooltip = d3.select('#chart-tooltip');
      tooltip.selectAll('*').remove();
      tooltip.append('strong').text(periodLabel(periods[focusIndex()]));
      series.forEach(s => {
        const row = tooltip.append('div').attr('class', 'tooltip-row');
        row.append('span').style('color', byId.get(s.scenario).color).text(byId.get(s.scenario).label);
        row.append('span').text(`${format(s.points[focusIndex()].median)}°C`);
      });
      const [xx, yy] = d3.pointer(event, $('.chart-figure'));
      $('#chart-tooltip').hidden = false;
      tooltip.style('left', `${Math.max(8, Math.min(xx + 16, width - $('#chart-tooltip').offsetWidth - 12))}px`)
        .style('top', `${Math.max(8, Math.min(yy - 20, height - $('#chart-tooltip').offsetHeight - 12))}px`);
    }
    hit.on('pointermove', event => {
      if (event.pointerType === 'touch') return;
      preview = nearestDecade(event);
      updateFocus();
      showTooltip(event);
    }).on('pointerleave', () => { preview = null; $('#chart-tooltip').hidden = true; updateFocus(); })
      .on('click', event => { selectDecade(nearestDecade(event)); $('#chart-tooltip').hidden = true; });
    $('#decade').addEventListener('input', event => selectDecade(+event.target.value));
    $('#show-range').addEventListener('change', event => { state.showRange = event.target.checked; preview = null; render(); });
    $('#reset').addEventListener('click', () => {
      clearPrediction(false);
      Object.assign(state, { selected: new Set(scenarios.map(d => d.id)), decade: 3, showRange: true, pinnedModel: null });
      preview = null; hoveredModel = null;
      $('#chart-tooltip').hidden = true;
      $('#action-status').textContent = 'View reset. All five pathways are selected.';
      render();
    });
    status.hidden = true;
    ['#reset', '.app-controls', '.chart-figure', '.decade-control', '.ensemble-row', '#scenario-cards'].forEach(s => $(s).hidden = false);
    $('#explorer-app').setAttribute('aria-busy', 'false');
    render();
    let resizeTimer;
    new ResizeObserver(() => { clearTimeout(resizeTimer); resizeTimer = setTimeout(draw, 60); }).observe($('#chart'));
  } catch (error) {
    console.error(error);
    status.hidden = false;
    status.textContent = `The explorer could not load. ${error.message} Serve this folder over HTTP and reload. The original CSV and method remain available below.`;
    $('#explorer-app').setAttribute('aria-busy', 'false');
  }
})();
