// Page-specific JS for dashboard_explore_groups.html

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
    showPageBadge('JS active: Explore Groups dashboard');

    const EXPLORE_GROUPS = [
        {
            id: 'web-dev',
            title: 'Web Developers Hub',
            description: 'Discussing React, PHP, and modern web stacks.',
            icon: 'fa-code',
            tags: ['web', 'react', 'php', 'frontend', 'backend']
        },
        {
            id: 'cp-club',
            title: 'Competitive Programming Club',
            description: 'Daily problems, contests, and algorithm talk.',
            icon: 'fa-chess-knight',
            tags: ['cp', 'algorithms', 'contests']
        },
        {
            id: 'ui-ux',
            title: 'UI / UX Creators',
            description: 'Design critiques, Figma files, and portfolio feedback.',
            icon: 'fa-palette',
            tags: ['design', 'ui', 'ux', 'figma']
        },
        {
            id: 'anime',
            title: 'Anime & Chill',
            description: 'Talk about the latest episodes and fan theories.',
            icon: 'fa-dragon',
            tags: ['anime', 'manga', 'fun']
        }
    ];

    const STORAGE_KEY = 'cheerpark_explore_joined';
    const ZONE_STORAGE_KEY = 'cheerpark_fun_zones';
    const SELECTED_ZONE_KEY = 'cheerpark_selected_zone';

    function loadZonesForExplore() {
        try {
            const raw = localStorage.getItem(ZONE_STORAGE_KEY);
            if (!raw) return [];
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : [];
        } catch (e) {
            return [];
        }
    }

    function saveZonesForExplore(zones) {
        try {
            localStorage.setItem(ZONE_STORAGE_KEY, JSON.stringify(zones));
        } catch (e) {
            console.warn('Could not persist zones from explore', e);
        }
    }

    function loadJoined() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : [];
        } catch (e) {
            return [];
        }
    }

    function saveJoined(list) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (e) {
            console.warn('Could not persist joined groups', e);
        }
    }

    let joined = loadJoined();

    const exploreGrid = document.querySelector('.explore-grid');
    const searchInput = document.querySelector('.explore-search-input');

    function createCard(group) {
        const card = document.createElement('div');
        card.className = 'explore-card';
        card.dataset.groupId = group.id;
        card.dataset.tags = group.tags.join(' ');

        const isJoined = joined.includes(group.id);

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="explore-icon-box">
                    <i class="fas ${group.icon}"></i>
                </div>
                <button class="btn-outline explore-join-btn" data-group-id="${group.id}"></button>
            </div>
            <h4 class="font-bold text-lg mb-2">${group.title}</h4>
            <p class="text-sm text-muted mb-4">${group.description}</p>
        `;

        const btn = card.querySelector('.explore-join-btn');
        if (btn) {
            updateJoinButton(btn, isJoined);
        }

        return card;
    }

    function updateJoinButton(btn, isJoined) {
        if (isJoined) {
            btn.textContent = 'Joined';
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-pink');
            btn.dataset.joined = 'true';
        } else {
            btn.textContent = 'Join Group';
            btn.classList.add('btn-outline');
            btn.classList.remove('btn-pink');
            delete btn.dataset.joined;
        }
    }

    function renderGroups() {
        if (!exploreGrid) return;
        exploreGrid.innerHTML = '';
        EXPLORE_GROUPS.forEach(group => {
            const card = createCard(group);
            exploreGrid.appendChild(card);
        });
    }

    function norm(text) {
        return text.toLowerCase().trim();
    }

    function handleSearch() {
        if (!searchInput) return;
        const term = norm(searchInput.value);

        const cards = Array.from(document.querySelectorAll('.explore-card'));
        let visibleCount = 0;

        cards.forEach(card => {
            const title = card.querySelector('h4')?.textContent || '';
            const desc = card.querySelector('p.text-sm.text-muted')?.textContent || '';
            const tags = card.dataset.tags || '';
            const combined = norm(title + ' ' + desc + ' ' + tags);

            const match = term === '' || combined.includes(term);
            card.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });

        if (visibleCount === 0 && term !== '') {
            exploreGrid.classList.add('explore-grid-empty');
        } else if (exploreGrid) {
            exploreGrid.classList.remove('explore-grid-empty');
        }
    }

    renderGroups();

    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;

        if (target.matches('.explore-join-btn')) {
            const groupId = target.dataset.groupId;
            if (!groupId) return;

            const group = EXPLORE_GROUPS.find(g => g.id === groupId);
            const isCurrentlyJoined = joined.includes(groupId);

            let zones = loadZonesForExplore();
            const zoneId = `explore-${groupId}`;

            if (isCurrentlyJoined) {
                joined = joined.filter(id => id !== groupId);
                updateJoinButton(target, false);

                // Remove matching zone if it exists
                zones = zones.filter(z => z.id !== zoneId);
                const selected = localStorage.getItem(SELECTED_ZONE_KEY);
                if (selected === zoneId) {
                    localStorage.removeItem(SELECTED_ZONE_KEY);
                }
            } else {
                joined.push(groupId);
                updateJoinButton(target, true);

                if (group) {
                    const exists = zones.some(z => z.id === zoneId);
                    if (!exists) {
                        zones.push({
                            id: zoneId,
                            title: group.title,
                            subtitle: `"${group.description}"`,
                            onlineText: 'Joined from Explore'
                        });
                    }
                    localStorage.setItem(SELECTED_ZONE_KEY, zoneId);
                    // Navigate to Fun Zone so messaging is available there
                    window.location.href = 'dashboard_fun_zone.html';
                }
            }

            saveJoined(joined);
            saveZonesForExplore(zones);
        }
    });

    handleSearch();
});
