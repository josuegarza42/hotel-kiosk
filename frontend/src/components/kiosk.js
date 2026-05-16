/* ==========================================
   HOTEL KIOSK - MAIN CONTROLLER
   ========================================== */

const API_BASE_URL = 'http://localhost:8000/api/v1';

let currentReservation = null;
let currentQRCode = null;
let html5QrCode = null;
let countdownInterval = null;
let currentLang = 'es';
let currentCheckoutData = null;

// Traducciones
const translations = {
    es: {
        step_identify: 'Identificarse',
        step_confirm: 'Confirmar',
        step_done: 'Listo',
        welcome_title: 'Bienvenido',
        welcome_subtitle: 'Realiza tu check-in en segundos',
        scan_qr: 'Escanear QR',
        scan_qr_desc: 'Usa la cámara para escanear tu código',
        manual_code: 'Ingresar código',
        manual_code_desc: 'Escribe tu código de confirmación',
        need_help: '¿Necesitas ayuda? Presiona el botón de asistencia',
        assistance: 'Asistencia',
        back: 'Volver',
        scan_title: 'Escanea tu código QR',
        scan_subtitle: 'Posiciona el código dentro del marco',
        cant_scan: '¿No puedes escanear? Ingresa el código manualmente',
        enter_code: 'Ingresa tu código',
        enter_code_desc: 'Escribe el código de confirmación de tu reservación',
        clear: 'Borrar',
        search_reservation: 'Buscar reservación',
        confirm_details: 'Confirma tus datos',
        room: 'Habitación',
        check_in: 'Entrada',
        check_out: 'Salida',
        guests: 'Huéspedes',
        accept_terms: 'Acepto los términos y condiciones del hotel',
        read_terms: 'Leer términos',
        confirm_checkin: 'Confirmar Check-in',
        checkin_success: '¡Check-in completado!',
        enjoy_stay: 'Disfruta tu estancia',
        your_room: 'Tu habitación',
        digital_key: 'Llave digital',
        wristband: 'Pulsera',
        instruction_1: 'Dirígete a los elevadores del lobby',
        instruction_2: 'Usa tu llave digital en la puerta',
        instruction_3: 'La pulsera te da acceso a amenidades',
        finish: 'Finalizar',
        auto_close: 'Esta pantalla se cerrará automáticamente en',
        error_title: 'Ocurrió un problema',
        try_following: 'Intenta lo siguiente:',
        error_tip_1: 'Verifica que tu código sea correcto',
        error_tip_2: 'Asegúrate que la fecha de check-in sea hoy',
        error_tip_3: 'Contacta a recepción si el problema persiste',
        try_again: 'Intentar de nuevo',
        call_assistance: 'Llamar asistencia',
        processing: 'Procesando...',
        terms_title: 'Términos y Condiciones',
        understood: 'Entendido',
        help_message: 'Un miembro de nuestro equipo viene en camino para ayudarte.',
        please_wait: 'Por favor espera en este kiosco.',
        code_not_found: 'Código de reservación no encontrado',
        invalid_qr: 'Código QR no válido',
        checkin_not_today: 'La fecha de check-in no es hoy',
        already_checked_in: 'Ya realizaste el check-in',
        reservation_cancelled: 'Esta reservación fue cancelada',
        enter_a_code: 'Ingresa un código',
        code_min_length: 'El código debe tener al menos 4 caracteres',
        // Check-out translations
        checkout: 'Check-out',
        checkout_desc: 'Completa tu proceso de salida',
        checkout_title: 'Ingresa tu numero de habitacion',
        checkout_subtitle: 'Escribe el numero de tu habitacion para iniciar el checkout',
        room_number: 'Numero de habitacion',
        search_room: 'Buscar habitacion',
        checkout_confirm_title: 'Confirma tu check-out',
        stay_summary: 'Resumen de estancia',
        pending_charges: 'Cargos pendientes',
        no_pending_charges: 'Sin cargos pendientes',
        total_to_pay: 'Total a pagar',
        confirm_checkout: 'Confirmar Check-out',
        checkout_success: 'Check-out completado!',
        thank_you_stay: 'Gracias por tu estancia',
        farewell_message: 'Esperamos verte de nuevo pronto',
        checkout_instruction_1: 'Por favor deja la tarjeta llave en la habitacion',
        checkout_instruction_2: 'Revisa tu correo para el recibo',
        checkout_instruction_3: 'Buen viaje!',
        room_not_found: 'Habitacion no encontrada o no tiene check-in',
        checkout_error: 'Error al procesar el check-out'
    },
    en: {
        step_identify: 'Identify',
        step_confirm: 'Confirm',
        step_done: 'Done',
        welcome_title: 'Welcome',
        welcome_subtitle: 'Check-in in seconds',
        scan_qr: 'Scan QR',
        scan_qr_desc: 'Use the camera to scan your code',
        manual_code: 'Enter code',
        manual_code_desc: 'Type your confirmation code',
        need_help: 'Need help? Press the assistance button',
        assistance: 'Assistance',
        back: 'Back',
        scan_title: 'Scan your QR code',
        scan_subtitle: 'Position the code inside the frame',
        cant_scan: "Can't scan? Enter the code manually",
        enter_code: 'Enter your code',
        enter_code_desc: 'Type the confirmation code from your reservation',
        clear: 'Clear',
        search_reservation: 'Search reservation',
        confirm_details: 'Confirm your details',
        room: 'Room',
        check_in: 'Check-in',
        check_out: 'Check-out',
        guests: 'Guests',
        accept_terms: 'I accept the hotel terms and conditions',
        read_terms: 'Read terms',
        confirm_checkin: 'Confirm Check-in',
        checkin_success: 'Check-in complete!',
        enjoy_stay: 'Enjoy your stay',
        your_room: 'Your room',
        digital_key: 'Digital key',
        wristband: 'Wristband',
        instruction_1: 'Head to the lobby elevators',
        instruction_2: 'Use your digital key at the door',
        instruction_3: 'Your wristband gives you access to amenities',
        finish: 'Finish',
        auto_close: 'This screen will close automatically in',
        error_title: 'Something went wrong',
        try_following: 'Try the following:',
        error_tip_1: 'Verify your code is correct',
        error_tip_2: 'Make sure your check-in date is today',
        error_tip_3: 'Contact the front desk if the problem persists',
        try_again: 'Try again',
        call_assistance: 'Call assistance',
        processing: 'Processing...',
        terms_title: 'Terms and Conditions',
        understood: 'Understood',
        help_message: 'A team member is on their way to help you.',
        please_wait: 'Please wait at this kiosk.',
        code_not_found: 'Reservation code not found',
        invalid_qr: 'Invalid QR code',
        checkin_not_today: 'Check-in date is not today',
        already_checked_in: 'You have already checked in',
        reservation_cancelled: 'This reservation was cancelled',
        enter_a_code: 'Enter a code',
        code_min_length: 'Code must be at least 4 characters',
        // Check-out translations
        checkout: 'Check-out',
        checkout_desc: 'Complete your departure process',
        checkout_title: 'Enter your room number',
        checkout_subtitle: 'Type your room number to start checkout',
        room_number: 'Room number',
        search_room: 'Search room',
        checkout_confirm_title: 'Confirm your checkout',
        stay_summary: 'Stay summary',
        pending_charges: 'Pending charges',
        no_pending_charges: 'No pending charges',
        total_to_pay: 'Total to pay',
        confirm_checkout: 'Confirm Check-out',
        checkout_success: 'Check-out complete!',
        thank_you_stay: 'Thank you for your stay',
        farewell_message: 'We hope to see you again soon',
        checkout_instruction_1: 'Please leave the key card in the room',
        checkout_instruction_2: 'Check your email for the receipt',
        checkout_instruction_3: 'Have a safe trip!',
        room_not_found: 'Room not found or not checked in',
        checkout_error: 'Error processing checkout'
    },
    zh: {
        step_identify: '身份验证',
        step_confirm: '确认信息',
        step_done: '完成',
        welcome_title: '欢迎光临',
        welcome_subtitle: '快速办理入住手续',
        scan_qr: '扫描二维码',
        scan_qr_desc: '使用摄像头扫描您的二维码',
        manual_code: '输入代码',
        manual_code_desc: '输入您的确认代码',
        need_help: '需要帮助？请按协助按钮',
        assistance: '协助服务',
        back: '返回',
        scan_title: '请扫描您的二维码',
        scan_subtitle: '将二维码放置在框内',
        cant_scan: '无法扫描？请手动输入代码',
        enter_code: '请输入代码',
        enter_code_desc: '请输入您预订的确认代码',
        clear: '清除',
        search_reservation: '查询预订',
        confirm_details: '请确认您的信息',
        room: '房间',
        check_in: '入住',
        check_out: '退房',
        guests: '宾客人数',
        accept_terms: '我同意酒店的条款和条件',
        read_terms: '阅读条款',
        confirm_checkin: '确认入住',
        checkin_success: '入住办理成功！',
        enjoy_stay: '祝您住店愉快',
        your_room: '您的房间',
        digital_key: '电子房卡',
        wristband: '手环',
        instruction_1: '请前往大堂电梯',
        instruction_2: '使用电子房卡开门',
        instruction_3: '手环可让您使用酒店设施',
        finish: '完成',
        auto_close: '此页面将自动关闭，倒计时',
        error_title: '出现问题',
        try_following: '请尝试以下操作：',
        error_tip_1: '请核实您的代码是否正确',
        error_tip_2: '请确认入住日期是否为今天',
        error_tip_3: '如问题持续，请联系前台',
        try_again: '重试',
        call_assistance: '呼叫协助',
        processing: '处理中...',
        terms_title: '条款和条件',
        understood: '知道了',
        help_message: '工作人员正在前来为您服务。',
        please_wait: '请在此自助机旁等候。',
        code_not_found: '未找到预订代码',
        invalid_qr: '无效的二维码',
        checkin_not_today: '入住日期不是今天',
        already_checked_in: '您已办理入住',
        reservation_cancelled: '此预订已被取消',
        enter_a_code: '请输入代码',
        code_min_length: '代码至少需要4个字符',
        // Check-out translations
        checkout: '退房',
        checkout_desc: '办理退房手续',
        checkout_title: '请输入房间号',
        checkout_subtitle: '输入您的房间号开始办理退房',
        room_number: '房间号',
        search_room: '查询房间',
        checkout_confirm_title: '确认退房信息',
        stay_summary: '住宿摘要',
        pending_charges: '待付费用',
        no_pending_charges: '无待付费用',
        total_to_pay: '应付总额',
        confirm_checkout: '确认退房',
        checkout_success: '退房成功！',
        thank_you_stay: '感谢您的入住',
        farewell_message: '期待再次为您服务',
        checkout_instruction_1: '请将房卡留在房间内',
        checkout_instruction_2: '收据将发送至您的邮箱',
        checkout_instruction_3: '祝您旅途愉快！',
        room_not_found: '未找到房间或尚未入住',
        checkout_error: '退房处理失败'
    }
};

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    showScreen('welcome-screen');
    updateTime();
    setInterval(updateTime, 1000);
    setupLanguageToggle();
    setupVirtualKeyboard();
    setupCheckoutKeyboard();
    setupTermsCheckbox();
    applyTranslations();
}

