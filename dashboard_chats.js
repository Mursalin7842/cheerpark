// Page-specific JS for dashboard_chats.html

// Local helper + logout (no app.js)
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
    showPageBadge('JS active: Chats dashboard');

    const input = document.querySelector('.chat-input-pill input');
    const sendBtn = document.querySelector('.chat-send-btn');
    const chatArea = document.querySelector('.chat-area');
    const chatListEl = document.getElementById('chat-list');
    const activeNameEl = document.getElementById('chat-active-name');

    // --- Chat list handling (inbox) ---
    function loadChatsFromStorage() {
        const raw = localStorage.getItem('cheerpark_chats');
        let chats = [];
        try {
            chats = raw ? JSON.parse(raw) : [];
        } catch {
            chats = [];
        }
        // No demo chats; return whatever the user has created
        return Array.isArray(chats) ? chats : [];
    }

    function saveChatsToStorage(chats) {
        localStorage.setItem('cheerpark_chats', JSON.stringify(chats));
    }

    function getSelectedChatName(chats) {
        const stored = localStorage.getItem('cheerpark_selected_chat');
        if (stored && chats.some(c => c.name === stored)) {
            return stored;
        }
        return chats[0]?.name || '';
    }

    function setActiveChat(name) {
        if (activeNameEl && name) {
            activeNameEl.textContent = name;
        }
        localStorage.setItem('cheerpark_selected_chat', name);

        // Highlight active item in list
        if (chatListEl) {
            Array.from(chatListEl.querySelectorAll('.list-item')).forEach(item => {
                const title = item.querySelector('h4')?.textContent?.trim();
                item.classList.toggle('people-card--highlight', title === name);
            });
        }
    }

    function renderChatList() {
        if (!chatListEl) return;
        const chats = loadChatsFromStorage();
        const selected = getSelectedChatName(chats);

        chatListEl.innerHTML = '';

        if (!chats.length) {
            const empty = document.createElement('p');
            empty.className = 'text-muted text-sm';
            empty.textContent = 'No chats yet. Start a conversation from People or type below.';
            chatListEl.appendChild(empty);
            if (activeNameEl) {
                activeNameEl.textContent = 'No chat selected';
            }
            return;
        }

        chats.forEach(chat => {
            const item = document.createElement('div');
            item.className = 'list-item';

            const avatarWrap = document.createElement('div');
            avatarWrap.className = 'relative';

            const avatar = document.createElement('div');
            avatar.className = 'chat-list-avatar';
            avatar.textContent = (chat.name || '?').charAt(0).toUpperCase();

            const statusDot = document.createElement('div');
            statusDot.className = 'chat-list-status-dot';

            avatarWrap.appendChild(avatar);
            avatarWrap.appendChild(statusDot);

            const textWrap = document.createElement('div');
            textWrap.className = 'chat-list-text';

            const topRow = document.createElement('div');
            topRow.className = 'flex justify-between items-baseline mb-1';

            const nameEl = document.createElement('h4');
            nameEl.className = 'font-bold text-sm';
            nameEl.textContent = chat.name;

            const timeEl = document.createElement('span');
            timeEl.className = 'chat-list-meta-time';
            timeEl.textContent = chat.time || '';

            topRow.appendChild(nameEl);
            topRow.appendChild(timeEl);

            const preview = document.createElement('p');
            preview.className = 'text-muted text-sm chat-list-preview';
            preview.textContent = chat.lastMessage || 'Start a new conversation';

            textWrap.appendChild(topRow);
            textWrap.appendChild(preview);

            item.appendChild(avatarWrap);
            item.appendChild(textWrap);

            item.addEventListener('click', () => {
                setActiveChat(chat.name);
            });

            chatListEl.appendChild(item);
        });

        setActiveChat(selected);
    }

    renderChatList();

    // --- Message sending within the active chat ---
    function addMessage(text, type) {
        if (!chatArea || !text.trim()) return;

        const wrapper = document.createElement('div');
        wrapper.className = type === 'sent' ? 'flex justify-end' : 'flex justify-start';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble ' + (type === 'sent' ? 'msg-sent' : 'msg-received');

        const p = document.createElement('p');
        p.textContent = text.trim();

        const meta = document.createElement('span');
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        meta.textContent = time;
        meta.className = type === 'sent' ? 'message-timestamp-right' : 'message-timestamp-left';

        bubble.appendChild(p);
        bubble.appendChild(meta);
        wrapper.appendChild(bubble);
        chatArea.appendChild(wrapper);

        chatArea.scrollTop = chatArea.scrollHeight;
    }

    function handleSend() {
        if (!input) return;
        const text = input.value;
        if (!text.trim()) return;

        addMessage(text, 'sent');

        input.value = '';

        // Simple fake reply so it feels interactive
        setTimeout(() => {
            addMessage('Got it! This is just a demo reply.', 'received');
        }, 600);

        // Update last message preview for the active chat
        const chats = loadChatsFromStorage();
        const activeName = getSelectedChatName(chats);
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const target = chats.find(c => c.name === activeName);
        if (target) {
            target.lastMessage = text.trim();
            target.time = time;
            saveChatsToStorage(chats);
            renderChatList();
        }
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', handleSend);
    }

    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });
    }
});
