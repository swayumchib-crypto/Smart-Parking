// ============================================
// DUMMY DATA FOR SMART PARKING SYSTEM
// ============================================

const DummyData = {
    // Parking Slots Data
    parkingSlots: {
        floorA: [
            { id: 'A01', status: 'occupied', vehicle: 'JK01AB1234', since: '08:15 AM', type: 'sedan' },
            { id: 'A02', status: 'available', vehicle: null, since: null, type: null },
            { id: 'A03', status: 'occupied', vehicle: 'JK02CD5678', since: '09:30 AM', type: 'suv' },
            { id: 'A04', status: 'occupied', vehicle: 'JK03EF9012', since: '07:45 AM', type: 'sedan' },
            { id: 'A05', status: 'available', vehicle: null, since: null, type: null },
            { id: 'A06', status: 'available', vehicle: null, since: null, type: null },
            { id: 'A07', status: 'occupied', vehicle: 'JK04GH3456', since: '10:00 AM', type: 'hatchback' },
            { id: 'A08', status: 'reserved', vehicle: null, since: null, type: null },
            { id: 'A09', status: 'occupied', vehicle: 'JK05IJ7890', since: '08:50 AM', type: 'sedan' },
            { id: 'A10', status: 'available', vehicle: null, since: null, type: null },
            { id: 'A11', status: 'occupied', vehicle: 'JK06KL1234', since: '11:15 AM', type: 'suv' },
            { id: 'A12', status: 'occupied', vehicle: 'JK07MN5678', since: '09:00 AM', type: 'sedan' },
            { id: 'A13', status: 'available', vehicle: null, since: null, type: null },
            { id: 'A14', status: 'occupied', vehicle: 'JK08OP9012', since: '10:30 AM', type: 'hatchback' },
            { id: 'A15', status: 'available', vehicle: null, since: null, type: null },
            { id: 'A16', status: 'occupied', vehicle: 'JK09QR3456', since: '07:30 AM', type: 'sedan' },
            { id: 'A17', status: 'occupied', vehicle: 'JK10ST7890', since: '08:00 AM', type: 'suv' },
            { id: 'A18', status: 'available', vehicle: null, since: null, type: null },
            { id: 'A19', status: 'disabled', vehicle: null, since: null, type: null },
            { id: 'A20', status: 'occupied', vehicle: 'JK11UV1234', since: '09:45 AM', type: 'sedan' },
            { id: 'A21', status: 'available', vehicle: null, since: null, type: null },
            { id: 'A22', status: 'occupied', vehicle: 'JK12WX5678', since: '11:00 AM', type: 'hatchback' },
            { id: 'A23', status: 'occupied', vehicle: 'JK13YZ9012', since: '08:30 AM', type: 'sedan' },
            { id: 'A24', status: 'available', vehicle: null, since: null, type: null },
        ],
        floorB: [
            { id: 'B01', status: 'available', vehicle: null, since: null, type: null },
            { id: 'B02', status: 'occupied', vehicle: 'JK14AB3456', since: '09:15 AM', type: 'sedan' },
            { id: 'B03', status: 'occupied', vehicle: 'JK15CD7890', since: '10:45 AM', type: 'suv' },
            { id: 'B04', status: 'available', vehicle: null, since: null, type: null },
            { id: 'B05', status: 'available', vehicle: null, since: null, type: null },
            { id: 'B06', status: 'occupied', vehicle: 'JK16EF1234', since: '08:00 AM', type: 'sedan' },
            { id: 'B07', status: 'available', vehicle: null, since: null, type: null },
            { id: 'B08', status: 'occupied', vehicle: 'JK17GH5678', since: '07:15 AM', type: 'suv' },
            { id: 'B09', status: 'available', vehicle: null, since: null, type: null },
            { id: 'B10', status: 'reserved', vehicle: null, since: null, type: null },
            { id: 'B11', status: 'available', vehicle: null, since: null, type: null },
            { id: 'B12', status: 'occupied', vehicle: 'JK18IJ9012', since: '09:30 AM', type: 'hatchback' },
            { id: 'B13', status: 'occupied', vehicle: 'JK19KL3456', since: '10:00 AM', type: 'sedan' },
            { id: 'B14', status: 'available', vehicle: null, since: null, type: null },
            { id: 'B15', status: 'available', vehicle: null, since: null, type: null },
            { id: 'B16', status: 'occupied', vehicle: 'JK20MN7890', since: '11:30 AM', type: 'sedan' },
            { id: 'B17', status: 'available', vehicle: null, since: null, type: null },
            { id: 'B18', status: 'available', vehicle: null, since: null, type: null },
            { id: 'B19', status: 'occupied', vehicle: 'JK21OP1234', since: '08:45 AM', type: 'suv' },
            { id: 'B20', status: 'available', vehicle: null, since: null, type: null },
        ],
        floorC: [
            { id: 'C01', status: 'available', vehicle: null, since: null, type: null },
            { id: 'C02', status: 'available', vehicle: null, since: null, type: null },
            { id: 'C03', status: 'occupied', vehicle: 'JK22QR5678', since: '10:15 AM', type: 'sedan' },
            { id: 'C04', status: 'available', vehicle: null, since: null, type: null },
            { id: 'C05', status: 'occupied', vehicle: 'JK23ST9012', since: '09:00 AM', type: 'suv' },
            { id: 'C06', status: 'available', vehicle: null, since: null, type: null },
            { id: 'C07', status: 'available', vehicle: null, since: null, type: null },
            { id: 'C08', status: 'available', vehicle: null, since: null, type: null },
            { id: 'C09', status: 'occupied', vehicle: 'JK24UV3456', since: '11:00 AM', type: 'hatchback' },
            { id: 'C10', status: 'available', vehicle: null, since: null, type: null },
            { id: 'C11', status: 'available', vehicle: null, since: null, type: null },
            { id: 'C12', status: 'occupied', vehicle: 'JK25WX7890', since: '08:30 AM', type: 'sedan' },
            { id: 'C13', status: 'available', vehicle: null, since: null, type: null },
            { id: 'C14', status: 'available', vehicle: null, since: null, type: null },
            { id: 'C15', status: 'occupied', vehicle: 'JK26YZ1234', since: '10:45 AM', type: 'sedan' },
            { id: 'C16', status: 'available', vehicle: null, since: null, type: null },
        ]
    },

    // Hourly occupancy data (24 hours)
    hourlyOccupancy: [
        { hour: '00:00', occupancy: 15, available: 85 },
        { hour: '01:00', occupancy: 12, available: 88 },
        { hour: '02:00', occupancy: 10, available: 90 },
        { hour: '03:00', occupancy: 8, available: 92 },
        { hour: '04:00', occupancy: 10, available: 90 },
        { hour: '05:00', occupancy: 15, available: 85 },
        { hour: '06:00', occupancy: 25, available: 75 },
        { hour: '07:00', occupancy: 45, available: 55 },
        { hour: '08:00', occupancy: 68, available: 32 },
        { hour: '09:00', occupancy: 82, available: 18 },
        { hour: '10:00', occupancy: 88, available: 12 },
        { hour: '11:00', occupancy: 92, available: 8 },
        { hour: '12:00', occupancy: 78, available: 22 },
        { hour: '13:00', occupancy: 85, available: 15 },
        { hour: '14:00', occupancy: 90, available: 10 },
        { hour: '15:00', occupancy: 87, available: 13 },
        { hour: '16:00', occupancy: 75, available: 25 },
        { hour: '17:00', occupancy: 55, available: 45 },
        { hour: '18:00', occupancy: 40, available: 60 },
        { hour: '19:00', occupancy: 30, available: 70 },
        { hour: '20:00', occupancy: 25, available: 75 },
        { hour: '21:00', occupancy: 22, available: 78 },
        { hour: '22:00', occupancy: 18, available: 82 },
        { hour: '23:00', occupancy: 16, available: 84 },
    ],

    // Weekly occupancy data
    weeklyOccupancy: [
        { day: 'Mon', avg: 78, peak: 95, entries: 342 },
        { day: 'Tue', avg: 82, peak: 97, entries: 365 },
        { day: 'Wed', avg: 75, peak: 92, entries: 318 },
        { day: 'Thu', avg: 80, peak: 94, entries: 355 },
        { day: 'Fri', avg: 70, peak: 88, entries: 290 },
        { day: 'Sat', avg: 45, peak: 62, entries: 180 },
        { day: 'Sun', avg: 25, peak: 38, entries: 95 },
    ],

    // Monthly trend data
    monthlyTrend: [
        { month: 'Jan', occupancy: 65, revenue: 45000 },
        { month: 'Feb', occupancy: 68, revenue: 47500 },
        { month: 'Mar', occupancy: 72, revenue: 50000 },
        { month: 'Apr', occupancy: 75, revenue: 52000 },
        { month: 'May', occupancy: 70, revenue: 49000 },
        { month: 'Jun', occupancy: 62, revenue: 43000 },
        { month: 'Jul', occupancy: 58, revenue: 40000 },
        { month: 'Aug', occupancy: 55, revenue: 38000 },
        { month: 'Sep', occupancy: 73, revenue: 51000 },
        { month: 'Oct', occupancy: 78, revenue: 54000 },
        { month: 'Nov', occupancy: 80, revenue: 56000 },
        { month: 'Dec', occupancy: 72, revenue: 50000 },
    ],

    // Heatmap data (7 days x 24 hours) — occupancy percentage
    heatmapData: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        hours: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}`),
        data: [
            // Monday
            [12, 10, 8, 5, 8, 15, 30, 55, 75, 88, 92, 95, 80, 88, 92, 90, 78, 58, 42, 32, 28, 25, 20, 15],
            // Tuesday
            [14, 11, 9, 6, 9, 18, 35, 58, 78, 90, 94, 97, 82, 90, 93, 88, 75, 55, 40, 30, 26, 22, 18, 14],
            // Wednesday
            [11, 9, 7, 5, 7, 14, 28, 50, 70, 85, 90, 92, 78, 85, 90, 87, 72, 52, 38, 28, 24, 20, 16, 12],
            // Thursday
            [13, 10, 8, 6, 8, 16, 32, 54, 74, 87, 92, 94, 80, 87, 91, 89, 76, 56, 41, 31, 27, 23, 19, 14],
            // Friday
            [10, 8, 6, 4, 6, 12, 25, 48, 65, 80, 85, 88, 72, 80, 85, 82, 68, 48, 35, 25, 22, 18, 15, 11],
            // Saturday
            [8, 6, 5, 3, 4, 8, 15, 25, 38, 48, 55, 62, 58, 55, 52, 48, 42, 35, 28, 20, 16, 12, 10, 8],
            // Sunday
            [6, 5, 4, 3, 3, 5, 10, 15, 22, 30, 35, 38, 35, 32, 30, 28, 25, 22, 18, 15, 12, 10, 8, 6],
        ]
    },

    // Prediction data
    predictions: {
        nextHours: [
            { time: '1:00 PM', occupancy: 85, available: 9, confidence: 94 },
            { time: '2:00 PM', occupancy: 90, available: 6, confidence: 91 },
            { time: '3:00 PM', occupancy: 87, available: 8, confidence: 88 },
            { time: '4:00 PM', occupancy: 75, available: 15, confidence: 85 },
            { time: '5:00 PM', occupancy: 55, available: 27, confidence: 82 },
            { time: '6:00 PM', occupancy: 40, available: 36, confidence: 79 },
        ],
        tomorrow: {
            peakTime: '11:00 AM',
            peakOccupancy: 94,
            bestTime: '6:00 AM',
            bestAvailability: 88,
        },
        modelMetrics: {
            accuracy: 94.2,
            mae: 3.1,
            rmse: 4.7,
            r2Score: 0.92,
        }
    },

    // Recent activities
    recentActivities: [
        { type: 'enter', slot: 'A11', vehicle: 'JK06KL1234', time: '2 min ago', vehicleType: 'SUV' },
        { type: 'exit', slot: 'B05', vehicle: 'JK28AB5678', time: '5 min ago', vehicleType: 'Sedan' },
        { type: 'enter', slot: 'A22', vehicle: 'JK12WX5678', time: '8 min ago', vehicleType: 'Hatchback' },
        { type: 'exit', slot: 'C08', vehicle: 'JK30CD9012', time: '12 min ago', vehicleType: 'Sedan' },
        { type: 'enter', slot: 'B19', vehicle: 'JK21OP1234', time: '15 min ago', vehicleType: 'SUV' },
        { type: 'exit', slot: 'A18', vehicle: 'JK31EF3456', time: '18 min ago', vehicleType: 'Sedan' },
        { type: 'enter', slot: 'A14', vehicle: 'JK08OP9012', time: '22 min ago', vehicleType: 'Hatchback' },
        { type: 'exit', slot: 'B11', vehicle: 'JK32GH7890', time: '25 min ago', vehicleType: 'SUV' },
        { type: 'enter', slot: 'C15', vehicle: 'JK26YZ1234', time: '30 min ago', vehicleType: 'Sedan' },
        { type: 'exit', slot: 'A06', vehicle: 'JK33IJ1234', time: '35 min ago', vehicleType: 'Sedan' },
    ],

    // Zone data
    zones: [
        { name: 'Zone A - Main Building', type: 'general', total: 24, occupied: 14, available: 8, reserved: 1, disabled: 1, camera: 'CAM-01' },
        { name: 'Zone B - East Wing', type: 'general', total: 20, occupied: 8, available: 10, reserved: 1, disabled: 1, camera: 'CAM-02' },
        { name: 'Zone C - Annex', type: 'general', total: 16, occupied: 5, available: 11, reserved: 0, disabled: 0, camera: 'CAM-03' },
        { name: 'VIP Parking', type: 'vip', total: 8, occupied: 3, available: 5, reserved: 0, disabled: 0, camera: 'CAM-04' },
        { name: 'EV Charging', type: 'ev', total: 6, occupied: 2, available: 4, reserved: 0, disabled: 0, camera: 'CAM-05' },
        { name: 'Accessible Parking', type: 'handicap', total: 4, occupied: 1, available: 3, reserved: 0, disabled: 0, camera: 'CAM-06' },
    ],

    // Camera data
    cameras: [
        { id: 'CAM-01', name: 'Main Entrance Camera', location: 'Zone A - Ground Floor', status: 'online', resolution: '1080p', fps: 30, detectionRate: 98.5, uptime: '99.9%' },
        { id: 'CAM-02', name: 'East Wing Camera', location: 'Zone B - Ground Floor', status: 'online', resolution: '1080p', fps: 30, detectionRate: 97.8, uptime: '99.7%' },
        { id: 'CAM-03', name: 'Annex Area Camera', location: 'Zone C - Level 1', status: 'online', resolution: '720p', fps: 25, detectionRate: 96.2, uptime: '98.5%' },
        { id: 'CAM-04', name: 'VIP Section Camera', location: 'VIP Parking Area', status: 'online', resolution: '1080p', fps: 30, detectionRate: 99.1, uptime: '99.9%' },
        { id: 'CAM-05', name: 'Exit Gate Camera', location: 'Main Exit', status: 'online', resolution: '1080p', fps: 30, detectionRate: 98.0, uptime: '99.6%' },
        { id: 'CAM-06', name: 'Overflow Camera', location: 'Overflow Lot', status: 'offline', resolution: '720p', fps: 25, detectionRate: 0, uptime: '85.2%' },
    ],

    // Alerts
    alerts: [
        {
            id: 1, type: 'critical', title: 'Zone A Near Full Capacity',
            desc: 'Zone A has reached 92% occupancy. Only 2 spaces remaining.',
            time: '5 min ago', zone: 'Zone A', read: false
        },
        {
            id: 2, type: 'warning', title: 'Camera CAM-06 Offline',
            desc: 'Overflow parking camera has been offline for 15 minutes. Detection paused for that zone.',
            time: '15 min ago', zone: 'Overflow', read: false
        },
        {
            id: 3, type: 'info', title: 'Prediction Model Updated',
            desc: 'The ML prediction model has been retrained with latest data. New accuracy: 94.2%.',
            time: '1 hour ago', zone: 'System', read: false
        },
        {
            id: 4, type: 'warning', title: 'Unusual Traffic Pattern Detected',
            desc: 'Parking entries are 35% higher than typical Thursday patterns.',
            time: '2 hours ago', zone: 'All Zones', read: true
        },
        {
            id: 5, type: 'info', title: 'Daily Report Generated',
            desc: 'Yesterday\'s parking report has been generated and saved. Average occupancy: 76%.',
            time: '6 hours ago', zone: 'System', read: true
        },
        {
            id: 6, type: 'critical', title: 'Double Parking Detected',
            desc: 'Possible double parking detected near slot A19. Manual verification recommended.',
            time: '8 hours ago', zone: 'Zone A', read: true
        },
    ],

    // Detection log table
    detectionLog: [
        { time: '12:45:32', slot: 'A11', action: 'Vehicle Entered', vehicle: 'JK06KL1234', confidence: 98.5, zone: 'Zone A' },
        { time: '12:40:15', slot: 'B05', action: 'Vehicle Exited', vehicle: 'JK28AB5678', confidence: 97.2, zone: 'Zone B' },
        { time: '12:37:48', slot: 'A22', action: 'Vehicle Entered', vehicle: 'JK12WX5678', confidence: 96.8, zone: 'Zone A' },
        { time: '12:33:21', slot: 'C08', action: 'Vehicle Exited', vehicle: 'JK30CD9012', confidence: 95.4, zone: 'Zone C' },
        { time: '12:30:05', slot: 'B19', action: 'Vehicle Entered', vehicle: 'JK21OP1234', confidence: 98.1, zone: 'Zone B' },
        { time: '12:27:39', slot: 'A18', action: 'Vehicle Exited', vehicle: 'JK31EF3456', confidence: 97.6, zone: 'Zone A' },
        { time: '12:23:12', slot: 'A14', action: 'Vehicle Entered', vehicle: 'JK08OP9012', confidence: 96.3, zone: 'Zone A' },
        { time: '12:20:45', slot: 'B11', action: 'Vehicle Exited', vehicle: 'JK32GH7890', confidence: 98.8, zone: 'Zone B' },
    ],

    // System overview
    overview: {
        totalSlots: 60,
        occupied: 27,
        available: 29,
        reserved: 2,
        disabled: 2,
        todayEntries: 187,
        todayExits: 160,
        avgDuration: '3h 24m',
        peakOccupancy: 92,
        detectionAccuracy: 97.3,
        currentTime: new Date().toLocaleTimeString(),
    },

    // Helper functions
    getOccupancyPercentage() {
        return Math.round((this.overview.occupied / this.overview.totalSlots) * 100);
    },

    getAvailablePercentage() {
        return Math.round((this.overview.available / this.overview.totalSlots) * 100);
    },

    getOccupancyColor(pct) {
        if (pct >= 85) return 'red';
        if (pct >= 60) return 'yellow';
        return 'green';
    },

    getSlotsByFloor(floor) {
        return this.parkingSlots[floor] || [];
    },

    getFloorStats(floor) {
        const slots = this.getSlotsByFloor(floor);
        return {
            total: slots.length,
            occupied: slots.filter(s => s.status === 'occupied').length,
            available: slots.filter(s => s.status === 'available').length,
            reserved: slots.filter(s => s.status === 'reserved').length,
            disabled: slots.filter(s => s.status === 'disabled').length,
        };
    }
};