// ==========================================
// IDIOMA
// ==========================================

function setupLanguageToggle() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = btn.dataset.lang;
            applyTranslations();
        });
    });
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
}

function t(key) {
    return translations[currentLang][key] || key;
}

// ==========================================
// TIEMPO
// ==========================================

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('current-time').textContent = `${hours}:${minutes}`;
}

// ==========================================
// NAVEGACIÓN DE PANTALLAS
// ==========================================

function showScreen(screenId) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Mostrar la pantalla solicitada
    document.getElementById(screenId).classList.add('active');

    // Actualizar barra de progreso
    updateProgressBar(screenId);

    // Acciones específicas por pantalla
    if (screenId === 'scan-screen') {
        startQRScanner();
    } else if (html5QrCode && html5QrCode.isScanning) {
        stopQRScanner();
    }

    if (screenId === 'success-screen' || screenId === 'checkout-success-screen') {
        startCountdown();
    } else {
        stopCountdown();
    }

    if (screenId === 'welcome-screen') {
        resetState();
    }
}

function updateProgressBar(screenId) {
    const stepMap = {
        'welcome-screen': 1,
        'scan-screen': 1,
        'manual-screen': 1,
        'confirm-screen': 2,
        'success-screen': 3,
        'error-screen': 1,
        'checkout-room-screen': 1,
        'checkout-confirm-screen': 2,
        'checkout-success-screen': 3
    };

    const currentStep = stepMap[screenId] || 1;

    document.querySelectorAll('.progress-step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');

        if (stepNum < currentStep) {
            step.classList.add('completed');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
        }
    });
}

