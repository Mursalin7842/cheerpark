// Page-specific JS for dashboard_settings_account.html

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

function logout() {
    window.location.href = 'login_register.html';
}

document.addEventListener('DOMContentLoaded', () => {
    showPageBadge('JS active: Settings dashboard');

    const SETTINGS_KEY = 'cheerpark_settings_account';

    function loadSettings() {
        try {
            const raw = localStorage.getItem(SETTINGS_KEY);
            if (!raw) return {};
            return JSON.parse(raw) || {};
        } catch (e) {
            return {};
        }
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn('Could not save settings', e);
        }
    }

    function applyToggleState(toggleEl, on) {
        if (!toggleEl) return;
        const thumb = toggleEl.querySelector('.toggle-thumb, .toggle-thumb--off');
        if (!thumb) return;

        if (on) {
            toggleEl.classList.remove('toggle--off');
            thumb.classList.remove('toggle-thumb--off');
            thumb.classList.add('toggle-thumb');
        } else {
            toggleEl.classList.add('toggle--off');
            thumb.classList.remove('toggle-thumb');
            thumb.classList.add('toggle-thumb--off');
        }
    }

    function applyAvatar(avatarBox, settings) {
        if (!avatarBox) return;
        if (settings.avatarDataUrl) {
            avatarBox.style.backgroundImage = `url(${settings.avatarDataUrl})`;
            avatarBox.style.backgroundSize = 'cover';
            avatarBox.style.backgroundPosition = 'center';
            avatarBox.innerHTML = '';
        } else {
            avatarBox.style.backgroundImage = '';
            avatarBox.innerHTML = '<i class="fas fa-user text-white"></i>';
        }
    }

    const avatarBox = document.querySelector('.settings-avatar');
    const avatarInput = document.getElementById('settings-avatar-input');
    const avatarChangeBtn = document.querySelector('.settings-avatar-btn-primary');
    const avatarRemoveBtn = document.querySelector('.settings-avatar-btn-danger');

    const displayNameInput = document.querySelector('.settings-display-name');
    const statusInput = document.querySelector('.settings-status');
    const emailInput = document.querySelector('.settings-email');

    const desktopToggle = document.querySelector('.settings-toggle-desktop');
    const soundToggle = document.querySelector('.settings-toggle-sound');

    const saveBtn = document.querySelector('.settings-save-btn');
    const cancelBtn = document.querySelector('.settings-cancel-btn');

    let settings = loadSettings();

    // Initialize fields from stored settings (falling back to existing values)
    if (displayNameInput) {
        displayNameInput.value = settings.displayName || displayNameInput.value;
    }
    if (statusInput) {
        statusInput.value = settings.statusMessage || statusInput.value;
    }
    if (emailInput) {
        emailInput.value = settings.email || emailInput.value;
    }

    const desktopOn = settings.desktopNotifications !== undefined ? settings.desktopNotifications : true;
    const soundOn = settings.soundEffects !== undefined ? settings.soundEffects : false;

    applyToggleState(desktopToggle, desktopOn);
    applyToggleState(soundToggle, soundOn);

    applyAvatar(avatarBox, settings);

    if (desktopToggle) {
        desktopToggle.addEventListener('click', () => {
            const current = settings.desktopNotifications !== undefined ? settings.desktopNotifications : desktopOn;
            const next = !current;
            settings.desktopNotifications = next;
            applyToggleState(desktopToggle, next);
            saveSettings(settings);
        });
    }

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            const current = settings.soundEffects !== undefined ? settings.soundEffects : soundOn;
            const next = !current;
            settings.soundEffects = next;
            applyToggleState(soundToggle, next);
            saveSettings(settings);
        });
    }

    if (avatarChangeBtn && avatarInput && avatarBox) {
        avatarChangeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            avatarInput.click();
        });

        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                settings.avatarDataUrl = reader.result;
                applyAvatar(avatarBox, settings);
                saveSettings(settings);
            };
            reader.readAsDataURL(file);
        });
    }

    if (avatarRemoveBtn && avatarBox) {
        avatarRemoveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            settings.avatarDataUrl = null;
            applyAvatar(avatarBox, settings);
            saveSettings(settings);
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (displayNameInput) {
                settings.displayName = displayNameInput.value.trim();
            }
            if (statusInput) {
                settings.statusMessage = statusInput.value.trim();
            }
            if (emailInput) {
                settings.email = emailInput.value.trim();
            }

            saveSettings(settings);
            console.log('Settings saved:', settings);
            showPageBadge('Settings saved');
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.reload();
        });
    }
});
