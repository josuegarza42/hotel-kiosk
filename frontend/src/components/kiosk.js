let currentReservation = null;
let currentQRCode = null;
let html5QrCode = null;
let currentCheckoutData = null;
let currentLang = 'en';
let welcomeAnimationInterval = null;
let sessionPollingInterval = null;
let currentSessionId = null;
const welcomeWords = ['Welcome', 'Bienvenido', '欢迎', 'Willkommen', 'Bem-vindo', 'Bienvenue'];

// Configuracion del kiosco (en produccion vendria del backend)
const KIOSK_CONFIG = {
    hotelId: 1,
    hotelName: 'Hotel Plaza Centro',
    kioskId: 'KIOSK-001'
};

// Traducciones
const translations = {
    es: {
        welcome: 'Bienvenido',
        subtitle: 'Sistema de Check-in Automatizado',
        scan_title: 'Escanea tu codigo QR',
        scan_desc: 'Presenta el codigo QR de tu reservacion frente a la camara',
        btn_checkin: 'Iniciar Check-in',
        btn_manual: 'Ingresar codigo manualmente',
        btn_checkout: 'Check-out',
        back: '← Volver',
        scan_qr: 'Escanear QR',
        manual_entry: 'Ingreso Manual',
        confirmation_code: 'Codigo de Confirmacion',
        search: 'Buscar Reservacion',
        confirm_data: 'Confirmar Datos',
        hotel: 'Hotel',
        room: 'Habitacion',
        checkin: 'Check-in',
        checkout: 'Check-out',
        accept_terms: 'Acepto los terminos y condiciones del hotel',
        confirm_checkin: 'Confirmar Check-in',
        success: 'Check-in Exitoso',
        digital_key: 'Tu llave digital:',
        room_label: 'Habitacion',
        wristband: 'Codigo de pulsera:',
        instructions: 'Presenta este codigo en la entrada de tu habitacion',
        finish: 'Finalizar',
        error: 'Error',
        try_again: 'Intentar de nuevo',
        checkout_title: 'Check-out',
        room_number: 'Numero de Habitacion',
        search_room: 'Buscar Habitacion',
        confirm_checkout: 'Confirmar Check-out',
        nights: 'Noches',
        total: 'Total',
        checkout_success: 'Check-out Exitoso',
        thanks: 'Gracias por tu estancia',
        see_you: 'Esperamos verte pronto',
        enter_code: 'Ingresa un codigo de confirmacion',
        enter_room: 'Ingresa el numero de habitacion',
        camera_error: 'No se pudo acceder a la camara. Usa ingreso manual.',
        no_reservation: 'No hay datos de reservacion'
    },
    en: {
        welcome: 'Welcome',
        subtitle: 'Automated Check-in System',
        scan_title: 'Scan your QR code',
        scan_desc: 'Present your reservation QR code in front of the camera',
        btn_checkin: 'Start Check-in',
        btn_manual: 'Enter code manually',
        btn_checkout: 'Check-out',
        back: '← Back',
        scan_qr: 'Scan QR',
        manual_entry: 'Manual Entry',
        confirmation_code: 'Confirmation Code',
        search: 'Search Reservation',
        confirm_data: 'Confirm Details',
        hotel: 'Hotel',
        room: 'Room',
        checkin: 'Check-in',
        checkout: 'Check-out',
        accept_terms: 'I accept the hotel terms and conditions',
        confirm_checkin: 'Confirm Check-in',
        success: 'Check-in Successful',
        digital_key: 'Your digital key:',
        room_label: 'Room',
        wristband: 'Wristband code:',
        instructions: 'Present this code at your room entrance',
        finish: 'Finish',
        error: 'Error',
        try_again: 'Try again',
        checkout_title: 'Check-out',
        room_number: 'Room Number',
        search_room: 'Search Room',
        confirm_checkout: 'Confirm Check-out',
        nights: 'Nights',
        total: 'Total',
        checkout_success: 'Check-out Successful',
        thanks: 'Thank you for your stay',
        see_you: 'We hope to see you soon',
        enter_code: 'Enter a confirmation code',
        enter_room: 'Enter the room number',
        camera_error: 'Could not access camera. Use manual entry.',
        no_reservation: 'No reservation data'
    },
    zh: {
        welcome: '欢迎',
        subtitle: '自动入住系统',
        scan_title: '扫描您的二维码',
        scan_desc: '请将预订二维码放在摄像头前',
        btn_checkin: '开始入住',
        btn_manual: '手动输入代码',
        btn_checkout: '退房',
        back: '← 返回',
        scan_qr: '扫描二维码',
        manual_entry: '手动输入',
        confirmation_code: '确认码',
        search: '查询预订',
        confirm_data: '确认信息',
        hotel: '酒店',
        room: '房间',
        checkin: '入住',
        checkout: '退房',
        accept_terms: '我接受酒店的条款和条件',
        confirm_checkin: '确认入住',
        success: '入住成功',
        digital_key: '您的电子钥匙:',
        room_label: '房间',
        wristband: '手环代码:',
        instructions: '请在房间入口处出示此代码',
        finish: '完成',
        error: '错误',
        try_again: '重试',
        checkout_title: '退房',
        room_number: '房间号',
        search_room: '查询房间',
        confirm_checkout: '确认退房',
        nights: '晚',
        total: '总计',
        checkout_success: '退房成功',
        thanks: '感谢您的入住',
        see_you: '期待再次见到您',
        enter_code: '请输入确认码',
        enter_room: '请输入房间号',
        camera_error: '无法访问摄像头，请手动输入。',
        no_reservation: '没有预订数据'
    },
    de: {
        welcome: 'Willkommen',
        subtitle: 'Automatisiertes Check-in-System',
        scan_title: 'Scannen Sie Ihren QR-Code',
        scan_desc: 'Halten Sie den QR-Code Ihrer Reservierung vor die Kamera',
        btn_checkin: 'Check-in starten',
        btn_manual: 'Code manuell eingeben',
        btn_checkout: 'Check-out',
        back: '← Zurück',
        scan_qr: 'QR scannen',
        manual_entry: 'Manuelle Eingabe',
        confirmation_code: 'Bestätigungscode',
        search: 'Reservierung suchen',
        confirm_data: 'Daten bestätigen',
        hotel: 'Hotel',
        room: 'Zimmer',
        checkin: 'Check-in',
        checkout: 'Check-out',
        accept_terms: 'Ich akzeptiere die AGB des Hotels',
        confirm_checkin: 'Check-in bestätigen',
        success: 'Check-in erfolgreich',
        digital_key: 'Ihr digitaler Schlüssel:',
        room_label: 'Zimmer',
        wristband: 'Armband-Code:',
        instructions: 'Zeigen Sie diesen Code am Zimmereingang',
        finish: 'Fertig',
        error: 'Fehler',
        try_again: 'Erneut versuchen',
        checkout_title: 'Check-out',
        room_number: 'Zimmernummer',
        search_room: 'Zimmer suchen',
        confirm_checkout: 'Check-out bestätigen',
        nights: 'Nächte',
        total: 'Gesamt',
        checkout_success: 'Check-out erfolgreich',
        thanks: 'Vielen Dank für Ihren Aufenthalt',
        see_you: 'Wir hoffen, Sie bald wiederzusehen',
        enter_code: 'Bestätigungscode eingeben',
        enter_room: 'Zimmernummer eingeben',
        camera_error: 'Kamera nicht verfügbar. Bitte manuell eingeben.',
        no_reservation: 'Keine Reservierungsdaten'
    },
    pt: {
        welcome: 'Bem-vindo',
        subtitle: 'Sistema de Check-in Automatizado',
        scan_title: 'Escaneie seu código QR',
        scan_desc: 'Apresente o código QR da sua reserva em frente à câmera',
        btn_checkin: 'Iniciar Check-in',
        btn_manual: 'Inserir código manualmente',
        btn_checkout: 'Check-out',
        back: '← Voltar',
        scan_qr: 'Escanear QR',
        manual_entry: 'Entrada Manual',
        confirmation_code: 'Código de Confirmação',
        search: 'Buscar Reserva',
        confirm_data: 'Confirmar Dados',
        hotel: 'Hotel',
        room: 'Quarto',
        checkin: 'Check-in',
        checkout: 'Check-out',
        accept_terms: 'Aceito os termos e condições do hotel',
        confirm_checkin: 'Confirmar Check-in',
        success: 'Check-in Realizado',
        digital_key: 'Sua chave digital:',
        room_label: 'Quarto',
        wristband: 'Código da pulseira:',
        instructions: 'Apresente este código na entrada do seu quarto',
        finish: 'Finalizar',
        error: 'Erro',
        try_again: 'Tentar novamente',
        checkout_title: 'Check-out',
        room_number: 'Número do Quarto',
        search_room: 'Buscar Quarto',
        confirm_checkout: 'Confirmar Check-out',
        nights: 'Noites',
        total: 'Total',
        checkout_success: 'Check-out Realizado',
        thanks: 'Obrigado pela sua estadia',
        see_you: 'Esperamos vê-lo em breve',
        enter_code: 'Insira o código de confirmação',
        enter_room: 'Insira o número do quarto',
        camera_error: 'Não foi possível acessar a câmera. Use entrada manual.',
        no_reservation: 'Sem dados de reserva'
    },
    fr: {
        welcome: 'Bienvenue',
        subtitle: 'Système d\'enregistrement automatisé',
        scan_title: 'Scannez votre code QR',
        scan_desc: 'Présentez le code QR de votre réservation devant la caméra',
        btn_checkin: 'Commencer l\'enregistrement',
        btn_manual: 'Entrer le code manuellement',
        btn_checkout: 'Départ',
        back: '← Retour',
        scan_qr: 'Scanner QR',
        manual_entry: 'Entrée Manuelle',
        confirmation_code: 'Code de Confirmation',
        search: 'Rechercher Réservation',
        confirm_data: 'Confirmer les Données',
        hotel: 'Hôtel',
        room: 'Chambre',
        checkin: 'Arrivée',
        checkout: 'Départ',
        accept_terms: 'J\'accepte les conditions générales de l\'hôtel',
        confirm_checkin: 'Confirmer l\'enregistrement',
        success: 'Enregistrement Réussi',
        digital_key: 'Votre clé numérique:',
        room_label: 'Chambre',
        wristband: 'Code du bracelet:',
        instructions: 'Présentez ce code à l\'entrée de votre chambre',
        finish: 'Terminer',
        error: 'Erreur',
        try_again: 'Réessayer',
        checkout_title: 'Départ',
        room_number: 'Numéro de Chambre',
        search_room: 'Rechercher Chambre',
        confirm_checkout: 'Confirmer le Départ',
        nights: 'Nuits',
        total: 'Total',
        checkout_success: 'Départ Réussi',
        thanks: 'Merci pour votre séjour',
        see_you: 'Nous espérons vous revoir bientôt',
        enter_code: 'Entrez le code de confirmation',
        enter_room: 'Entrez le numéro de chambre',
        camera_error: 'Impossible d\'accéder à la caméra. Utilisez l\'entrée manuelle.',
        no_reservation: 'Aucune donnée de réservation'
    }
};