// ==========================================
// ESCÁNER QR
// ==========================================

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
                qrbox: { width: 280, height: 280 },
                aspectRatio: 1.0
            },
            onQRCodeScanned,
            () => {} // Ignorar errores de escaneo
        );
    } catch (err) {
        console.error("Error al iniciar cámara:", err);
        showScanStatus('error', 'No se pudo acceder a la cámara');
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
        // Extraer código QR si viene en formato HOTEL:X|QR:Y
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
        showError(error.message || t('invalid_qr'));
    }
}

function showScanStatus(type, message) {
    const status = document.getElementById('scan-status');
    status.textContent = message;
    status.className = `scan-status ${type}`;
}

// ==========================================
// ENTRADA MANUAL
// ==========================================

function setupVirtualKeyboard() {
    document.querySelectorAll('#manual-screen .key[data-key]').forEach(key => {
        key.addEventListener('click', () => {
            const char = key.dataset.key;
            const input = document.getElementById('confirmation-code');
            const statusEl = document.getElementById('manual-status');

            // Limpiar mensaje de error al escribir
            if (statusEl) statusEl.textContent = '';

            if (input.value.length < 8) {
                input.value += char;
                input.dispatchEvent(new Event('input'));

                // Feedback visual
                addKeyFeedback(key);
            }
        });
    });
}

