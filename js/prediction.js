// ============================================
// PREDICTIONS PAGE
// ============================================

const PredictionsPage = {
    currentPeriod: 'nextHours',

    render() {
        const pred = DummyData.predictions;
        const periodLabel = this.getPeriodLabel();

        return `
            <div class="fade-in">
                <!-- Hero Section -->
                <div class="prediction-hero">
                    <div class="prediction-hero-content">
                        <h2>🤖 AI Parking Availability Prediction</h2>
                        <p>Illustrative forecasts from bundled sample data. No prediction service is connected.</p>
                        <div class="prediction-controls">
                            <select class="prediction-select" aria-label="Forecast period" onchange="PredictionsPage.setPeriod(this.value)">
                                <option value="nextHours" ${this.currentPeriod === 'nextHours' ? 'selected' : ''}>Next 6 Hours</option>
                                <option value="today" ${this.currentPeriod === 'today' ? 'selected' : ''}>Today</option>
                                <option value="week" ${this.currentPeriod === 'week' ? 'selected' : ''}>This Week</option>
                            </select>
                            <span class="prediction-data-note">Fixed sample forecast</span>
                        </div>
                    </div>
                </div>

                <!-- Prediction Timeline -->
                <h3 style="font-size:16px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;color:var(--primary-light);">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                    </svg>
                    Next 6 Hours Forecast
                </h3>
                <div class="prediction-timeline">
                    ${pred.nextHours.map((p, i) => {
            const color = p.occupancy >= 85 ? 'var(--danger)' : p.occupancy >= 60 ? 'var(--warning)' : 'var(--success)';
            return `
                            <div class="prediction-time-card ${i === 0 ? 'active' : ''}" onclick="PredictionsPage.selectHour(this)">
                                <div class="pred-time">${p.time}</div>
                                <div class="pred-percentage" style="color:${color};">${p.occupancy}%</div>
                                <div class="pred-slots">${p.available} slots available</div>
                                <div class="pred-confidence">
                                    <span>Conf:</span>
                                    <div class="confidence-bar">
                                        <div class="confidence-fill" style="width:${p.confidence}%"></div>
                                    </div>
                                    <span>${p.confidence}%</span>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>

                <!-- Model Metrics -->
                <h3 style="font-size:16px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;color:var(--success);">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Sample Model Metrics
                </h3>
                <div class="model-metrics">
                    <div class="metric-card good">
                        <div class="metric-value">${pred.modelMetrics.accuracy}%</div>
                        <div class="metric-label">Overall Accuracy</div>
                    </div>
                    <div class="metric-card warn">
                        <div class="metric-value">${pred.modelMetrics.mae}%</div>
                        <div class="metric-label">Mean Absolute Error</div>
                    </div>
                    <div class="metric-card info">
                        <div class="metric-value">${pred.modelMetrics.rmse}%</div>
                        <div class="metric-label">RMSE</div>
                    </div>
                    <div class="metric-card good">
                        <div class="metric-value">${pred.modelMetrics.r2Score}</div>
                        <div class="metric-label">R² Score</div>
                    </div>
                </div>

                <!-- Charts Row -->
                <div class="content-grid-equal">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <span class="dot purple"></span>
                                Sample Forecast vs Observed Pattern
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="predVsActualChart" class="chart-container"></div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <span class="dot green"></span>
                                ${periodLabel} Pattern
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="tomorrowForecast" class="chart-container"></div>
                        </div>
                    </div>
                </div>

                <!-- Tomorrow's Summary -->
                <div class="content-grid-equal">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <span class="dot red"></span>
                                Tomorrow's Key Insights
                            </div>
                        </div>
                        <div class="card-body">
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                                <div style="text-align:center;padding:20px;background:var(--danger-bg);border-radius:var(--radius-md);">
                                    <div style="font-size:28px;font-weight:800;color:var(--danger);">${pred.tomorrow.peakTime}</div>
                                    <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Expected Peak Time</div>
                                    <div style="font-size:16px;font-weight:700;color:var(--danger);margin-top:8px;">${pred.tomorrow.peakOccupancy}% Full</div>
                                </div>
                                <div style="text-align:center;padding:20px;background:var(--success-bg);border-radius:var(--radius-md);">
                                    <div style="font-size:28px;font-weight:800;color:var(--success);">${pred.tomorrow.bestTime}</div>
                                    <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Best Time to Park</div>
                                    <div style="font-size:16px;font-weight:700;color:var(--success);margin-top:8px;">${pred.tomorrow.bestAvailability}% Available</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <span class="dot blue"></span>
                                Model Information
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="slot-detail-info">
                                <div class="detail-row">
                                    <span class="detail-label">Data Source</span>
                                    <span class="detail-value">Bundled demo sample</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Training Data</span>
                                    <span class="detail-value">Example metadata only</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Last Trained</span>
                                    <span class="detail-value">Today, 6:00 AM</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Features Used</span>
                                    <span class="detail-value">12 features</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Prediction Horizon</span>
                                    <span class="detail-value">6 hours ahead</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Framework</span>
                                    <span class="detail-value">Scikit-learn / PyTorch</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        // Fixed sample forecast compared with the bundled occupancy pattern.
        const predEl = document.getElementById('predVsActualChart');
        if (predEl) {
            Charts.createMultiLineChart(predEl, [
                {
                    label: 'Observed sample',
                    color: '#6366f1',
                    data: DummyData.hourlyOccupancy.slice(0, 6).map(h => ({ label: h.hour, value: h.occupancy }))
                },
                {
                    label: 'Forecast sample',
                    color: '#f59e0b',
                    dashed: true,
                    data: DummyData.predictions.nextHours.map(item => ({ label: item.time, value: item.occupancy }))
                },
            ], { height: 280 });
        }

        const periodChart = document.getElementById('tomorrowForecast');
        if (periodChart) {
            Charts.createLineChart(periodChart, this.getSelectedSeries(), {
                color: '#8b5cf6',
                height: 280,
            });
        }
    },

    getSelectedSeries() {
        if (this.currentPeriod === 'today') {
            return DummyData.hourlyOccupancy.map(item => ({ label: item.hour, value: item.occupancy }));
        }
        if (this.currentPeriod === 'week') {
            return DummyData.weeklyOccupancy.map(item => ({ label: item.day, value: item.avg }));
        }
        return DummyData.predictions.nextHours.map(item => ({ label: item.time, value: item.occupancy }));
    },

    getPeriodLabel() {
        return this.currentPeriod === 'today'
            ? 'Today'
            : this.currentPeriod === 'week' ? 'This Week' : 'Next 6 Hours';
    },

    setPeriod(period) {
        this.currentPeriod = period;
        App.loadPage('predictions');
    },

    selectHour(el) {
        document.querySelectorAll('.prediction-time-card').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
    },

};