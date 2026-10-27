// ============================================
// ANALYTICS PAGE
// ============================================

const AnalyticsPage = {
    currentFilter: 'week',

    render() {
        const data = DummyData;
        const metrics = this.getMetrics();
        const periodLabel = this.currentFilter === 'today'
            ? 'Today'
            : this.currentFilter === 'week' ? 'This Week' : 'Last 12 Months';

        return `
            <div class="fade-in">
                <!-- Filters -->
                <div class="analytics-filters">
                    <button class="filter-btn ${this.currentFilter === 'today' ? 'active' : ''}" 
                            onclick="AnalyticsPage.setFilter('today')">Today</button>
                    <button class="filter-btn ${this.currentFilter === 'week' ? 'active' : ''}"
                            onclick="AnalyticsPage.setFilter('week')">This Week</button>
                    <button class="filter-btn ${this.currentFilter === 'year' ? 'active' : ''}"
                            onclick="AnalyticsPage.setFilter('year')">This Year</button>
                    <button class="settings-btn outline" onclick="AnalyticsPage.exportCsv()" title="Export the selected sample analytics as CSV">Export CSV</button>
                </div>

                <!-- Key Metrics -->
                <div class="stats-grid" style="grid-template-columns: repeat(5, 1fr);">
                    ${metrics.map(metric => `
                        <div class="stat-card">
                            <div class="stat-value" style="${metric.color ? `color:${metric.color};` : ''}">${metric.value}</div>
                            <div class="stat-label">${metric.label}</div>
                        </div>
                    `).join('')}
                </div>

                <!-- Charts Row 1 -->
                <div class="content-grid-equal">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <span class="dot blue"></span>
                                ${periodLabel} Occupancy
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="analyticsMultiLine" class="chart-container"></div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <span class="dot purple"></span>
                                Weekly Comparison
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="weeklyCompare"></div>
                        </div>
                    </div>
                </div>

                <!-- Heatmap -->
                <div class="card" style="margin-bottom:28px;">
                    <div class="card-header">
                        <div class="card-title">
                            <span class="dot red"></span>
                            Occupancy Heatmap (7 Days × 24 Hours)
                        </div>
                        <div class="card-actions">
                            <div style="display:flex;gap:4px;align-items:center;">
                                <div style="width:10px;height:10px;border-radius:2px;background:rgba(16,185,129,0.3);"></div>
                                <span style="font-size:11px;color:var(--text-muted);">Low</span>
                                <div style="width:10px;height:10px;border-radius:2px;background:rgba(245,158,11,0.5);margin-left:8px;"></div>
                                <span style="font-size:11px;color:var(--text-muted);">Medium</span>
                                <div style="width:10px;height:10px;border-radius:2px;background:rgba(239,68,68,0.8);margin-left:8px;"></div>
                                <span style="font-size:11px;color:var(--text-muted);">High</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="heatmapChart"></div>
                    </div>
                </div>

                <!-- Charts Row 2 -->
                <div class="content-grid">
                    <!-- Monthly Trend -->
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <span class="dot green"></span>
                                Monthly Occupancy Trend
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="monthlyTrendChart" class="chart-container"></div>
                        </div>
                    </div>

                    <!-- Zone Breakdown -->
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <span class="dot purple"></span>
                                Zone Breakdown
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="zoneDonutChart"></div>
                        </div>
                    </div>
                </div>

                <!-- Peak Hours Table -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <span class="dot red"></span>
                            Peak Hour Analysis
                        </div>
                    </div>
                    <div class="card-body no-pad">
                        <div style="overflow-x:auto;">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>Peak Hour</th>
                                        <th>Avg Occupancy</th>
                                        <th>Peak Occupancy</th>
                                        <th>Total Entries</th>
                                        <th>Demand Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.weeklyOccupancy.map(w => {
            const level = w.peak >= 90 ? 'high' : w.peak >= 70 ? 'medium' : 'low';
            return `
                                            <tr>
                                                <td><strong>${w.day}</strong></td>
                                                <td>11:00 AM</td>
                                                <td>${w.avg}%</td>
                                                <td><strong>${w.peak}%</strong></td>
                                                <td>${w.entries}</td>
                                                <td>
                                                    <span class="status-pill ${level}">
                                                        <span class="dot-sm"></span>
                                                        ${level.charAt(0).toUpperCase() + level.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        `;
        }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        // Selected period chart
        const multiLineEl = document.getElementById('analyticsMultiLine');
        if (multiLineEl) {
            Charts.createLineChart(multiLineEl, this.getSeries(), { color: '#ef4444', height: 280 });
        }

        // Weekly comparison
        const weeklyEl = document.getElementById('weeklyCompare');
        if (weeklyEl) {
            Charts.createBarChart(weeklyEl,
                DummyData.weeklyOccupancy.map(w => ({
                    label: w.day,
                    value: w.peak,
                    color: w.peak >= 90 ? 'danger' : w.peak >= 70 ? 'warning' : 'success',
                })),
                { height: 250 }
            );
        }

        // Heatmap
        const heatmapEl = document.getElementById('heatmapChart');
        if (heatmapEl) {
            Charts.createHeatmap(heatmapEl, DummyData.heatmapData);
        }

        // Monthly trend
        const monthlyEl = document.getElementById('monthlyTrendChart');
        if (monthlyEl) {
            Charts.createLineChart(monthlyEl,
                DummyData.monthlyTrend.map(m => ({ label: m.month, value: m.occupancy })),
                { color: '#10b981', height: 280 }
            );
        }

        // Zone donut
        const zoneDonutEl = document.getElementById('zoneDonutChart');
        if (zoneDonutEl) {
            Charts.createDonutChart(zoneDonutEl, [
                { label: 'Zone A', value: 14, color: '#6366f1' },
                { label: 'Zone B', value: 8, color: '#8b5cf6' },
                { label: 'Zone C', value: 5, color: '#a78bfa' },
                { label: 'VIP', value: 3, color: '#f59e0b' },
                { label: 'EV', value: 2, color: '#10b981' },
            ], {
                centerText: '32',
                centerLabel: 'Vehicles',
            });
        }
    },

    setFilter(filter) {
        this.currentFilter = filter;
        App.loadPage('analytics');
    },

    getSeries() {
        if (this.currentFilter === 'today') {
            return DummyData.hourlyOccupancy.map(item => ({ label: item.hour, value: item.occupancy }));
        }
        if (this.currentFilter === 'year') {
            return DummyData.monthlyTrend.map(item => ({ label: item.month, value: item.occupancy }));
        }
        return DummyData.weeklyOccupancy.map(item => ({ label: item.day, value: item.avg }));
    },

    getMetrics() {
        if (this.currentFilter === 'today') {
            const hourly = DummyData.hourlyOccupancy;
            const average = Math.round(hourly.reduce((total, item) => total + item.occupancy, 0) / hourly.length);
            const peak = Math.max(...hourly.map(item => item.occupancy));
            return [
                { label: 'Total Entries', value: DummyData.overview.todayEntries },
                { label: 'Total Exits', value: DummyData.overview.todayExits },
                { label: 'Avg Occupancy', value: `${average}%`, color: 'var(--warning)' },
                { label: 'Peak Hourly Occupancy', value: `${peak}%`, color: 'var(--danger)' },
                { label: 'Avg Duration', value: DummyData.overview.avgDuration, color: 'var(--success)' },
            ];
        }

        if (this.currentFilter === 'year') {
            const months = DummyData.monthlyTrend;
            const average = Math.round(months.reduce((total, item) => total + item.occupancy, 0) / months.length);
            const bestMonth = months.reduce((best, item) => item.occupancy > best.occupancy ? item : best);
            const revenue = months.reduce((total, item) => total + item.revenue, 0);
            return [
                { label: 'Months Tracked', value: months.length },
                { label: 'Avg Occupancy', value: `${average}%`, color: 'var(--warning)' },
                { label: 'Best Month', value: bestMonth.month, color: 'var(--success)' },
                { label: 'Best Monthly Avg', value: `${bestMonth.occupancy}%`, color: 'var(--danger)' },
                { label: 'Sample Revenue (currency unspecified)', value: revenue.toLocaleString() },
            ];
        }

        const days = DummyData.weeklyOccupancy;
        const totalEntries = days.reduce((total, item) => total + item.entries, 0);
        const average = Math.round(days.reduce((total, item) => total + item.avg, 0) / days.length);
        const peak = days.reduce((highest, item) => item.peak > highest.peak ? item : highest);
        return [
            { label: 'Total Entries', value: totalEntries },
            { label: 'Days Tracked', value: days.length },
            { label: 'Avg Occupancy', value: `${average}%`, color: 'var(--warning)' },
            { label: 'Peak Day', value: `${peak.day} · ${peak.peak}%`, color: 'var(--danger)' },
            { label: 'Avg Duration', value: 'Not available' },
        ];
    },

    exportCsv() {
        const rows = [
            ['SmartPark sample analytics', this.currentFilter],
            ['Metric', 'Value'],
            ...this.getMetrics().map(metric => [metric.label, metric.value]),
            [],
            ['Period', 'Occupancy'],
            ...this.getSeries().map(item => [item.label, `${item.value}%`]),
        ];
        const csv = rows.map(row => row.map(value =>
            `"${String(value ?? '').replaceAll('"', '""')}"`
        ).join(',')).join('\r\n');
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = `smartpark-${this.currentFilter}-sample-analytics.csv`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
};