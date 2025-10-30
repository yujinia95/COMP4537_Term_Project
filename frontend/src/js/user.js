/**
 * @file user.js
 * @author Yujin Jeong, Evan Vink, Brian Diep
 * @version 1.0
 * @description This file contains the UserDashboardPage class that manages the user dashboard functionality.
 */

class UserDashboardPage {
    constructor() {
        // Cache DOM elements
        this.usernameEl = document.getElementById('username');
        this.apiCallsEl = document.getElementById('apiCalls');
        this.totalRequestsEl = document.getElementById('totalRequests');

        // Bind methods
        this.init = this.init.bind(this);
        this.loadUserData = this.loadUserData.bind(this);
        this.goToAIService = this.goToAIService.bind(this);
        this.logout = this.logout.bind(this);

        // Initialize when DOM is ready
        window.addEventListener('DOMContentLoaded', this.init);
    }

    async init() {
        try {
            await this.loadUserData();

            // Optional: wire buttons if present
            const aiBtn = document.getElementById('goToAIServiceBtn');
            if (aiBtn) aiBtn.addEventListener('click', this.goToAIService);

            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) logoutBtn.addEventListener('click', this.logout);
        } catch (err) {
            console.error('Error initializing user dashboard:', err);
        }
    }

    async loadUserData() {
        // TODO: Replace with actual API call
        // const token = localStorage.getItem('token');
        // const res = await fetch('/api/user/stats', {
        //   headers: { 'Authorization': 'Bearer ' + token }
        // });
        // if (!res.ok) throw new Error('Failed to load user data');
        // const data = await res.json();

        // Placeholder data (simulated)
        const data = {
            username: 'John Doe',
            apiCalls: 1000,
            totalRequests: 0
        };

        // Render
        if (this.usernameEl) this.usernameEl.textContent = data.username;
        if (this.apiCallsEl) this.apiCallsEl.textContent = data.apiCalls.toLocaleString();
        if (this.totalRequestsEl) this.totalRequestsEl.textContent = data.totalRequests.toString();
    }

    goToAIService() {
        window.location.href = 'ai-service.html';
    }

    logout() {
        // TODO: Clear tokens/session as needed
        // localStorage.removeItem('token');
        // sessionStorage.clear();

        alert('Logging out...');
        window.location.href = 'login.html';
    }
}

// Instantiate
const userDashboardPage = new UserDashboardPage();

// Example HTML hooks (optional):
// <button id="goToAIServiceBtn">Use AI Service</button>
// <button id="logoutBtn">Logout</button>
