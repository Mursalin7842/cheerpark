// Page-specific JS for login_register.html

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

function setAuthMessage(targetId, text) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.textContent = text;
}

// --- LOGIN (uses login.php) ---
function handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    setAuthMessage('login-message', '');

    fetch('login.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = 'dashboard_chats.html';
            } else {
                setAuthMessage('login-message', data.message || 'Login failed.');
            }
        })
        .catch(() => {
            setAuthMessage('login-message', 'Could not contact server. Make sure PHP is running.');
        });
}

// --- REGISTER (uses register.php) ---
function handleRegister(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    setAuthMessage('register-message', '');

    fetch('register.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                toggleAuth('login');
                setAuthMessage('login-message', 'Account created! Please log in.');
            } else {
                setAuthMessage('register-message', data.message || 'Registration failed.');
            }
        })
        .catch(() => {
            setAuthMessage('register-message', 'Could not contact server. Make sure PHP is running.');
        });
}

// --- SIMPLE PAGE INDICATOR (helper) ---
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

document.addEventListener('DOMContentLoaded', () => {
    showPageBadge('JS active: Login & Register page');

    const userInput = document.getElementById('login-username');
    if (userInput) {
        userInput.focus();
    }
});
