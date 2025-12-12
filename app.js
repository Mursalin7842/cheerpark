// Cheer Park - Frontend Logic (simplified for multi-page + PHP)

// --- AUTH VIEW TOGGLE ---
function toggleAuth(view) {
    const login = document.getElementById('login-screen');
    const register = document.getElementById('register-screen');

    if (!login || !register) return;

    if (view === 'register') {
        login.classList.add('hidden');
        register.classList.remove('hidden');
    } else {
        register.classList.add('hidden');
        login.classList.remove('hidden');
    }
}

// --- LOGIN (uses login.php) ---
function handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    fetch('login.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // On success, go to the chats dashboard page
                window.location.href = 'dashboard_chats.html';
            } else {
                alert(data.message || 'Login failed.');
            }
        })
        .catch(() => {
            alert('Could not contact server. Make sure PHP is running.');
        });
}

// --- REGISTER (uses register.php) ---
function handleRegister(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    fetch('register.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Account created! Please log in.');
                toggleAuth('login');
            } else {
                alert(data.message || 'Registration failed.');
            }
        })
        .catch(() => {
            alert('Could not contact server. Make sure PHP is running.');
        });
}

// --- LOGOUT (multi-page) ---
function logout() {
    // From any dashboard page, just go back to the auth page
    window.location.href = 'login_register.html';
}