function addKeyFeedback(keyElement) {
    keyElement.classList.add('key-pressed');
    setTimeout(() => {
        keyElement.classList.remove('key-pressed');
    }, 100);
}

function deleteChar() {
    const input = document.getElementById('confirmation-code');
    input.value = input.value.slice(0, -1);
}

function clearCode() {
    document.getElementById('confirmation-code').value = '';
    document.getElementById('manual-status').textContent = '';
}

async function searchByCode() {
    const codeInput = document.getElementById('confirmation-code');
    const code = codeInput.value.trim().toUpperCase();
    const statusEl = document.getElementById('manual-status');

    // Limpiar estado previo
    statusEl.textContent = '';

    if (!code) {
        showManualStatus(t('enter_a_code'));
        return;
    }

    if (code.length < 4) {
        showManualStatus(t('code_min_length'));
        return;
    }

    const fullCode = `RES-${code}`;
    showLoading();

    try {
        const reservation = await api.getReservationByCode(fullCode);
        currentQRCode = reservation.qr_code;

        // Verificar el QR para obtener datos completos
        const verifyData = await api.verifyQR(reservation.qr_code);
        currentReservation = verifyData;

        displayReservationData(currentReservation);
        hideLoading();
        showScreen('confirm-screen');
    } catch (error) {
        hideLoading();
        showManualStatus(error.message || t('code_not_found'));
    }
}

function showManualStatus(message) {
    document.getElementById('manual-status').textContent = message;
}

// ==========================================
// CONFIRMACIÓN
// ==========================================

function displayReservationData(data) {
    // Nombre del huesped
    document.getElementById('guest-name').textContent = data.guest_name;

    // Iniciales del avatar
    const names = data.guest_name.split(' ');
    const initials = names.map(n => n[0]).join('').substring(0, 2).toUpperCase();
    document.getElementById('guest-initials').textContent = initials;

    // Codigo de confirmacion
    document.getElementById('confirmation-display').textContent = data.confirmation_code;

    // Numero de habitacion
    document.getElementById('room-number').textContent = data.room_number;

    // Fechas
    document.getElementById('check-in-date').textContent = formatDate(data.check_in_date);
    document.getElementById('check-out-date').textContent = formatDate(data.check_out_date);

    // Numero de huespedes
    const numGuestsEl = document.getElementById('num-guests');
    if (numGuestsEl) {
        numGuestsEl.textContent = data.num_guests || data.guests || '1';
    }

    // Hotel
    document.getElementById('hotel-name').textContent = data.hotel_name;

    // Resetear checkbox
    const checkbox = document.getElementById('terms-checkbox');
    checkbox.checked = false;
    document.getElementById('checkin-btn').disabled = true;
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { day: 'numeric', month: 'short' };
    const localeMap = {
        'es': 'es-MX',
        'en': 'en-US',
        'zh': 'zh-CN'
    };
    return date.toLocaleDateString(localeMap[currentLang] || 'en-US', options);
}

