let currentReservation = null;
let currentQRCode = null;
let html5QrCode = null;

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    if (screenId === 'scan-screen') {
        startQRScanner();
    } else if (html5QrCode) {
        stopQRScanner();
    }
}

function showLoading() {
    document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

function showError(message) {
    document.getElementById('error-message').textContent = message;
    showScreen('error-screen');
}

async function startQRScanner() {
    const qrReader = document.getElementById('qr-reader');

    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("qr-reader");
    }

    try {
        await html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            onQRCodeScanned,
            (errorMessage) => {}
        );
    } catch (err) {
        console.error("Error al iniciar camara:", err);
        document.getElementById('scan-status').textContent = 'No se pudo acceder a la camara. Usa ingreso manual.';
        document.getElementById('scan-status').className = 'status error';
    }
}

async function stopQRScanner() {
    if (html5QrCode && html5QrCode.isScanning) {
        try {
            await html5QrCode.stop();
        } catch (err) {
            console.error("Error al detener scanner:", err);
        }
    }
}

async function onQRCodeScanned(decodedText) {
    await stopQRScanner();

    showLoading();

    try {
        let qrCode = decodedText;
        if (decodedText.includes('|QR:')) {
            qrCode = decodedText.split('|QR:')[1];
        }

        const reservation = await api.verifyQR(qrCode);
        currentQRCode = qrCode;
        currentReservation = reservation;

        displayReservationData(reservation);
        hideLoading();
        showScreen('confirm-screen');
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

async function searchByCode() {
    const code = document.getElementById('confirmation-code').value.trim().toUpperCase();

    if (!code) {
        document.getElementById('manual-status').textContent = 'Ingresa un codigo de confirmacion';
        document.getElementById('manual-status').className = 'status error';
        return;
    }

    showLoading();

    try {
        const reservation = await api.getReservationByCode(code);
        currentQRCode = reservation.qr_code;
        currentReservation = {
            confirmation_code: reservation.confirmation_code,
            guest_name: 'Huesped',
            room_number: '-',
            check_in_date: reservation.check_in_date,
            check_out_date: reservation.check_out_date,
            status: reservation.status,
            hotel_name: '-'
        };

        const verifyData = await api.verifyQR(reservation.qr_code);
        currentReservation = verifyData;

        displayReservationData(currentReservation);
        hideLoading();
        showScreen('confirm-screen');
    } catch (error) {
        hideLoading();
        document.getElementById('manual-status').textContent = error.message;
        document.getElementById('manual-status').className = 'status error';
    }
}

function displayReservationData(data) {
    document.getElementById('guest-name').textContent = data.guest_name;
    document.getElementById('confirmation-display').textContent = `Codigo: ${data.confirmation_code}`;
    document.getElementById('hotel-name').textContent = data.hotel_name;
    document.getElementById('room-number').textContent = data.room_number;
    document.getElementById('check-in-date').textContent = formatDate(data.check_in_date);
    document.getElementById('check-out-date').textContent = formatDate(data.check_out_date);

    const checkbox = document.getElementById('terms-checkbox');
    const checkinBtn = document.getElementById('checkin-btn');

    checkbox.checked = false;
    checkinBtn.disabled = true;

    checkbox.onchange = () => {
        checkinBtn.disabled = !checkbox.checked;
    };
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

async function processCheckIn() {
    if (!currentQRCode) {
        showError('No hay datos de reservacion');
        return;
    }

    const termsAccepted = document.getElementById('terms-checkbox').checked;
    if (!termsAccepted) {
        return;
    }

    showLoading();

    try {
        const result = await api.processCheckIn(currentQRCode, null, termsAccepted);

        document.getElementById('digital-key').textContent = result.digital_key_code;
        document.getElementById('assigned-room').textContent = result.room_number;
        document.getElementById('wristband-code').textContent = result.wristband_code || '-';

        hideLoading();
        showScreen('success-screen');
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

function finishAndReset() {
    currentReservation = null;
    currentQRCode = null;

    document.getElementById('confirmation-code').value = '';
    document.getElementById('manual-status').textContent = '';
    document.getElementById('manual-status').className = 'status';
    document.getElementById('scan-status').textContent = '';
    document.getElementById('scan-status').className = 'status';

    showScreen('welcome-screen');
}

document.addEventListener('DOMContentLoaded', () => {
    showScreen('welcome-screen');
});
