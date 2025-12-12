// Page-specific JS for dashboard_people_team.html

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
    showPageBadge('JS active: People & Team dashboard');

    const searchInput = document.querySelector('.people-search-input');
    const cards = Array.from(document.querySelectorAll('.people-card'));

    function normalise(text) {
        return text.toLowerCase().trim();
    }

    function handleSearch() {
        if (!searchInput) return;
        const term = normalise(searchInput.value);

        cards.forEach(card => {
            const name = card.querySelector('h4')?.textContent || '';
            const idText = card.querySelector('p.text-sm.text-muted')?.textContent || '';
            const combined = normalise(name + ' ' + idText);
            card.style.display = term === '' || combined.includes(term) ? '' : 'none';
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    function addChatIfMissing(name) {
        const raw = localStorage.getItem('cheerpark_chats');
        let chats = [];
        try {
            chats = raw ? JSON.parse(raw) : [];
        } catch {
            chats = [];
        }
        if (!Array.isArray(chats)) chats = [];

        const exists = chats.some(c => c && c.name === name);
        if (!exists) {
            chats.push({ name });
        }

        localStorage.setItem('cheerpark_chats', JSON.stringify(chats));
        return chats;
    }

    // MESSAGE: open inbox + create/update chat entry
    const messageButtons = document.querySelectorAll('.people-card .btn-pink.people-button-full');
    messageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.people-card');
            const name = card?.querySelector('h4')?.textContent?.trim() || 'New Chat';

            addChatIfMissing(name);
            localStorage.setItem('cheerpark_selected_chat', name);

            // Go to inbox (chats page)
            window.location.href = 'dashboard_chats.html';
        });
    });

    // CONNECT: mark as connected and ensure chat exists (no redirect)
    const connectButtons = document.querySelectorAll('.people-card .btn-outline.people-button-full');
    connectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.people-card');
            const name = card?.querySelector('h4')?.textContent?.trim();

            if (name) {
                addChatIfMissing(name);
            }

            btn.textContent = 'Connected';
            btn.disabled = true;
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-pink');

            if (card) {
                card.classList.add('people-card--highlight');
            }
        });
    });
});
