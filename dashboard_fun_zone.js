// Page-specific JS for dashboard_fun_zone.html

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
    showPageBadge('JS active: Fun Zone dashboard');

    const listBody = document.querySelector('.funzone-list-body');
    const createBtn = document.querySelector('.funzone-create-btn');
    const anonInput = document.querySelector('.chat-anon-input-pill input');
    const anonSendBtn = document.querySelector('.chat-anon-send-btn');
    const chatArea = document.querySelector('.chat-area');
    const activeTitleEl = document.querySelector('.funzone-active-title');
    const activeIdentityEl = document.querySelector('.funzone-active-identity');

    const ZONE_STORAGE_KEY = 'cheerpark_fun_zones';
    const SELECTED_ZONE_KEY = 'cheerpark_selected_zone';

    function loadZones() {
        try {
            const raw = localStorage.getItem(ZONE_STORAGE_KEY);
            if (!raw) return null;
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : null;
        } catch (e) {
            return null;
        }
    }

    function saveZones(zones) {
        try {
            localStorage.setItem(ZONE_STORAGE_KEY, JSON.stringify(zones));
        } catch (e) {
            console.warn('Could not persist zones', e);
        }
    }

    let zones = loadZones();
    if (!zones) {
        zones = [
            {
                id: 'default-1',
                title: 'Group 1',
                subtitle: '"we are all anonymous"',
                onlineText: '40 Online'
            }
        ];
        saveZones(zones);
    }

    function setActiveZone(zoneId) {
        const zone = zones.find(z => z.id === zoneId) || zones[0];
        if (!zone) return;

        localStorage.setItem(SELECTED_ZONE_KEY, zone.id);

        if (activeTitleEl) {
            activeTitleEl.textContent = `${zone.title} (Anonymous)`;
        }
        if (activeIdentityEl) {
            activeIdentityEl.textContent = 'Identity: Guest_8842';
        }

        if (listBody) {
            Array.from(listBody.querySelectorAll('.funzone-list-item')).forEach(item => {
                const itemId = item.getAttribute('data-zone-id');
                item.classList.toggle('people-card--highlight', itemId === zone.id);
            });
        }
    }

    function createZoneElement(zone) {
        const wrapper = document.createElement('div');
        wrapper.className = 'list-item funzone-list-item';
        wrapper.setAttribute('data-zone-id', zone.id);

        const header = document.createElement('div');
        header.className = 'flex justify-between mb-2';

        const title = document.createElement('span');
        title.className = 'font-bold text-sm funzone-title';
        title.textContent = zone.title;

        const badge = document.createElement('span');
        badge.className = 'funzone-list-badge';
        badge.textContent = zone.onlineText || 'New Zone';

        header.appendChild(title);
        header.appendChild(badge);

        const subtitle = document.createElement('p');
        subtitle.className = 'text-muted text-sm italic';
        subtitle.textContent = zone.subtitle || '"New anonymous zone"';

        wrapper.appendChild(header);
        wrapper.appendChild(subtitle);

        wrapper.addEventListener('click', () => {
            setActiveZone(zone.id);
        });

        return wrapper;
    }

    function renderZones() {
        if (!listBody) return;
        listBody.innerHTML = '';
        zones.forEach(zone => {
            const el = createZoneElement(zone);
            listBody.appendChild(el);
        });

        const storedSelected = localStorage.getItem(SELECTED_ZONE_KEY);
        setActiveZone(storedSelected || zones[0].id);
    }

    const createZoneModal = document.getElementById('create-zone-modal');
    const createZoneForm = document.getElementById('create-zone-form');
    const createZoneName = document.getElementById('create-zone-name');
    const createZoneDescription = document.getElementById('create-zone-description');
    const createZoneClose = document.getElementById('create-zone-close');
    const createZoneCancel = document.getElementById('create-zone-cancel');

    function openCreateZoneModal() {
        if (!createZoneModal) return;
        createZoneModal.classList.remove('hidden');
        if (createZoneName) {
            createZoneName.value = '';
            createZoneName.focus();
        }
        if (createZoneDescription) {
            createZoneDescription.value = '';
        }
    }

    function closeCreateZoneModal() {
        if (!createZoneModal) return;
        createZoneModal.classList.add('hidden');
    }

    if (createBtn) {
        createBtn.addEventListener('click', () => {
            openCreateZoneModal();
        });
    }

    if (createZoneClose) {
        createZoneClose.addEventListener('click', closeCreateZoneModal);
    }

    if (createZoneCancel) {
        createZoneCancel.addEventListener('click', (e) => {
            e.preventDefault();
            closeCreateZoneModal();
        });
    }

    if (createZoneForm) {
        createZoneForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!createZoneName || !createZoneName.value.trim()) return;

            const id = `custom-${Date.now()}`;
            const title = createZoneName.value.trim();
            const desc = createZoneDescription && createZoneDescription.value.trim();

            const newZone = {
                id,
                title,
                subtitle: desc ? `"${desc}"` : '"New anonymous zone"',
                onlineText: 'New Zone'
            };

            zones.push(newZone);
            saveZones(zones);
            renderZones();
            setActiveZone(id);
            closeCreateZoneModal();
        });
    }

    renderZones();

    function addAnonMessage(text) {
        if (!chatArea || !text.trim()) return;

        const wrap = document.createElement('div');
        wrap.className = 'flex justify-end';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble msg-sent';

        const p = document.createElement('p');
        p.textContent = text.trim();

        bubble.appendChild(p);
        wrap.appendChild(bubble);
        chatArea.appendChild(wrap);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    function handleAnonSend() {
        if (!anonInput) return;
        const text = anonInput.value;
        if (!text.trim()) return;
        addAnonMessage(text);
        anonInput.value = '';
    }

    if (anonSendBtn) {
        anonSendBtn.addEventListener('click', handleAnonSend);
    }

    if (anonInput) {
        anonInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAnonSend();
            }
        });
    }
});
