const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = {
    async verifyQR(qrCode) {
        const response = await fetch(`${API_BASE_URL}/check-in/verify/${qrCode}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'QR no valido');
        }
        return response.json();
    },

    async getReservationByCode(confirmationCode) {
        const response = await fetch(`${API_BASE_URL}/reservations/code/${confirmationCode}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Reservacion no encontrada');
        }
        return response.json();
    },

    async processCheckIn(qrCode, kioskId = null, termsAccepted = true) {
        const response = await fetch(`${API_BASE_URL}/check-in/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                qr_code: qrCode,
                kiosk_id: kioskId,
                terms_accepted: termsAccepted
            })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al procesar check-in');
        }
        return response.json();
    },

    async processCheckOut(reservationId, notes = null) {
        const response = await fetch(`${API_BASE_URL}/check-in/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reservation_id: reservationId,
                notes: notes
            })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al procesar check-out');
        }
        return response.json();
    },

    async kioskHeartbeat(kioskId) {
        const response = await fetch(`${API_BASE_URL}/kiosks/${kioskId}/heartbeat`, {
            method: 'POST'
        });
        return response.json();
    }
};
