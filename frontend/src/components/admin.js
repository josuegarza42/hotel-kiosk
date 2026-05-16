// Kiosko modal logic
document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-kiosk-modal');
    const modal = document.getElementById('kiosk-modal');
    const closeBtn = document.getElementById('close-kiosk-modal');
    const form = document.getElementById('kiosk-modal-form');

    if (openBtn && modal && closeBtn && form) {
        openBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            form.reset();
        });
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                form.reset();
            }
        });
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                hotel_id: currentHotelId || 1,
                name: document.getElementById('modal-kiosk-name').value,
                location: document.getElementById('modal-kiosk-location').value,
                device_id: document.getElementById('modal-kiosk-device-id').value,
                is_active: document.getElementById('modal-kiosk-active').value === 'true'
            };
            try {
                await adminApi.createKiosk(data);
                form.reset();
                modal.style.display = 'none';
                loadKiosks();
            } catch (err) {
                alert(err.message);
            }
        });
    }
});
let currentUser = null;
let currentHotelId = null;

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            currentUser = await adminApi.getCurrentUser();
            currentHotelId = currentUser.hotel_id;
            showDashboard();
        } catch (e) {
            showLogin();
        }
    } else {
        showLogin();
    }
});

function showLogin() {
    document.getElementById('login-screen').classList.add('active');
    document.getElementById('dashboard-screen').classList.remove('active');
}

function showDashboard() {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');

    document.getElementById('user-name').textContent = currentUser.full_name;
    document.getElementById('user-role').textContent =
        currentUser.role === 'super_admin' ? 'Super Admin' :
        currentUser.role === 'hotel_admin' ? 'Admin Hotel' : 'Staff';

    if (currentUser.role === 'super_admin') {
        document.querySelectorAll('.super-admin-only').forEach(el => {
            el.classList.add('visible');
        });
    }

    setupNavigation();
    loadOverviewData();
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    try {
        await adminApi.login(email, password);
        currentUser = await adminApi.getCurrentUser();
        currentHotelId = currentUser.hotel_id;
        errorDiv.textContent = '';
        showDashboard();
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}

function handleLogout() {
    adminApi.clearToken();
    currentUser = null;
    currentHotelId = null;
    showLogin();
}

function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;

            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            document.getElementById(`${section}-section`).classList.add('active');

            document.getElementById('section-title').textContent = item.textContent.trim();

            loadSectionData(section);
        });
    });
}

async function loadSectionData(section) {
    switch(section) {
        case 'overview':
            loadOverviewData();
            break;
        case 'reservations':
            loadReservations();
            break;
        case 'rooms':
            loadRooms();
            break;
        case 'guests':
            loadGuests();
            break;
        case 'kiosks':
            loadKiosks();
            break;
        case 'hotels':
            loadHotels();
            break;
        case 'users':
            loadUsers();
            break;
    }
}

