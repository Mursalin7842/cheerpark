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

// --- SIMPLE PAGE INDICATOR (reusable helper) ---
function showPageBadge(text) {
    const badge = document.createElement('div');
    badge.textContent = text;
    badge.style.position = 'fixed';
    badge.style.bottom = '16px';
    badge.style.right = '16px';
    badge.style.padding = '6px 12px';
    badge.style.fontSize = '11px';
    badge.style.borderRadius = '999px';
    badge.style.background = 'rgba(15,23,42,0.9)';
    badge.style.color = 'white';
    badge.style.border = '1px solid rgba(148,163,184,0.7)';
    badge.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
    badge.style.zIndex = '9999';

    document.body.appendChild(badge);

    setTimeout(() => {
        badge.style.opacity = '0';
        badge.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
            if (badge.parentNode) {
                badge.parentNode.removeChild(badge);
            }
        }, 400);
    }, 2000);
}