function t(key) {
    return translations[currentLang][key] || key;
}

function applyTranslations() {
    // Welcome screen
    document.querySelector('.logo h1').textContent = t('welcome');
    document.querySelector('.logo p').textContent = t('subtitle');
    document.querySelector('.welcome-content h2').textContent = t('scan_title');
    document.querySelector('.welcome-content > p').textContent = t('scan_desc');

    // Buttons
    const buttons = document.querySelectorAll('.welcome-buttons .btn');
    if (buttons[0]) buttons[0].textContent = t('btn_checkin');
    if (buttons[1]) buttons[1].textContent = t('btn_manual');
    if (buttons[2]) buttons[2].textContent = t('btn_checkout');
}

function setupLanguageSelector() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = btn.dataset.lang;
            applyTranslations();
        });
    });

    // Set English as default active
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.lang-btn[data-lang="en"]').classList.add('active');
}

function startWelcomeAnimation() {
    let index = 0;
    const welcomeTitle = document.querySelector('.logo h1');

    welcomeAnimationInterval = setInterval(() => {
        welcomeTitle.style.opacity = '0';

        setTimeout(() => {
            welcomeTitle.textContent = welcomeWords[index];
            welcomeTitle.style.opacity = '1';
            index = (index + 1) % welcomeWords.length;
        }, 300);
    }, 2500);
}

