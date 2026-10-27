// ============================================
// PARKING MAP PAGE
// ============================================

const ParkingMapPage = {
    currentFloor: 'floorA',
    currentFilter: 'all',
    selectedSlot: null,

    render() {
        const data = DummyData;
        const floorStats = data.getFloorStats(this.currentFloor);
        const occupancyPct = Math.round((floorStats.occupied / floorStats.total) * 100);

        return `
            <div class="fade-in">
                <div class="parking-layout">
                    <!-- Main Grid -->
                    <div class="parking-grid-container">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                            <div class="parking-floor-tabs">
                                <button class="floor-tab ${this.currentFloor === 'floorA' ? 'active' : ''}" 
                                        onclick="ParkingMapPage.switchFloor('floorA')">Floor A</button>
                                <button class="floor-tab ${this.currentFloor === 'floorB' ? 'active' : ''}"
                                        onclick="ParkingMapPage.switchFloor('floorB')">Floor B</button>
                                <button class="floor-tab ${this.currentFloor === 'floorC' ? 'active' : ''}"
                                        onclick="ParkingMapPage.switchFloor('floorC')">Floor C</button>
                            </div>
                            <div style="display:flex;align-items:center;gap:16px;">
                                <div style="display:flex;align-items:center;gap:6px;">
                                    <div style="width:12px;height:12px;border-radius:3px;background:var(--success-bg);border:1px solid rgba(16,185,129,0.3);"></div>
                                    <span style="font-size:12px;color:var(--text-muted);">Available</span>
                                </div>
                                <div style="display:flex;align-items:center;gap:6px;">
                                    <div style="width:12px;height:12px;border-radius:3px;background:var(--danger-bg);border:1px solid rgba(239,68,68,0.3);"></div>
                                    <span style="font-size:12px;color:var(--text-muted);">Occupied</span>
                                </div>
                                <div style="display:flex;align-items:center;gap:6px;">
                                    <div style="width:12px;height:12px;border-radius:3px;background:var(--warning-bg);border:1px solid rgba(245,158,11,0.3);"></div>
                                    <span style="font-size:12px;color:var(--text-muted);">Reserved</span>
                                </div>
                            </div>
                        </div>

                        <div class="parking-map-controls">
                            <label for="parkingStatusFilter">Show slots</label>
                            <select id="parkingStatusFilter" class="settings-select" onchange="ParkingMapPage.setFilter(this.value)">
                                <option value="all" ${this.currentFilter === 'all' ? 'selected' : ''}>All statuses</option>
                                <option value="available" ${this.currentFilter === 'available' ? 'selected' : ''}>Available</option>
                                <option value="occupied" ${this.currentFilter === 'occupied' ? 'selected' : ''}>Occupied</option>
                                <option value="reserved" ${this.currentFilter === 'reserved' ? 'selected' : ''}>Reserved</option>
                                <option value="disabled" ${this.currentFilter === 'disabled' ? 'selected' : ''}>Disabled</option>
                            </select>
                            <span id="parkingResultCount" aria-live="polite">${this.getVisibleSlots().length} slots</span>
                        </div>

                        <div class="parking-grid" id="parkingGrid">
                            ${this.renderSlots()}
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="parking-sidebar">
                        <!-- Summary -->
                        <div class="parking-summary-card">
                            <div class="summary-title">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;color:var(--primary-light);">
                                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                                    <line x1="3" y1="9" x2="21" y2="9"/>
                                </svg>
                                Floor Summary
                            </div>
                            <div class="summary-stats">
                                <div class="summary-stat-item">
                                    <div class="summary-stat-label">
                                        <span class="indicator" style="background:var(--primary);"></span>
                                        Total Slots
                                    </div>
                                    <div class="summary-stat-value">${floorStats.total}</div>
                                </div>
                                <div class="summary-stat-item">
                                    <div class="summary-stat-label">
                                        <span class="indicator" style="background:var(--success);"></span>
                                        Available
                                    </div>
                                    <div class="summary-stat-value" style="color:var(--success);">${floorStats.available}</div>
                                </div>
                                <div class="summary-stat-item">
                                    <div class="summary-stat-label">
                                        <span class="indicator" style="background:var(--danger);"></span>
                                        Occupied
                                    </div>
                                    <div class="summary-stat-value" style="color:var(--danger);">${floorStats.occupied}</div>
                                </div>
                                <div class="summary-stat-item">
                                    <div class="summary-stat-label">
                                        <span class="indicator" style="background:var(--warning);"></span>
                                        Reserved
                                    </div>
                                    <div class="summary-stat-value" style="color:var(--warning);">${floorStats.reserved}</div>
                                </div>
                            </div>

                            <div class="progress-bar-container">
                                <div class="progress-bar-label">
                                    <span>Occupancy</span>
                                    <span>${occupancyPct}%</span>
                                </div>
                                <div class="progress-bar-track">
                                    <div class="progress-bar-fill ${DummyData.getOccupancyColor(occupancyPct)}" 
                                         style="width: ${occupancyPct}%"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Slot Detail -->
                        <div class="slot-detail-panel" id="slotDetailPanel">
                            <div class="slot-detail-header">
                                <div class="slot-detail-id" id="detailSlotId">--</div>
                                <div class="slot-detail-badge" id="detailSlotBadge">--</div>
                            </div>
                            <div class="slot-detail-info" id="detailSlotInfo">
                                <p style="font-size:13px;color:var(--text-muted);text-align:center;padding:20px 0;">
                                    Click on a slot to see details
                                </p>
                            </div>
                        </div>

                        <!-- Recent Activity -->
                        <div class="parking-summary-card">
                            <div class="summary-title">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;color:var(--primary-light);">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                                Recent Sample Activity
                            </div>
                            <div class="activity-list">
                                ${DummyData.recentActivities.slice(0, 5).map(a => `
                                    <div class="activity-item" style="padding:8px 0;">
                                        <div class="activity-icon ${a.type}" style="width:30px;height:30px;">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                                                ${a.type === 'enter'
                ? '<polyline points="9 18 15 12 9 6"/>'
                : '<polyline points="15 18 9 12 15 6"/>'}
                                            </svg>
                                        </div>
                                        <div class="activity-info">
                                            <div class="activity-text" style="font-size:12px;">${a.slot} · ${a.type === 'enter' ? 'Entry' : 'Exit'}</div>
                                            <div class="activity-time" style="font-size:10px;">${a.time}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderSlots() {
        const slots = this.getVisibleSlots();
        if (!slots.length) return '<p class="parking-empty-state">No slots match this status on the selected floor.</p>';

        return slots.map(slot => `
            <button type="button" class="parking-slot ${slot.status} ${this.selectedSlot?.id === slot.id ? 'selected' : ''}"
                 data-slot-id="${slot.id}" aria-pressed="${this.selectedSlot?.id === slot.id}"
                  ${slot.status === 'disabled' ? 'disabled' : ''}
                 onclick="ParkingMapPage.selectSlot('${slot.id}')"
                 aria-label="Slot ${slot.id}, ${slot.status}, floor ${this.currentFloor.slice(-1)}"
                 title="${slot.id} - ${slot.status}">
                ${slot.status === 'occupied' ? `
                    <svg class="car-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                ` : `
                    <svg class="car-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:0.5;">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                `}
                <span class="slot-id">${slot.id}</span>
                <span class="slot-status-text">${slot.status}</span>
            </button>
        `).join('');
    },

    getVisibleSlots() {
        const slots = DummyData.getSlotsByFloor(this.currentFloor);
        return this.currentFilter === 'all'
            ? slots
            : slots.filter(slot => slot.status === this.currentFilter);
    },

    setFilter(status) {
        this.currentFilter = status;
        this.selectedSlot = null;
        App.loadPage('parking-map');
    },

    switchFloor(floor) {
        this.currentFloor = floor;
        this.selectedSlot = null;
        App.loadPage('parking-map');
    },

    selectSlot(slotId) {
        const slots = DummyData.getSlotsByFloor(this.currentFloor);
        const slot = slots.find(s => s.id === slotId);
        if (!slot) return;

        this.selectedSlot = slot;

        const panel = document.getElementById('slotDetailPanel');
        const idEl = document.getElementById('detailSlotId');
        const badgeEl = document.getElementById('detailSlotBadge');
        const infoEl = document.getElementById('detailSlotInfo');

        panel.classList.add('visible');
        idEl.textContent = `Slot ${slot.id}`;
        badgeEl.textContent = slot.status.toUpperCase();
        badgeEl.className = `slot-detail-badge ${slot.status}`;

        if (slot.status === 'occupied') {
            infoEl.innerHTML = `
                <div class="detail-row">
                    <span class="detail-label">Vehicle</span>
                    <span class="detail-value" style="font-family:monospace;">${slot.vehicle}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Type</span>
                    <span class="detail-value">${slot.type}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Parked Since</span>
                    <span class="detail-value">${slot.since}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Duration</span>
                    <span class="detail-value">${ParkingMapPage.calcDuration(slot.since)}</span>
                </div>
                <div class="detail-row">
                </div>
            `;
        } else if (slot.status === 'available') {
            infoEl.innerHTML = `
                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="detail-value" style="color:var(--success);">Ready</span>
                </div>
                <div class="detail-row">
                </div>
            `;
        } else {
            infoEl.innerHTML = `
                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="detail-value" style="color:var(--warning);">${slot.status}</span>
                </div>
            `;
        }

        document.querySelectorAll('.parking-slot').forEach(element => {
            const selected = element.dataset.slotId === slot.id;
            element.classList.toggle('selected', selected);
            element.setAttribute('aria-pressed', String(selected));
        });

        App.showToast(`Slot ${slot.id} selected — ${slot.status}`, 'info');
    },

    calcDuration(sinceTime) {
        if (!sinceTime) return '--';
        const [time, period] = sinceTime.split(' ');
        const [h, m] = time.split(':').map(Number);
        let hours24 = period === 'PM' && h !== 12 ? h + 12 : (period === 'AM' && h === 12 ? 0 : h);
        const now = new Date();
        const diffMins = (now.getHours() * 60 + now.getMinutes()) - (hours24 * 60 + m);
        const elapsedMinutes = diffMins < 0 ? diffMins + 24 * 60 : diffMins;
        const dh = Math.floor(elapsedMinutes / 60);
        const dm = elapsedMinutes % 60;
        return `${dh}h ${dm}m`;
    },

    init() {
        // Nothing extra needed
    }
};