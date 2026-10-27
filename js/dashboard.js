// ============================================
// DASHBOARD PAGE
// ============================================

const DashboardPage = {
    currentView: 'today',
    currentLogFilter: 'all',

    render() {
        const data = DummyData;
        const occupancyPct = data.getOccupancyPercentage();
        const occupancyColor = data.getOccupancyColor(occupancyPct);
        const logEntries = this.getFilteredLog();

        return `
            <div class="fade-in">
                <!-- Sample Data Status -->
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
                    <div>
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                            <div style="width:8px;height:8px;border-radius:50%;background:var(--warning);"></div>
                            <span style="font-size:13px;color:var(--warning);font-weight:600;">SAMPLE DATA</span>
                        </div>
                        <p style="font-size:13px;color:var(--text-muted);">
                            Example parking activity · no live data connection
                        </p>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button class="filter-btn ${this.currentView === 'today' ? 'active' : ''}" aria-pressed="${this.currentView === 'today'}" onclick="DashboardPage.setView('today')">Today</button>
                        <button class="filter-btn ${this.currentView === 'week' ? 'active' : ''}" aria-pressed="${this.currentView === 'week'}" onclick="DashboardPage.setView('week')">This Week</button>
                        <button class="filter-btn ${this.currentView === 'year' ? 'active' : ''}" aria-pressed="${this.currentView === 'year'}" onclick="DashboardPage.setView('year')">This Year</button>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card primary">
                        <div class="stat-header">
                            <div class="stat-icon primary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="1" y="3" width="22" height="18" rx="2"/>
                                    <line x1="12" y1="8" x2="12" y2="16"/>
                                    <line x1="8" y1="12" x2="16" y2="12"/>
                                </svg>
                            </div>
                            <div class="stat-trend up">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                                </svg>
                                +12%
                            </div>
                        </div>
                        <div class="stat-value">${data.overview.totalSlots}</div>
                        <div class="stat-label">Total Parking Slots</div>
                    </div>

                    <div class="stat-card success">
                        <div class="stat-header">
                            <div class="stat-icon success">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                            </div>
                            <div class="stat-trend up">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                                </svg>
                                +5%
                            </div>
                        </div>
                        <div class="stat-value" style="color:var(--success);">${data.overview.available}</div>
                        <div class="stat-label">Available Slots</div>
                    </div>

                    <div class="stat-card danger">
                        <div class="stat-header">
                            <div class="stat-icon danger">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </div>
                            <div class="stat-trend down">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                                </svg>
                                -3%
                            </div>
                        </div>
                        <div class="stat-value" style="color:var(--danger);">${data.overview.occupied}</div>
                        <div class="stat-label">Occupied Slots</div>
                    </div>

                    <div class="stat-card warning">
                        <div class="stat-header">
                            <div class="stat-icon warning">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                                </svg>
                            </div>
                            <div class="stat-trend up">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                                </svg>
                                +8%
                            </div>
                        </div>
                        <div class="stat-value" style="color:var(--warning);">${data.overview.todayEntries}</div>
                        <div class="stat-label">Today's Entries</div>
                    </div>
                </div>

                <!-- Second Row Stats -->
                <div class="stats-grid" style="margin-bottom:28px;">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon primary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                            </div>
                        </div>
                        <div class="stat-value">${data.overview.avgDuration}</div>
                        <div class="stat-label">Avg. Parking Duration</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon success">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="stat-value" style="color:var(--success);">${data.overview.detectionAccuracy}%</div>
                        <div class="stat-label">Detection Accuracy</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon danger">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                                    <polyline points="16 7 22 7 22 13"/>
                                </svg>
                            </div>
                        </div>
                        <div class="stat-value">${data.overview.peakOccupancy}%</div>
                        <div class="stat-label">Peak Occupancy Today</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon warning">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                            </div>
                        </div>
                        <div class="stat-value">${data.overview.todayExits}</div>
                        <div class="stat-label">Today's Exits</div>
                    </div>
                </div>

                <!-- Charts Row -->
                <div class="content-grid">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <span class="dot green"></span>
                                Occupancy Trend
                            </div>
                            <div class="card-actions">
                                <span style="font-size:12px;color:var(--text-muted);">Today</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="hourlyChart" class="chart-container"></div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <span class="dot purple"></span>
                                Current Occupancy
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="occupancyDonut"></div>
                        </div>
                    </div>
                </div>

                <!-- Second Charts Row -->
                <div class="content-grid-equal">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <span class="dot blue"></span>
                                Weekly Overview
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="weeklyChart"></div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <span class="dot red"></span>
                                Recent Activity
                            </div>
                            <div class="card-actions">
                                <button type="button" class="activity-log-link" onclick="document.getElementById('detectionLog')?.scrollIntoView({behavior:'smooth'})">View Log</button>
                            </div>
                        </div>
                        <div class="card-body" style="padding:16px 24px;max-height:340px;overflow-y:auto;">
                            <div class="activity-list">
                                ${data.recentActivities.map(a => `
                                    <div class="activity-item">
                                        <div class="activity-icon ${a.type}">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                ${a.type === 'enter'
                ? '<polyline points="15 3 21 3 21 9"/><line x1="21" y1="3" x2="14" y2="10"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>'
                : '<path d="M18 6L6 18"/><path d="M8 6h10v10"/>'}
                                            </svg>
                                        </div>
                                        <div class="activity-info">
                                            <div class="activity-text">
                                                ${a.type === 'enter' ? 'Vehicle entered' : 'Vehicle exited'} 
                                                <strong>${a.slot}</strong>
                                            </div>
                                            <div class="activity-time">${a.vehicle} · ${a.vehicleType} · ${a.time}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Detection Log Table -->
                <div class="card" id="detectionLog">
                    <div class="card-header">
                        <div class="card-title">
                            <span class="dot green"></span>
                            AI Detection Log
                        </div>
                        <div class="card-actions">
                            <button class="filter-btn ${this.currentLogFilter === 'all' ? 'active' : ''}" aria-pressed="${this.currentLogFilter === 'all'}" data-log-filter="all" onclick="DashboardPage.setLogFilter('all')">All</button>
                            <button class="filter-btn ${this.currentLogFilter === 'entry' ? 'active' : ''}" aria-pressed="${this.currentLogFilter === 'entry'}" data-log-filter="entry" onclick="DashboardPage.setLogFilter('entry')">Entries</button>
                            <button class="filter-btn ${this.currentLogFilter === 'exit' ? 'active' : ''}" aria-pressed="${this.currentLogFilter === 'exit'}" data-log-filter="exit" onclick="DashboardPage.setLogFilter('exit')">Exits</button>
                        </div>
                    </div>
                    <div class="card-body no-pad">
                        <div style="overflow-x:auto;">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Slot</th>
                                        <th>Action</th>
                                        <th>Vehicle</th>
                                        <th>Zone</th>
                                        <th>Confidence</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${logEntries.map(log => {
            const index = data.detectionLog.indexOf(log);
            return `
                                                        <tr data-search-id="log-${index}" tabindex="-1">
                                            <td><strong>${log.time}</strong></td>
                                            <td>${log.slot}</td>
                                            <td>
                                                <span class="status-pill ${log.action.includes('Enter') ? 'low' : 'high'}">
                                                    <span class="dot-sm"></span>
                                                    ${log.action}
                                                </span>
                                            </td>
                                            <td style="font-family:monospace;">${log.vehicle}</td>
                                            <td>${log.zone}</td>
                                            <td>
                                                <div style="display:flex;align-items:center;gap:8px;">
                                                    <div style="width:60px;height:4px;background:var(--bg-tertiary);border-radius:2px;">
                                                        <div style="width:${log.confidence}%;height:100%;background:var(--success);border-radius:2px;"></div>
                                                    </div>
                                                    <span style="font-size:12px;font-weight:600;">${log.confidence}%</span>
                                                </div>
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
        // Hourly chart
        const hourlyEl = document.getElementById('hourlyChart');
        if (hourlyEl) {
            Charts.createLineChart(hourlyEl,
                this.getSeries(),
                { color: '#6366f1', height: 280 }
            );
        }

        // Donut chart
        const donutEl = document.getElementById('occupancyDonut');
        if (donutEl) {
            Charts.createDonutChart(donutEl, [
                { label: 'Occupied', value: DummyData.overview.occupied, color: '#ef4444' },
                { label: 'Available', value: DummyData.overview.available, color: '#10b981' },
                { label: 'Reserved', value: DummyData.overview.reserved, color: '#f59e0b' },
                { label: 'Disabled', value: DummyData.overview.disabled, color: '#64748b' },
            ], {
                centerText: DummyData.getOccupancyPercentage() + '%',
                centerLabel: 'Occupied',
            });
        }

        // Weekly chart
        const weeklyEl = document.getElementById('weeklyChart');
        if (weeklyEl) {
            Charts.createBarChart(weeklyEl,
                DummyData.weeklyOccupancy.map(w => ({
                    label: w.day,
                    value: w.avg,
                    color: w.avg >= 80 ? 'danger' : w.avg >= 60 ? 'warning' : 'success',
                })),
                { height: 260 }
            );
        }
    },

    setView(view) {
        this.currentView = view;
        document.querySelectorAll('.filter-btn[aria-pressed]').forEach(button => {
            const selected = button.getAttribute('onclick').includes(`'${view}'`);
            button.classList.toggle('active', selected);
            button.setAttribute('aria-pressed', String(selected));
        });

        const chart = document.getElementById('hourlyChart');
        if (chart) Charts.createLineChart(chart, this.getSeries(view), { color: '#6366f1', height: 280 });
    },

    setLogFilter(filter) {
        this.currentLogFilter = filter;
        App.loadPage('dashboard');
    },

    getFilteredLog() {
        if (this.currentLogFilter === 'all') return DummyData.detectionLog;
        const action = this.currentLogFilter === 'entry' ? 'Entered' : 'Exited';
        return DummyData.detectionLog.filter(item => item.action.includes(action));
    },

    getSeries(view = this.currentView) {
        return view === 'today'
            ? DummyData.hourlyOccupancy.map(item => ({ label: item.hour, value: item.occupancy }))
            : view === 'week'
                ? DummyData.weeklyOccupancy.map(item => ({ label: item.day, value: item.avg }))
                : DummyData.monthlyTrend.map(item => ({ label: item.month, value: item.occupancy }));
    }
};