function stopWelcomeAnimation() {
    if (welcomeAnimationInterval) {
        clearInterval(welcomeAnimationInterval);
        welcomeAnimationInterval = null;
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    if (screenId === 'scan-screen') {
        startKioskSession();
    } else {
        stopKioskSession();
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

// ==========================================
// KIOSK SESSION (QR para que usuario escanee)
// ==========================================

function generateSessionId() {
    // Usar session ID fijo para demo/pruebas
    return 'DEMO-SESSION-001';
}

async function startKioskSession() {
    currentSessionId = generateSessionId();

    // URL de la guest app con parametros de sesion
    const guestAppUrl = `${window.location.origin}/public/guest-app.html?session=${currentSessionId}&hotel=${KIOSK_CONFIG.hotelId}&hotelName=${encodeURIComponent(KIOSK_CONFIG.hotelName)}&kiosk=${KIOSK_CONFIG.kioskId}`;

    // Mostrar QR
    const qrContainer = document.getElementById('kiosk-qr');
    qrContainer.innerHTML = '';

    // Usar QRCode library para generar el QR
    if (typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, {
            text: guestAppUrl,
            width: 240,
            height: 240,
            colorDark: '#1a1a2e',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });
    } else {
        // Fallback: mostrar placeholder
        qrContainer.innerHTML = `
            <div style="text-align: center; color: #333;">
                <p style="font-size: 0.9rem;">Session ID:</p>
                <p style="font-size: 0.7rem; word-break: break-all;">${currentSessionId}</p>
            </div>
        `;
    }

    // Iniciar polling para detectar conexion del usuario
    startSessionPolling();

    console.log('Kiosk session started:', currentSessionId);
    console.log('Guest app URL:', guestAppUrl);
}

function stopKioskSession() {
    if (sessionPollingInterval) {
        clearInterval(sessionPollingInterval);
        sessionPollingInterval = null;
    }
    currentSessionId = null;
}

function startSessionPolling() {
    // Limpiar polling anterior
    if (sessionPollingInterval) {
        clearInterval(sessionPollingInterval);
    }

    // Verificar cada 2 segundos si hay una reservacion vinculada a esta sesion
    sessionPollingInterval = setInterval(async () => {
        if (!currentSessionId) return;

        try {
            const response = await api.checkSession(currentSessionId);

            if (response && response.reservation) {
                // Usuario escaneo y vinculo su reservacion
                stopKioskSession();
                currentReservation = response.reservation;
                currentQRCode = response.reservation.qr_code;

                displayReservationData(response.reservation);
                showScreen('confirm-screen');
            }
        } catch (error) {
            // Session aun no tiene reservacion vinculada, continuar polling
            console.log('Waiting for user to scan...');
        }
    }, 2000);
}

// ==========================================
// VIRTUAL KEYBOARD & INPUT MODE
// ==========================================

let inputMode = 'touch'; // 'touch' or 'keyboard'

function setInputMode(mode) {
    inputMode = mode;

    // Update toggle buttons
    document.getElementById('mode-touch').classList.toggle('active', mode === 'touch');
    document.getElementById('mode-keyboard').classList.toggle('active', mode === 'keyboard');

    // Show/hide appropriate inputs
    document.getElementById('touch-display').style.display = mode === 'touch' ? 'flex' : 'none';
    document.querySelector('.virtual-keyboard').style.display = mode === 'touch' ? 'flex' : 'none';
    document.getElementById('keyboard-input-wrapper').style.display = mode === 'keyboard' ? 'flex' : 'none';

    // Sync values between inputs
    if (mode === 'keyboard') {
        document.getElementById('keyboard-input').value = document.getElementById('confirmation-code').value;
        document.getElementById('keyboard-input').focus();
    } else {
        document.getElementById('confirmation-code').value = document.getElementById('keyboard-input').value.toUpperCase();
        updateCodeDisplay();
    }
}

function setupKeyboardInput() {
    const keyboardInput = document.getElementById('keyboard-input');
    if (keyboardInput) {
        keyboardInput.addEventListener('input', (e) => {
            const value = e.target.value.toUpperCase().replace(/[^A-F0-9]/g, '');
            e.target.value = value;
            document.getElementById('confirmation-code').value = value;
        });
    }
}

function pressKey(key) {
    const input = document.getElementById('confirmation-code');

    if (input.value.length < 8) {
        input.value += key;
        updateCodeDisplay();
    }
}

function deleteKey() {
    const input = document.getElementById('confirmation-code');
    input.value = input.value.slice(0, -1);
    updateCodeDisplay();
    clearStatus();
}

function clearCode() {
    document.getElementById('confirmation-code').value = '';
    document.getElementById('keyboard-input').value = '';
    updateCodeDisplay();
    clearStatus();
}

function updateCodeDisplay() {
    const input = document.getElementById('confirmation-code');
    const display = document.getElementById('code-display');
    const value = input.value;

    // Mostrar el valor con underscores para los espacios vacios
    let displayText = value.padEnd(8, '_').split('').join('');
    display.textContent = displayText;
}

function clearStatus() {
    const status = document.getElementById('manual-status');
    if (status) {
        status.textContent = '';
        status.className = 'status';
    }
}

async function searchByCode() {
    const codeInput = document.getElementById('confirmation-code').value.trim().toUpperCase();

    if (!codeInput || codeInput.length < 4) {
        document.getElementById('manual-status').textContent = 'Ingresa al menos 4 caracteres';
        document.getElementById('manual-status').className = 'status error';
        return;
    }

    // Agregar prefijo RES- si no lo tiene
    const code = codeInput.startsWith('RES-') ? codeInput : `RES-${codeInput}`;

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
    currentCheckoutData = null;

    document.getElementById('confirmation-code').value = '';
    document.getElementById('manual-status').textContent = '';
    document.getElementById('manual-status').className = 'status';
    document.getElementById('scan-status').textContent = '';
    document.getElementById('scan-status').className = 'status';

    // Reset code display
    const codeDisplay = document.getElementById('code-display');
    if (codeDisplay) codeDisplay.textContent = '________';

    const roomInput = document.getElementById('room-input');
    if (roomInput) roomInput.value = '';
    const checkoutCodeInput = document.getElementById('checkout-code-input');
    if (checkoutCodeInput) checkoutCodeInput.value = '';
    const checkoutStatus = document.getElementById('checkout-status');
    if (checkoutStatus) {
        checkoutStatus.textContent = '';
        checkoutStatus.className = 'status';
    }

    showScreen('welcome-screen');
}

// ==========================================
// CHECK-OUT FUNCTIONS
// ==========================================

async function searchRoomForCheckout() {
    const roomNumber = document.getElementById('room-input').value.trim();
    const codeInput = document.getElementById('checkout-code-input').value.trim().toUpperCase();

    if (!roomNumber) {
        document.getElementById('checkout-status').textContent = 'Ingresa el número de habitación';
        document.getElementById('checkout-status').className = 'status error';
        return;
    }

    if (!codeInput) {
        document.getElementById('checkout-status').textContent = 'Ingresa el código de confirmación';
        document.getElementById('checkout-status').className = 'status error';
        return;
    }

    const confirmationCode = `RES-${codeInput}`;

    showLoading();

    try {
        const data = await api.getActiveReservationByRoom(roomNumber, confirmationCode);
        currentCheckoutData = data;

        document.getElementById('checkout-guest-name').textContent = data.guest_name;
        document.getElementById('checkout-room-number').textContent = data.room_number;
        document.getElementById('checkout-checkin-date').textContent = formatDate(data.check_in_date);
        document.getElementById('checkout-checkout-date').textContent = formatDate(data.check_out_date);
        document.getElementById('checkout-nights').textContent = data.nights;
        document.getElementById('checkout-total').textContent = `$${data.pending_amount.toFixed(2)}`;

        hideLoading();
        showScreen('checkout-confirm-screen');
    } catch (error) {
        hideLoading();
        document.getElementById('checkout-status').textContent = error.message;
        document.getElementById('checkout-status').className = 'status error';
    }
}

async function processCheckout() {
    if (!currentCheckoutData) {
        showError('No hay datos de reservacion');
        return;
    }

    showLoading();

    try {
        await api.processCheckOut(currentCheckoutData.reservation_id);
        hideLoading();
        showScreen('checkout-success-screen');
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupLanguageSelector();
    applyTranslations();
    setupKeyboardInput();
    showScreen('welcome-screen');
    startWelcomeAnimation();
});