async function loadOverviewData() {
    try {
        const [rooms, reservations] = await Promise.all([
            adminApi.getRooms(currentHotelId),
            adminApi.getReservations(currentHotelId)
        ]);

        const availableRooms = rooms.filter(r => r.status === 'available').length;
        const checkedIn = reservations.filter(r => r.status === 'checked_in');
        const today = new Date().toISOString().split('T')[0];
        const todayCheckins = reservations.filter(r => r.check_in_date === today && r.status === 'checked_in').length;

        document.getElementById('available-rooms').textContent = availableRooms;
        document.getElementById('current-guests').textContent = checkedIn.length;
        document.getElementById('today-checkins').textContent = todayCheckins;

        const occupancyRate = rooms.length > 0
            ? Math.round((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100)
            : 0;
        document.getElementById('occupancy-rate').textContent = `${occupancyRate}%`;

        const activityList = document.getElementById('activity-list');
        if (reservations.length === 0) {
            activityList.innerHTML = '<p class="empty-state">No hay actividad reciente</p>';
        } else {
            activityList.innerHTML = reservations.slice(0, 10).map(res => `
                <div class="activity-item">
                    <div class="activity-icon ${res.status === 'checked_in' ? 'checkin' : 'reservation'}">
                        ${res.status === 'checked_in' ? '✓' : '📅'}
                    </div>
                    <div class="activity-info">
                        <strong>${res.confirmation_code}</strong>
                        <span>${res.status} - ${res.check_in_date}</span>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading overview:', error);
    }
}

async function loadReservations() {
    try {
        const reservations = await adminApi.getReservations(currentHotelId);
        const tbody = document.getElementById('reservations-table');

        if (reservations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No hay reservaciones</td></tr>';
            return;
        }

        tbody.innerHTML = reservations.map(res => `
            <tr>
                <td>${res.confirmation_code}</td>
                <td>Huesped #${res.guest_id}</td>
                <td>Hab. ${res.room_id}</td>
                <td>${res.check_in_date}</td>
                <td>${res.check_out_date}</td>
                <td><span class="status-badge status-${res.status}">${res.status}</span></td>
                <td>
                    <button class="btn btn-small btn-secondary" onclick="showQRCode('${res.qr_code}', '${res.confirmation_code}')">
                        Ver QR
                    </button>
                </td>
            </tr>
        `).join('');

        await loadFormSelects();
    } catch (error) {
        console.error('Error loading reservations:', error);
    }
}

async function loadRooms() {
    try {
        const rooms = await adminApi.getRooms(currentHotelId);
        const grid = document.getElementById('rooms-grid');

        if (rooms.length === 0) {
            grid.innerHTML = '<p class="empty-state">No hay habitaciones registradas</p>';
            return;
        }

        grid.innerHTML = rooms.map(room => `
            <div class="room-card">
                <div class="room-number">${room.room_number}</div>
                <div class="room-type">${room.room_type}</div>
                <span class="status-badge status-${room.status}">${room.status}</span>
                <div class="room-price">$${room.price_per_night}/noche</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading rooms:', error);
    }
}

async function loadGuests() {
    try {
        const guests = await adminApi.getGuests();
        const tbody = document.getElementById('guests-table');

        if (guests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No hay huespedes registrados</td></tr>';
            return;
        }

        tbody.innerHTML = guests.map(guest => `
            <tr>
                <td>${guest.first_name} ${guest.last_name}</td>
                <td>${guest.email}</td>
                <td>${guest.phone || '-'}</td>
                <td>${guest.nationality || '-'}</td>
                <td>
                    <button class="btn btn-small btn-secondary">Editar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading guests:', error);
    }
}

async function loadKiosks() {
    try {
        const kiosks = await adminApi.getKiosks(currentHotelId);
        const grid = document.getElementById('kiosks-grid');

        if (kiosks.length === 0) {
            grid.innerHTML = '<p class="empty-state">No hay kioscos registrados</p>';
            return;
        }

        grid.innerHTML = kiosks.map(kiosk => `
            <div class="kiosk-card">
                <div class="room-number">${kiosk.name}</div>
                <div class="room-type">${kiosk.location || 'Sin ubicacion'}</div>
                <span class="status-badge status-${kiosk.is_active ? 'available' : 'maintenance'}">
                    ${kiosk.is_active ? 'Activo' : 'Inactivo'}
                </span>
                <div style="margin-top:10px;font-size:0.8rem;color:#888">
                    ID: ${kiosk.device_id}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading kiosks:', error);
    }
}

async function loadHotels() {
    try {
        const hotels = await adminApi.getHotels();
        const tbody = document.getElementById('hotels-table');

        tbody.innerHTML = hotels.map(hotel => `
            <tr>
                <td>${hotel.name}</td>
                <td>${hotel.city || '-'}</td>
                <td>${hotel.phone || '-'}</td>
                <td><span class="status-badge status-${hotel.is_active ? 'available' : 'maintenance'}">
                    ${hotel.is_active ? 'Activo' : 'Inactivo'}
                </span></td>
                <td>
                    <button class="btn btn-small btn-secondary">Editar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading hotels:', error);
    }
}

async function loadUsers() {
    try {
        const users = await adminApi.getUsers();
        const tbody = document.getElementById('users-table');

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.full_name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.hotel_id || 'Global'}</td>
                <td><span class="status-badge status-${user.is_active ? 'available' : 'maintenance'}">
                    ${user.is_active ? 'Activo' : 'Inactivo'}
                </span></td>
                <td>
                    <button class="btn btn-small btn-secondary">Editar</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function loadFormSelects() {
    try {
        const [guests, rooms] = await Promise.all([
            adminApi.getGuests(),
            adminApi.getRooms(currentHotelId)
        ]);

        const guestSelect = document.getElementById('res-guest');
        guestSelect.innerHTML = guests.map(g =>
            `<option value="${g.id}">${g.first_name} ${g.last_name} (${g.email})</option>`
        ).join('');

        const roomSelect = document.getElementById('res-room');
        roomSelect.innerHTML = rooms
            .filter(r => r.status === 'available')
            .map(r => `<option value="${r.id}">${r.room_number} - ${r.room_type} ($${r.price_per_night})</option>`)
            .join('');
    } catch (error) {
        console.error('Error loading form selects:', error);
    }
}

function showModal(modalId) {
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    document.getElementById(modalId).classList.remove('hidden');

    if (modalId === 'reservation-modal') {
        loadFormSelects();
    }
}

function hideModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
}

async function handleCreateReservation(event) {
    event.preventDefault();

    const hotelId = currentHotelId || 1;

    const data = {
        hotel_id: hotelId,
        guest_id: parseInt(document.getElementById('res-guest').value),
        room_id: parseInt(document.getElementById('res-room').value),
        check_in_date: document.getElementById('res-checkin').value,
        check_out_date: document.getElementById('res-checkout').value,
        num_guests: parseInt(document.getElementById('res-guests').value),
        special_requests: document.getElementById('res-requests').value
    };

    try {
        const result = await adminApi.createReservation(data);
        hideModal();
        loadReservations();
        showQRCode(result.qr_code, result.confirmation_code, result.qr_image_base64);
    } catch (error) {
        alert(error.message);
    }
}

async function handleCreateGuest(event) {
    event.preventDefault();

    const data = {
        first_name: document.getElementById('guest-firstname').value,
        last_name: document.getElementById('guest-lastname').value,
        email: document.getElementById('guest-email').value,
        phone: document.getElementById('guest-phone').value,
        nationality: document.getElementById('guest-nationality').value
    };

    try {
        await adminApi.createGuest(data);
        hideModal();
        loadGuests();
    } catch (error) {
        alert(error.message);
    }
}

async function handleCreateRoom(event) {
    event.preventDefault();

    const hotelId = currentHotelId || 1;

    const data = {
        hotel_id: hotelId,
        room_number: document.getElementById('room-number').value,
        floor: parseInt(document.getElementById('room-floor').value),
        room_type: document.getElementById('room-type').value,
        price_per_night: parseFloat(document.getElementById('room-price').value),
        max_guests: parseInt(document.getElementById('room-max-guests').value)
    };

    try {
        await adminApi.createRoom(data);
        hideModal();
        loadRooms();
    } catch (error) {
        alert(error.message);
    }
}

function showQRCode(qrCode, confirmationCode, qrImage = null) {
    showModal('qr-modal');
    document.getElementById('qr-confirmation').textContent = `Codigo: ${confirmationCode}`;

    if (qrImage) {
        document.getElementById('qr-image').src = qrImage;
    } else {
        document.getElementById('qr-image').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCode}`;
    }
}

function printQR() {
    const qrImage = document.getElementById('qr-image').src;
    const confirmationCode = document.getElementById('qr-confirmation').textContent;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head><title>QR Code</title></head>
        <body style="text-align:center;font-family:Arial;">
            <h2>Codigo de Reservacion</h2>
            <img src="${qrImage}" style="width:300px;height:300px;">
            <p style="font-size:1.5rem;">${confirmationCode}</p>
            <p>Presente este codigo en el kiosko para hacer check-in</p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function filterReservations() {
    const status = document.getElementById('reservation-status-filter').value;
    const date = document.getElementById('reservation-date-filter').value;
    adminApi.getReservations(currentHotelId, status, date).then(reservations => {
        const tbody = document.getElementById('reservations-table');
        tbody.innerHTML = reservations.map(res => `
            <tr>
                <td>${res.confirmation_code}</td>
                <td>Huesped #${res.guest_id}</td>
                <td>Hab. ${res.room_id}</td>
                <td>${res.check_in_date}</td>
                <td>${res.check_out_date}</td>
                <td><span class="status-badge status-${res.status}">${res.status}</span></td>
                <td>
                    <button class="btn btn-small btn-secondary" onclick="showQRCode('${res.qr_code}', '${res.confirmation_code}')">
                        Ver QR
                    </button>
                </td>
            </tr>
        `).join('');
    });
}
