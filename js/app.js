// ============================================
// MAIN APPLICATION CONTROLLER
// ============================================

const App = {
    currentPage: 'dashboard',
    refreshInterval: null,
    theme: 'dark',
    searchResults: [],

    init() {
        this.initTheme();
        this.bindNavigation();
        this.bindSearch();
        this.bindMenuToggle();
        this.restoreAlerts();
        this.updateAlertBadge();
        this.loadPage('dashboard');
        this.startAutoRefresh();
        this.showToast('Demo mode loaded. Showing sample data.', 'info');
    },

    initTheme() {
        try {
            this.theme = localStorage.getItem('smartpark-theme') === 'light' ? 'light' : 'dark';
        } catch {
            this.theme = 'dark';
        }

        document.documentElement.dataset.theme = this.theme;
        document.addEventListener('change', (event) => {
            if (event.target.id === 'darkModeToggle') {
                this.setTheme(event.target.checked ? 'dark' : 'light');
            }
        });
    },

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.dataset.theme = theme;

        try {
            localStorage.setItem('smartpark-theme', theme);
        } catch {
            // Theme remains active for the current page when storage is unavailable.
        }
    },

    bindNavigation() {
        document.querySelectorAll('.menu-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.loadPage(page);

                // Close mobile sidebar
                document.getElementById('sidebar').classList.remove('open');
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) overlay.classList.remove('visible');
            });
        });

        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshBtn.querySelector('svg').classList.add('spin');
                setTimeout(() => {
                    refreshBtn.querySelector('svg').classList.remove('spin');
                    this.loadPage(this.currentPage);
                    this.showToast('View refreshed. Sample data is unchanged.', 'info');
                }, 800);
            });
        }
    },

    bindSearch() {
        const input = document.getElementById('globalSearch');
        const results = document.getElementById('searchResults');
        if (!input || !results) return;

        input.addEventListener('input', () => {
            const query = input.value.trim().toLowerCase();
            this.searchResults = query ? this.getSearchItems().filter(item =>
                `${item.title} ${item.detail}`.toLowerCase().includes(query)
            ).slice(0, 12) : [];
            this.renderSearchResults();
        });

        results.addEventListener('click', (event) => {
            const option = event.target.closest('[data-search-result]');
            if (option) this.openSearchResult(Number(option.dataset.searchResult));
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.search-box')) this.closeSearchResults();
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') this.closeSearchResults();
        });
    },

    updateAlertBadge() {
        const unreadCount = DummyData.alerts.filter(alert => !alert.read && !alert.dismissed).length;
        const badge = document.querySelector('.badge-count');
        const notificationDot = document.querySelector('.notification-dot');
        if (badge) {
            badge.textContent = unreadCount;
            badge.hidden = unreadCount === 0;
        }
        if (notificationDot) notificationDot.hidden = unreadCount === 0;
    },

    restoreAlerts() {
        try {
            const saved = JSON.parse(localStorage.getItem('smartpark-alerts') || '{}');
            DummyData.alerts.forEach(alert => {
                if (!saved[alert.id]) return;
                alert.read = Boolean(saved[alert.id].read);
                alert.dismissed = Boolean(saved[alert.id].dismissed);
            });
        } catch {
            // Keep bundled alert state if saved state is unavailable or invalid.
        }
    },

    saveAlerts() {
        const state = Object.fromEntries(DummyData.alerts.map(alert => [alert.id, {
            read: Boolean(alert.read),
            dismissed: Boolean(alert.dismissed),
        }]));

        try {
            localStorage.setItem('smartpark-alerts', JSON.stringify(state));
        } catch {
            this.showToast('Alert changes apply for this session only.', 'warning');
        }
    },

    markAllAlertsRead() {
        DummyData.alerts.forEach(alert => {
            if (!alert.dismissed) alert.read = true;
        });
        this.saveAlerts();
        this.updateAlertBadge();
        this.loadPage('alerts');
        this.showToast('All alerts marked as read.', 'success');
    },

    dismissAlert(alertId) {
        const alert = DummyData.alerts.find(item => item.id === alertId);
        if (!alert) return;

        alert.dismissed = true;
            this.saveAlerts();
        this.updateAlertBadge();
        this.loadPage('alerts');
        this.showToast('Alert dismissed.', 'success');
    },

    viewAlert(alertId) {
        const alert = DummyData.alerts.find(item => item.id === alertId);
        if (!alert) return;

        alert.read = true;
            this.saveAlerts();
        this.updateAlertBadge();
        this.loadPage('alerts');
        setTimeout(() => {
            document.querySelector(`[data-search-id="alert-${alertId}"]`)?.scrollIntoView({ block: 'center' });
        }, 0);
    },

    getSearchItems() {
        const slots = Object.entries(DummyData.parkingSlots).flatMap(([floor, floorSlots]) =>
            floorSlots.map(slot => ({
                title: `Slot ${slot.id}`,
                detail: `${slot.status} · Floor ${floor.slice(-1)}`,
                page: 'parking-map',
                kind: 'slot',
                id: slot.id,
                floor,
            }))
        );
        const zones = DummyData.zones.map((zone, index) => ({
            title: zone.name,
            detail: `${zone.occupied} occupied · ${zone.available} available`,
            page: 'zones',
            target: `zone-${index}`,
        }));
        const cameras = DummyData.cameras.map(camera => ({
            title: `${camera.id} · ${camera.name}`,
            detail: `${camera.status} · ${camera.location}`,
            page: 'cameras',
            target: `camera-${camera.id}`,
        }));
        const alerts = DummyData.alerts.filter(alert => !alert.dismissed).map(alert => ({
            title: alert.title,
            detail: `${alert.type} · ${alert.zone}`,
            page: 'alerts',
            target: `alert-${alert.id}`,
        }));
        const log = DummyData.detectionLog.map((entry, index) => ({
            title: `${entry.slot} · ${entry.action}`,
            detail: `${entry.vehicle} · ${entry.zone}`,
            page: 'dashboard',
            target: `log-${index}`,
        }));
        return [...slots, ...zones, ...cameras, ...alerts, ...log];
    },

    renderSearchResults() {
        const input = document.getElementById('globalSearch');
        const panel = document.getElementById('searchResults');
        if (!input || !panel) return;

        panel.hidden = !input.value.trim();
        input.setAttribute('aria-expanded', String(!panel.hidden));
        if (panel.hidden) return;

        panel.innerHTML = this.searchResults.length
            ? this.searchResults.map((item, index) => `
                <button type="button" class="search-result" role="option" data-search-result="${index}">
                    <span class="search-result-title">${item.title}</span>
                    <span class="search-result-detail">${item.detail}</span>
                </button>
            `).join('')
            : '<p class="search-empty">No matching parking records</p>';
    },

    closeSearchResults() {
        const input = document.getElementById('globalSearch');
        const panel = document.getElementById('searchResults');
        if (panel) panel.hidden = true;
        if (input) input.setAttribute('aria-expanded', 'false');
    },

    openSearchResult(index) {
        const result = this.searchResults[index];
        if (!result) return;

        this.closeSearchResults();
        if (result.kind === 'slot') {
            ParkingMapPage.currentFloor = result.floor;
            ParkingMapPage.currentFilter = 'all';
            this.loadPage('parking-map');
            setTimeout(() => ParkingMapPage.selectSlot(result.id), 50);
            return;
        }

        this.loadPage(result.page);
        setTimeout(() => {
            const target = [...document.querySelectorAll('[data-search-id]')]
                .find(element => element.dataset.searchId === result.target);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                target.classList.add('search-highlight');
                target.focus({ preventScroll: true });
                setTimeout(() => target.classList.remove('search-highlight'), 1800);
            }
        }, 50);
    },

    bindMenuToggle() {
        const toggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        if (toggle) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('visible');
            });
        }

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
        });
    },

    loadPage(pageName) {
        this.currentPage = pageName;
        const contentArea = document.getElementById('contentArea');
        const pageTitle = document.getElementById('pageTitle');
        const pageBreadcrumb = document.getElementById('pageBreadcrumb');

        // Update active nav
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pageName) {
                item.classList.add('active');
            }
        });

        // Page titles
        const titles = {
            'dashboard': { title: 'Dashboard', breadcrumb: 'Home / Dashboard' },
            'parking-map': { title: 'Parking Map', breadcrumb: 'Home / Parking Map' },
            'analytics': { title: 'Analytics', breadcrumb: 'Home / Analytics' },
            'predictions': { title: 'AI Predictions', breadcrumb: 'Home / Predictions' },
            'zones': { title: 'Parking Zones', breadcrumb: 'Management / Zones' },
            'cameras': { title: 'Camera Management', breadcrumb: 'Management / Cameras' },
            'alerts': { title: 'Alerts & Notifications', breadcrumb: 'Management / Alerts' },
            'settings': { title: 'Settings', breadcrumb: 'Management / Settings' },
        };

        const pageInfo = titles[pageName] || { title: 'Dashboard', breadcrumb: 'Home' };
        pageTitle.textContent = pageInfo.title;
        pageBreadcrumb.textContent = pageInfo.breadcrumb;

        // Render page
        switch (pageName) {
            case 'dashboard':
                contentArea.innerHTML = DashboardPage.render();
                setTimeout(() => DashboardPage.init(), 50);
                break;

            case 'parking-map':
                contentArea.innerHTML = ParkingMapPage.render();
                setTimeout(() => ParkingMapPage.init(), 50);
                break;

            case 'analytics':
                contentArea.innerHTML = AnalyticsPage.render();
                setTimeout(() => AnalyticsPage.init(), 50);
                break;

            case 'predictions':
                contentArea.innerHTML = PredictionsPage.render();
                setTimeout(() => PredictionsPage.init(), 50);
                break;

            case 'zones':
                contentArea.innerHTML = this.renderZonesPage();
                break;

            case 'cameras':
                contentArea.innerHTML = this.renderCamerasPage();
                break;

            case 'alerts':
                contentArea.innerHTML = this.renderAlertsPage();
                break;

            case 'settings':
                contentArea.innerHTML = this.renderSettingsPage();
                break;

            default:
                contentArea.innerHTML = DashboardPage.render();
                setTimeout(() => DashboardPage.init(), 50);
        }

        if (pageName === 'settings') this.restoreSettings();

        // Scroll to top
        contentArea.scrollTop = 0;
        window.scrollTo(0, 0);
    },

    // =====================
    // ZONES PAGE
    // =====================
    renderZonesPage() {
        return `
            <div class="fade-in">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
                    <p style="font-size:14px;color:var(--text-muted);">Manage and monitor all parking zones</p>
                    <button class="settings-btn primary" onclick="App.showToast('Add Zone feature — coming soon','info')">
                        + Add Zone
                    </button>
                </div>
                <div class="zones-grid">
                    ${DummyData.zones.map((zone, index) => {
            const pct = Math.round((zone.occupied / zone.total) * 100);
            const color = DummyData.getOccupancyColor(pct);
            return `
                            <div class="zone-card" data-search-id="zone-${index}" tabindex="-1">
                                <div class="zone-header">
                                    <div class="zone-name">${zone.name}</div>
                                    <div class="zone-type ${zone.type}">${zone.type}</div>
                                </div>
                                <div class="zone-stats">
                                    <div class="zone-stat">
                                        <span class="zone-stat-label">Total</span>
                                        <span class="zone-stat-value">${zone.total}</span>
                                    </div>
                                    <div class="zone-stat">
                                        <span class="zone-stat-label">Occupied</span>
                                        <span class="zone-stat-value" style="color:var(--danger);">${zone.occupied}</span>
                                    </div>
                                    <div class="zone-stat">
                                        <span class="zone-stat-label">Available</span>
                                        <span class="zone-stat-value" style="color:var(--success);">${zone.available}</span>
                                    </div>
                                    <div class="zone-stat">
                                        <span class="zone-stat-label">Camera</span>
                                        <span class="zone-stat-value">${zone.camera}</span>
                                    </div>
                                </div>
                                <div class="progress-bar-container" style="margin-top:0;">
                                    <div class="progress-bar-label">
                                        <span>Occupancy</span>
                                        <span>${pct}%</span>
                                    </div>
                                    <div class="progress-bar-track">
                                        <div class="progress-bar-fill ${color}" style="width:${pct}%;"></div>
                                    </div>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    },

    // =====================
    // CAMERAS PAGE
    // =====================
    renderCamerasPage() {
        return `
            <div class="fade-in">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
                    <p style="font-size:14px;color:var(--text-muted);">Monitor camera feeds and detection status</p>
                    <button class="settings-btn primary" onclick="App.showToast('Add Camera feature — coming soon','info')">
                        + Add Camera
                    </button>
                </div>
                <div class="cameras-grid">
                    ${DummyData.cameras.map(cam => `
                        <div class="camera-card" data-search-id="camera-${cam.id}" tabindex="-1">
                            <div class="camera-preview">
                                <div class="camera-live-badge ${cam.status}">
                                    ${cam.status === 'online' ? '<span class="rec-dot"></span> SAMPLE' : 'OFFLINE · SAMPLE'}
                                </div>
                                <div class="camera-preview-content">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                        <circle cx="12" cy="13" r="4"/>
                                    </svg>
                                    <span>${cam.id} Feed</span>
                                </div>
                            </div>
                            <div class="camera-info">
                                <div class="camera-name">${cam.name}</div>
                                <div class="camera-location">${cam.location}</div>
                                <div class="camera-meta">
                                    <div class="camera-meta-item">
                                        <span class="camera-meta-label">Resolution</span>
                                        <span class="camera-meta-value">${cam.resolution}</span>
                                    </div>
                                    <div class="camera-meta-item">
                                        <span class="camera-meta-label">FPS</span>
                                        <span class="camera-meta-value">${cam.fps}</span>
                                    </div>
                                    <div class="camera-meta-item">
                                        <span class="camera-meta-label">Detection</span>
                                        <span class="camera-meta-value" style="color:${cam.detectionRate > 0 ? 'var(--success)' : 'var(--danger)'};">
                                            ${cam.detectionRate > 0 ? cam.detectionRate + '%' : 'N/A'}
                                        </span>
                                    </div>
                                    <div class="camera-meta-item">
                                        <span class="camera-meta-label">Uptime</span>
                                        <span class="camera-meta-value">${cam.uptime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // =====================
    // ALERTS PAGE
    // =====================
    renderAlertsPage() {
        return `
            <div class="fade-in">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
                    <div>
                        <p style="font-size:14px;color:var(--text-muted);">
                            ${DummyData.alerts.filter(a => !a.read && !a.dismissed).length} unread alerts
                        </p>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button class="settings-btn outline" onclick="App.markAllAlertsRead()">
                            Mark All Read
                        </button>
                        <button class="settings-btn outline" onclick="App.loadPage('settings')">
                            Settings
                        </button>
                    </div>
                </div>
                <div class="alerts-list">
                    ${DummyData.alerts.filter(alert => !alert.dismissed).length
                ? DummyData.alerts.filter(alert => !alert.dismissed).map(alert => `
                        <div class="alert-item ${alert.read ? '' : 'unread'}" data-search-id="alert-${alert.id}" tabindex="-1">
                            <div class="alert-type-icon ${alert.type}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    ${alert.type === 'critical'
                ? '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
                : alert.type === 'warning'
                    ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
                    : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'}
                                </svg>
                            </div>
                            <div class="alert-content">
                                <div class="alert-title">${alert.title}</div>
                                <div class="alert-desc">${alert.desc}</div>
                                <div class="alert-meta">
                                    <span>🕐 ${alert.time}</span>
                                    <span>📍 ${alert.zone}</span>
                                </div>
                            </div>
                            <div class="alert-actions">
                                <button class="alert-action-btn" onclick="App.dismissAlert(${alert.id})">Dismiss</button>
                                <button class="alert-action-btn primary" onclick="App.viewAlert(${alert.id})">View</button>
                            </div>
                        </div>
                    `).join('')
                : '<p class="search-empty">No active alerts.</p>'}
                </div>
            </div>
        `;
    },

    // =====================
    // SETTINGS PAGE
    // =====================
    getSettingsControls() {
        return [...document.querySelectorAll('.settings-content .setting-item')].flatMap(row => {
            const control = row.querySelector('input, select');
            const label = row.querySelector('.setting-label')?.textContent.trim();
            if (!control || !label || control.disabled || control.id === 'darkModeToggle') return [];

            return [{
                key: label.toLowerCase().replace(/\s+/g, '-'),
                control,
            }];
        });
    },

    restoreSettings() {
        try {
            const saved = JSON.parse(localStorage.getItem('smartpark-settings') || '{}');
            this.getSettingsControls().forEach(({ key, control }) => {
                if (!(key in saved)) return;
                if (control.type === 'checkbox') control.checked = saved[key];
                else control.value = saved[key];
            });
        } catch {
            this.showToast('Saved settings could not be loaded.', 'warning');
        }
    },

    saveSettings() {
        const settings = Object.fromEntries(this.getSettingsControls().map(({ key, control }) => [
            key,
            control.type === 'checkbox' ? control.checked : control.value,
        ]));

        try {
            localStorage.setItem('smartpark-settings', JSON.stringify(settings));
            this.showToast('Settings saved on this device.', 'success');
        } catch {
            this.showToast('Settings could not be saved in this browser.', 'error');
        }
    },

    renderSettingsPage() {
        return `
            <div class="fade-in">
                <div class="settings-layout">
                    <div class="settings-nav">
                        <button class="settings-nav-item active">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                            </svg>
                            General
                        </button>
                        <button class="settings-nav-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                            </svg>
                            Notifications
                        </button>
                        <button class="settings-nav-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            Security
                        </button>
                        <button class="settings-nav-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 6v6l4 2"/>
                            </svg>
                            AI Model
                        </button>
                        <button class="settings-nav-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="16 18 22 12 16 6"/>
                                <polyline points="8 6 2 12 8 18"/>
                            </svg>
                            API
                        </button>
                    </div>

                    <div class="settings-content">
                        <!-- General Settings -->
                        <div class="settings-section">
                            <div class="settings-section-title">General Settings</div>
                            <div class="settings-section-desc">Configure basic system parameters</div>
                            <div class="settings-group">
                                <div class="setting-item">
                                    <div class="setting-label-area">
                                        <span class="setting-label">Live Data Refresh</span>
                                        <span class="setting-desc">Requires a live data connection; sample values stay fixed</span>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" disabled aria-label="Live data refresh unavailable in demo mode">
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <div class="setting-label-area">
                                        <span class="setting-label">Refresh Interval</span>
                                        <span class="setting-desc">Data polling interval in seconds</span>
                                    </div>
                                    <select class="settings-select">
                                        <option>10 seconds</option>
                                        <option selected>30 seconds</option>
                                        <option>60 seconds</option>
                                        <option>120 seconds</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <div class="setting-label-area">
                                        <span class="setting-label">Timezone</span>
                                        <span class="setting-desc">Set the system timezone</span>
                                    </div>
                                    <select class="settings-select">
                                        <option selected>IST (UTC+5:30)</option>
                                        <option>UTC</option>
                                        <option>EST (UTC-5)</option>
                                        <option>PST (UTC-8)</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <div class="setting-label-area">
                                        <span class="setting-label">Dark Mode</span>
                                        <span class="setting-desc">Toggle between dark and light themes</span>
                                    </div>
                                    <label class="toggle-switch">
                                        <input id="darkModeToggle" type="checkbox" aria-label="Enable dark mode" ${this.theme === 'dark' ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Detection Settings -->
                        <div class="settings-section">
                            <div class="settings-section-title">Detection Settings</div>
                            <div class="settings-section-desc">Configure AI detection parameters</div>
                            <div class="settings-group">
                                <div class="setting-item">
                                    <div class="setting-label-area">
                                        <span class="setting-label">Detection Model</span>
                                        <span class="setting-desc">Select the YOLO model version</span>
                                    </div>
                                    <select class="settings-select">
                                        <option>YOLOv5s</option>
                                        <option selected>YOLOv8m</option>
                                        <option>YOLOv8l</option>
                                        <option>YOLOv9</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <div class="setting-label-area">
                                        <span class="setting-label">Confidence Threshold</span>
                                        <span class="setting-desc">Minimum confidence score for detection</span>
                                    </div>
                                    <input type="number" class="settings-input" value="0.75" step="0.05" min="0" max="1" style="width:100px;">
                                </div>
                                <div class="setting-item">
                                    <div class="setting-label-area">
                                        <span class="setting-label">IoU Threshold</span>
                                        <span class="setting-desc">Intersection over Union threshold for NMS</span>
                                    </div>
                                    <input type="number" class="settings-input" value="0.45" step="0.05" min="0" max="1" style="width:100px;">
                                </div>
                                <div class="setting-item">
                                    <div class="setting-label-area">
                                        <span class="setting-label">GPU Acceleration</span>
                                        <span class="setting-desc">Use GPU for faster inference</span>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Notification Settings -->
                        <div class="settings-section">
                            <div class="settings-section-title">Alert Thresholds</div>
                            <div class="settings-section-desc">Configure when alerts are triggered</div>
                            <div class="settings-group">
                                <div class="setting-item">
                                    <div class="setting-label-area">
                                        <span class="setting-label">High Occupancy Alert</span>
                                        <span class="setting-desc">Alert when occupancy exceeds threshold</span>
                                    </div>
                                    <input type="number" class="settings-input" value="85" style="width:80px;"> <span style="font-size:13px;color:var(--text-muted);margin-left:4px;">%</span>
                                </div>
                                <div class="setting-item">
                                    <div class="setting-label-area">
                                        <span class="setting-label">Camera Offline Alert</span>
                                        <span class="setting-desc">Alert when camera goes offline</span>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <div class="setting-label-area">
                                        <span class="setting-label">Email Notifications</span>
                                        <span class="setting-desc">Send alerts via email</span>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox">
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Save Actions -->
                        <div style="display:flex;gap:12px;justify-content:flex-end;">
                            <button class="settings-btn outline" onclick="App.restoreSettings()">Cancel</button>
                            <button class="settings-btn primary" onclick="App.saveSettings()">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // =====================
    // TOAST NOTIFICATIONS
    // =====================
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const iconPaths = {
            success: '<polyline points="20 6 9 17 4 12"/>',
            error: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
            warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
            info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
        };

        toast.innerHTML = `
            <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${iconPaths[type] || iconPaths.info}
            </svg>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        `;

        container.appendChild(toast);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'fadeIn 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    },

    // =====================
    // AUTO REFRESH
    // =====================
    startAutoRefresh() {
        this.refreshInterval = null;
    },

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});