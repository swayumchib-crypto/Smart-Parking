// ============================================
// CUSTOM CHART RENDERING (No external libraries)
// ============================================

const Charts = {
    // Create a bar chart
    createBarChart(container, data, options = {}) {
        const {
            color = 'primary',
            height = 200,
            showValues = true,
            animated = true,
        } = options;

        const maxVal = Math.max(...data.map(d => d.value));

        let html = `<div class="bar-chart" style="height: ${height}px;">`;
        data.forEach((item, i) => {
            const barHeight = (item.value / maxVal) * 100;
            const delay = animated ? `transition-delay: ${i * 50}ms;` : '';
            const barColor = item.color || color;

            html += `
                <div class="bar-item">
                    ${showValues ? `<span class="bar-value">${item.value}%</span>` : ''}
                    <div class="bar ${barColor}" 
                         style="height: ${barHeight}%; ${delay}"
                         title="${item.label}: ${item.value}%">
                    </div>
                    <span class="bar-label">${item.label}</span>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    },

    // Create SVG line chart
    createLineChart(container, data, options = {}) {
        const {
            width = container.clientWidth || 600,
            height = 250,
            color = '#6366f1',
            fillColor = 'rgba(99, 102, 241, 0.1)',
            showDots = true,
            showGrid = true,
            showLabels = true,
        } = options;

        const padding = { top: 20, right: 20, bottom: 40, left: 45 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        const maxVal = Math.max(...data.map(d => d.value));
        const minVal = Math.min(...data.map(d => d.value));
        const range = maxVal - minVal || 1;

        const points = data.map((d, i) => ({
            x: padding.left + (i / (data.length - 1)) * chartW,
            y: padding.top + chartH - ((d.value - minVal) / range) * chartH,
            value: d.value,
            label: d.label,
        }));

        let pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        let areaD = pathD +
            ` L ${points[points.length - 1].x} ${padding.top + chartH}` +
            ` L ${points[0].x} ${padding.top + chartH} Z`;

        let gridLines = '';
        if (showGrid) {
            for (let i = 0; i <= 4; i++) {
                const y = padding.top + (i / 4) * chartH;
                const val = Math.round(maxVal - (i / 4) * range);
                gridLines += `
                    <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" 
                          stroke="var(--border)" stroke-dasharray="4,4" opacity="0.5"/>
                    <text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" 
                          fill="var(--text-muted)" font-size="11">${val}%</text>
                `;
            }
        }

        let labels = '';
        if (showLabels) {
            const step = Math.max(1, Math.floor(data.length / 8));
            data.forEach((d, i) => {
                if (i % step === 0 || i === data.length - 1) {
                    const x = padding.left + (i / (data.length - 1)) * chartW;
                    labels += `
                        <text x="${x}" y="${height - 8}" text-anchor="middle" 
                              fill="var(--text-muted)" font-size="11">${d.label}</text>
                    `;
                }
            });
        }

        let dots = '';
        if (showDots) {
            points.forEach((p, i) => {
                dots += `
                    <circle cx="${p.x}" cy="${p.y}" r="4" fill="${color}" stroke="var(--bg-card)" stroke-width="2">
                        <title>${p.label}: ${p.value}%</title>
                    </circle>
                `;
            });
        }

        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:${height}px;">
                ${gridLines}
                <defs>
                    <linearGradient id="lineGrad_${Date.now()}" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
                        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
                    </linearGradient>
                </defs>
                <path d="${areaD}" fill="url(#lineGrad_${Date.now()})" opacity="0.5"/>
                <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                ${dots}
                ${labels}
            </svg>
        `;
    },

    // Create donut chart
    createDonutChart(container, data, options = {}) {
        const {
            size = 180,
            strokeWidth = 12,
            centerText = '',
            centerLabel = '',
        } = options;

        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const total = data.reduce((sum, d) => sum + d.value, 0);

        let cumulativeOffset = 0;
        let circles = '';

        data.forEach((d) => {
            const pct = d.value / total;
            const dashLength = pct * circumference;
            const dashOffset = -cumulativeOffset * circumference;

            circles += `
                <circle cx="${size / 2}" cy="${size / 2}" r="${radius}"
                        stroke="${d.color}" stroke-width="${strokeWidth}"
                        stroke-dasharray="${dashLength} ${circumference - dashLength}"
                        stroke-dashoffset="${dashOffset}"
                        style="transition: stroke-dasharray 1s ease;"/>
            `;
            cumulativeOffset += pct;
        });

        let legendHtml = data.map(d => `
            <div class="legend-item">
                <div class="legend-color" style="background: ${d.color}"></div>
                <div class="legend-info">
                    <span class="legend-name">${d.label}</span>
                    <span class="legend-value">${d.value}</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="donut-chart-container">
                <div class="donut-chart" style="width: ${size}px; height: ${size}px;">
                    <svg viewBox="0 0 ${size} ${size}">
                        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}"
                                stroke="var(--bg-tertiary)" stroke-width="${strokeWidth}"/>
                        ${circles}
                    </svg>
                    <div class="donut-center">
                        <div class="donut-value">${centerText}</div>
                        <div class="donut-label">${centerLabel}</div>
                    </div>
                </div>
                <div class="donut-legend">${legendHtml}</div>
            </div>
        `;
    },

    // Create heatmap
    createHeatmap(container, data) {
        const { days, hours, data: matrix } = data;

        let html = '<div class="heatmap-container"><div class="heatmap-grid">';

        // Header row
        html += '<div class="heatmap-label"></div>';
        hours.forEach(h => {
            html += `<div class="heatmap-label header">${h}</div>`;
        });

        // Data rows
        days.forEach((day, di) => {
            html += `<div class="heatmap-label">${day}</div>`;
            matrix[di].forEach((val, hi) => {
                const color = this.getHeatmapColor(val);
                html += `
                    <div class="heatmap-cell" 
                         style="background: ${color}"
                         data-tooltip="${day} ${hours[hi]}:00 — ${val}% occupied"
                         title="${day} ${hours[hi]}:00 — ${val}% occupied">
                    </div>
                `;
            });
        });

        html += '</div></div>';
        container.innerHTML = html;
    },

    getHeatmapColor(value) {
        if (value >= 90) return 'rgba(239, 68, 68, 0.9)';
        if (value >= 80) return 'rgba(239, 68, 68, 0.7)';
        if (value >= 70) return 'rgba(245, 158, 11, 0.7)';
        if (value >= 60) return 'rgba(245, 158, 11, 0.5)';
        if (value >= 50) return 'rgba(245, 158, 11, 0.3)';
        if (value >= 40) return 'rgba(16, 185, 129, 0.3)';
        if (value >= 30) return 'rgba(16, 185, 129, 0.4)';
        if (value >= 20) return 'rgba(16, 185, 129, 0.5)';
        if (value >= 10) return 'rgba(16, 185, 129, 0.3)';
        return 'rgba(16, 185, 129, 0.15)';
    },

    // Create a simple sparkline
    createSparkline(container, values, color = '#6366f1') {
        const w = container.clientWidth || 120;
        const h = 40;
        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min || 1;

        const points = values.map((v, i) => {
            const x = (i / (values.length - 1)) * w;
            const y = h - ((v - min) / range) * (h - 4) - 2;
            return `${x},${y}`;
        });

        container.innerHTML = `
            <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;">
                <polyline points="${points.join(' ')}" fill="none" 
                          stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    },

    // Create multi-line chart
    createMultiLineChart(container, datasets, options = {}) {
        const {
            width = container.clientWidth || 600,
            height = 280,
            showLabels = true,
        } = options;

        const padding = { top: 20, right: 20, bottom: 40, left: 45 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        const allVals = datasets.flatMap(ds => ds.data.map(d => d.value));
        const maxVal = Math.max(...allVals);
        const minVal = Math.min(...allVals);
        const range = maxVal - minVal || 1;

        let gridLines = '';
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (i / 4) * chartH;
            const val = Math.round(maxVal - (i / 4) * range);
            gridLines += `
                <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" 
                      stroke="var(--border)" stroke-dasharray="4,4" opacity="0.5"/>
                <text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" 
                      fill="var(--text-muted)" font-size="11">${val}%</text>
            `;
        }

        let paths = '';
        datasets.forEach(ds => {
            const points = ds.data.map((d, i) => {
                const x = padding.left + (i / (ds.data.length - 1)) * chartW;
                const y = padding.top + chartH - ((d.value - minVal) / range) * chartH;
                return { x, y };
            });
            const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
            paths += `
                <path d="${pathD}" fill="none" stroke="${ds.color}" stroke-width="2" 
                      stroke-linecap="round" stroke-linejoin="round" ${ds.dashed ? 'stroke-dasharray="6,4"' : ''}/>
            `;
        });

        let labels = '';
        if (showLabels && datasets[0]) {
            const d0 = datasets[0].data;
            const step = Math.max(1, Math.floor(d0.length / 8));
            d0.forEach((d, i) => {
                if (i % step === 0 || i === d0.length - 1) {
                    const x = padding.left + (i / (d0.length - 1)) * chartW;
                    labels += `
                        <text x="${x}" y="${height - 8}" text-anchor="middle" 
                              fill="var(--text-muted)" font-size="11">${d.label}</text>
                    `;
                }
            });
        }

        // Legend
        let legend = datasets.map(ds => `
            <span style="display:inline-flex;align-items:center;gap:6px;margin-right:16px;font-size:12px;color:var(--text-secondary);">
                <span style="width:16px;height:3px;background:${ds.color};border-radius:2px;${ds.dashed ? 'border-top:2px dashed ' + ds.color + ';background:none;' : ''}"></span>
                ${ds.label}
            </span>
        `).join('');

        container.innerHTML = `
            <div style="padding:0 8px 8px;display:flex;flex-wrap:wrap;">${legend}</div>
            <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:${height}px;">
                ${gridLines}
                ${paths}
                ${labels}
            </svg>
        `;
    }
};