function setupTermsCheckbox() {
    const checkbox = document.getElementById('terms-checkbox');
    const btn = document.getElementById('checkin-btn');

    checkbox.addEventListener('change', () => {
        btn.disabled = !checkbox.checked;
    });
}

// ==========================================
// PROCESO DE CHECK-IN
// ==========================================

async function processCheckIn() {
    if (!currentQRCode) {
        showError('No hay datos de reservación');
        return;
    }

    const termsAccepted = document.getElementById('terms-checkbox').checked;
    if (!termsAccepted) return;

    showLoading();

    try {
        const result = await api.processCheckIn(currentQRCode, null, termsAccepted);

        // Mostrar datos de éxito
        document.getElementById('digital-key').textContent = result.digital_key_code;
        document.getElementById('assigned-room').textContent = result.room_number;
        document.getElementById('wristband-code').textContent = result.wristband_code || '---';

        // Piso de la habitación
        const floor = result.room_number.charAt(0);
        const floorLabels = {
            'es': `Piso ${floor}`,
            'en': `Floor ${floor}`,
            'zh': `${floor}楼`
        };
        document.getElementById('room-floor').textContent = floorLabels[currentLang] || `Floor ${floor}`;

        hideLoading();
        showScreen('success-screen');
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

// ==========================================
// PANTALLA DE ÉXITO
// ==========================================

function startCountdown() {
    let seconds = 30;
    const countdownEl = document.getElementById('countdown');
    const checkoutCountdownEl = document.getElementById('checkout-countdown');

    // Reiniciar el valor visual al inicio
    if (countdownEl) {
        countdownEl.textContent = seconds;
    }
    if (checkoutCountdownEl) {
        checkoutCountdownEl.textContent = seconds;
    }

    // Limpiar cualquier intervalo previo
    stopCountdown();

    countdownInterval = setInterval(() => {
        seconds--;
        if (countdownEl) {
            countdownEl.textContent = seconds;
        }
        if (checkoutCountdownEl) {
            checkoutCountdownEl.textContent = seconds;
        }

        if (seconds <= 0) {
            finishAndReset();
        }
    }, 1000);
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

function finishAndReset() {
    stopCountdown();
    resetState();
    showScreen('welcome-screen');
}

// ==========================================
// ERRORES
// ==========================================

function showError(message) {
    document.getElementById('error-message').textContent = message;
    showScreen('error-screen');
}

// ==========================================
// MODALES
// ==========================================

function showTerms() {
    const modal = document.getElementById('terms-modal');
    modal.classList.remove('hidden');
    setupModalBackdropClose(modal, hideTerms);
}

function hideTerms() {
    document.getElementById('terms-modal').classList.add('hidden');
}

function requestHelp() {
    const modal = document.getElementById('help-modal');
    modal.classList.remove('hidden');
    setupModalBackdropClose(modal, hideHelp);

    // Auto cerrar despues de 10 segundos
    setTimeout(() => {
        hideHelp();
    }, 10000);
}

function hideHelp() {
    document.getElementById('help-modal').classList.add('hidden');
}

function setupModalBackdropClose(modal, closeFunc) {
    // Permitir cerrar el modal al hacer clic en el backdrop
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeFunc();
        }
    };
}

// ==========================================
// LOADING
// ==========================================

function showLoading() {
    document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

// ==========================================
// RESET
// ==========================================

function resetState() {
    currentReservation = null;
    currentQRCode = null;
    currentCheckoutData = null;

    // Limpiar inputs
    document.getElementById('confirmation-code').value = '';
    document.getElementById('manual-status').textContent = '';

    // Limpiar inputs de checkout
    const roomInput = document.getElementById('checkout-room-input');
    if (roomInput) roomInput.value = '';
    const checkoutStatus = document.getElementById('checkout-status');
    if (checkoutStatus) checkoutStatus.textContent = '';

    // Resetear checkbox
    const checkbox = document.getElementById('terms-checkbox');
    if (checkbox) checkbox.checked = false;

    const checkinBtn = document.getElementById('checkin-btn');
    if (checkinBtn) checkinBtn.disabled = true;
}

// ==========================================
// CHECK-OUT FUNCTIONS
// ==========================================

function setupCheckoutKeyboard() {
    document.querySelectorAll('#checkout-room-screen .key[data-key]').forEach(key => {
        key.addEventListener('click', () => {
            const char = key.dataset.key;
            const input = document.getElementById('checkout-room-input');
            if (input.value.length < 4) {
                input.value += char;
                input.dispatchEvent(new Event('input'));
            }
        });
    });
}

function deleteCheckoutChar() {
    const input = document.getElementById('checkout-room-input');
    input.value = input.value.slice(0, -1);
}

function clearCheckoutRoom() {
    document.getElementById('checkout-room-input').value = '';
    document.getElementById('checkout-status').textContent = '';
}

async function searchRoomForCheckout() {
    const roomInput = document.getElementById('checkout-room-input');
    const roomNumber = roomInput.value.trim();

    if (!roomNumber || roomNumber.length < 1) {
        showCheckoutStatus(t('room_not_found'));
        return;
    }

    showLoading();

    try {
        const reservation = await api.getActiveReservationByRoom(roomNumber);

        currentCheckoutData = reservation;
        displayCheckoutData(reservation);
        hideLoading();
        showScreen('checkout-confirm-screen');
    } catch (error) {
        hideLoading();
        showCheckoutStatus(error.message || t('room_not_found'));
    }
}

function showCheckoutStatus(message) {
    document.getElementById('checkout-status').textContent = message;
}

function displayCheckoutData(data) {
    // Guest name
    document.getElementById('checkout-guest-name').textContent = data.guest_name;

    // Initials
    const names = data.guest_name.split(' ');
    const initials = names.map(n => n[0]).join('').substring(0, 2).toUpperCase();
    document.getElementById('checkout-guest-initials').textContent = initials;

    // Room number
    document.getElementById('checkout-room-number').textContent = data.room_number;

    // Dates
    document.getElementById('checkout-checkin-date').textContent = formatDate(data.check_in_date);
    document.getElementById('checkout-checkout-date').textContent = formatDate(data.check_out_date);

    // Calculate nights
    const checkIn = new Date(data.check_in_date);
    const checkOut = new Date(data.check_out_date);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    document.getElementById('checkout-nights').textContent = nights;

    // Pending charges (if any)
    const chargesContainer = document.getElementById('checkout-charges');
    const totalElement = document.getElementById('checkout-total');

    if (data.pending_charges && data.pending_charges.length > 0) {
        let chargesHtml = '';
        let total = 0;
        data.pending_charges.forEach(charge => {
            chargesHtml += `<div class="charge-item"><span>${charge.description}</span><span>$${charge.amount.toFixed(2)}</span></div>`;
            total += charge.amount;
        });
        chargesContainer.innerHTML = chargesHtml;
        totalElement.textContent = `$${total.toFixed(2)}`;
    } else {
        chargesContainer.innerHTML = `<p class="no-charges">${t('no_pending_charges')}</p>`;
        totalElement.textContent = '$0.00';
    }

    // Hotel name
    document.getElementById('checkout-hotel-name').textContent = data.hotel_name;
}

async function processCheckOut() {
    if (!currentCheckoutData) {
        showError(t('checkout_error'));
        return;
    }

    showLoading();

    try {
        const result = await api.processCheckOut(currentCheckoutData.id, null);

        // Display success data
        document.getElementById('checkout-success-room').textContent = currentCheckoutData.room_number;
        document.getElementById('checkout-success-guest').textContent = currentCheckoutData.guest_name;

        hideLoading();
        showScreen('checkout-success-screen');
    } catch (error) {
        hideLoading();
        showError(error.message || t('checkout_error'));
    }
}
