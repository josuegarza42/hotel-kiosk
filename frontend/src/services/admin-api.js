const API_BASE_URL = 'http://localhost:8000/api/v1';

let authToken = localStorage.getItem('authToken');

const adminApi = {
    setToken(token) {
        authToken = token;
        localStorage.setItem('authToken', token);
    },

    clearToken() {
        authToken = null;
        localStorage.removeItem('authToken');
    },

    getHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        return headers;
    },

    async login(email, password) {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error de autenticacion');
        }

        const data = await response.json();
        this.setToken(data.access_token);
        return data;
    },

    async getCurrentUser() {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: this.getHeaders()
        });

        if (!response.ok) {
            throw new Error('No autenticado');
        }

        return response.json();
    },

    async getHotels() {
        const response = await fetch(`${API_BASE_URL}/hotels/`, {
            headers: this.getHeaders()
        });
        return response.json();
    },

    async createHotel(data) {
        const response = await fetch(`${API_BASE_URL}/hotels/`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al crear hotel');
        }
        return response.json();
    },

    async getRooms(hotelId = null) {
        let url = `${API_BASE_URL}/rooms/`;
        if (hotelId) url += `?hotel_id=${hotelId}`;
        const response = await fetch(url, { headers: this.getHeaders() });
        return response.json();
    },

    async createRoom(data) {
        const response = await fetch(`${API_BASE_URL}/rooms/`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al crear habitacion');
        }
        return response.json();
    },

    async updateRoom(roomId, data) {
        const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async getGuests() {
        const response = await fetch(`${API_BASE_URL}/guests/`, {
            headers: this.getHeaders()
        });
        return response.json();
    },

    async createGuest(data) {
        const response = await fetch(`${API_BASE_URL}/guests/`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al crear huesped');
        }
        return response.json();
    },

    async getReservations(hotelId = null, status = null, date = null) {
        let url = `${API_BASE_URL}/reservations/?`;
        if (hotelId) url += `hotel_id=${hotelId}&`;
        if (status) url += `status=${status}&`;
        if (date) url += `check_in_date=${date}&`;

        const response = await fetch(url, { headers: this.getHeaders() });
        return response.json();
    },

    async createReservation(data) {
        const response = await fetch(`${API_BASE_URL}/reservations/`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al crear reservacion');
        }
        return response.json();
    },

    async getUsers(hotelId = null) {
        let url = `${API_BASE_URL}/users/`;
        if (hotelId) url += `?hotel_id=${hotelId}`;
        const response = await fetch(url, { headers: this.getHeaders() });
        return response.json();
    },

    async createUser(data) {
        const response = await fetch(`${API_BASE_URL}/users/`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al crear usuario');
        }
        return response.json();
    },

    async getKiosks(hotelId = null) {
        let url = `${API_BASE_URL}/kiosks/`;
        if (hotelId) url += `?hotel_id=${hotelId}`;
        const response = await fetch(url, { headers: this.getHeaders() });
        return response.json();
    },

    async createKiosk(data) {
        const response = await fetch(`${API_BASE_URL}/kiosks/`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al crear kiosko');
        }
        return response.json();
    }
};
