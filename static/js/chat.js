/**
 * PlantGuard AI - Standalone Agri-AI Chat Page Logic
 * Manages general agricultural AI chat queries, multi-turn history,
 * language switching (English, Odia, Hindi), quick suggestion chips,
 * and conversational resets.
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const chatLangSelect = document.getElementById("chatLangSelect");
    const chatStatusLabel = document.getElementById("chatStatusLabel");
    const chatStatusDot = document.getElementById("chatStatusDot");
    const newChatBtn = document.getElementById("newChatBtn");
    const chatSuggestions = document.getElementById("chatSuggestions");
    const chatMessagesContainer = document.getElementById("standaloneChatMessages");
    const chatForm = document.getElementById("standaloneChatForm");
    const chatInput = document.getElementById("standaloneChatInput");
    const chatSendBtn = document.getElementById("standaloneChatSendBtn");

    // State
    let conversationHistory = []; // Array of { role: 'user'|'model', text: '...' }
    let isWaitingForResponse = false;
    let isRealAIConfigured = false;

    // Language initialization
    let currentLang = localStorage.getItem("plantguard_lang") || "en";
    if (!translations[currentLang]) {
        currentLang = "en";
    }

    if (chatLangSelect) {
        chatLangSelect.value = currentLang;
        chatLangSelect.addEventListener("change", (e) => {
            switchLanguage(e.target.value);
        });
    }

    // 1. Initial health check
    checkChatEngineStatus();

    // 2. Initial language setup and greeting / saved history
    applyLanguage(currentLang);
    loadSavedHistoryOrGreeting();

    // 3. Event Listeners
    if (newChatBtn) {
        newChatBtn.addEventListener("click", () => {
            resetChat(true);
        });
    }

    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            sendMessage();
        });
    }

    if (chatInput) {
        // Enter to send (Shift+Enter for newline)
        chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-expand textarea height slightly as user types
        chatInput.addEventListener("input", () => {
            chatInput.style.height = "auto";
            chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
        });
    }

    // Quick suggestion chips click handler
    if (chatSuggestions) {
        chatSuggestions.addEventListener("click", (e) => {
            const chip = e.target.closest(".quick-chip");
            if (chip && !isWaitingForResponse) {
                const text = chip.textContent.trim();
                if (text && chatInput) {
                    chatInput.value = text;
                    sendMessage();
                }
            }
        });
    }

    /**
     * Checks if Gemini Chat is active via /api/health
     */
    async function checkChatEngineStatus() {
        try {
            const resp = await fetch("/api/health");
            const data = await resp.json();
            isRealAIConfigured = !!data.chat_ai_configured;
            updateStatusBadge();
        } catch (err) {
            isRealAIConfigured = false;
            updateStatusBadge();
        }
    }

    function updateStatusBadge() {
        const t = translations[currentLang] || translations.en;
        if (isRealAIConfigured) {
            chatStatusLabel.textContent = t.status_real_ai || "🟢 Gemini AI Chat Active";
            chatStatusDot.className = "status-dot green";
        } else {
            chatStatusLabel.textContent = t.status_fallback || "🟡 API Key Needed";
            chatStatusDot.className = "status-dot yellow";
        }
    }

    /**
     * Changes language and re-translates UI elements
     */
    function switchLanguage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        localStorage.setItem("plantguard_lang", lang);
        applyLanguage(lang);
        updateStatusBadge();

        // If conversation is just the initial greeting, update greeting to new language
        if (conversationHistory.length === 0) {
            resetChat(false);
        }
    }

    /**
     * Applies translations to elements with data-i18n & placeholders
     */
    function applyLanguage(lang) {
        const t = translations[lang] || translations.en;

        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            if (t[key] !== undefined) {
                el.textContent = t[key];
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (t[key] !== undefined) {
                el.placeholder = t[key];
            }
        });

        // Update suggestion chip labels
        document.querySelectorAll(".quick-chip").forEach((chip) => {
            const promptKey = chip.getAttribute("data-prompt-key");
            if (promptKey && t[promptKey]) {
                chip.textContent = t[promptKey];
            }
        });

        // Document title
        if (lang === "or") {
            document.title = "ପ୍ଲାଣ୍ଟଗାର୍ଡ AI 🌿 - କୃଷି AI ଚାଟ୍ ଓ ପରାମର୍ଶ";
        } else if (lang === "hi") {
            document.title = "प्लांटगार्ड AI 🌿 - कृषि AI चैट एवं मार्गदर्शन";
        } else {
            document.title = "PlantGuard AI 🌿 - Agricultural AI Chat & Guidance";
        }
    }

    const STORAGE_KEY = "plantguard_assistant_history";

    /**
     * Loads saved session history or displays greeting
     */
    function loadSavedHistoryOrGreeting() {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) {
                conversationHistory = JSON.parse(saved);
            }
        } catch (e) {
            conversationHistory = [];
        }

        if (conversationHistory && conversationHistory.length > 0) {
            chatMessagesContainer.innerHTML = "";
            conversationHistory.forEach((msg) => {
                const role = msg.role === "user" ? "user" : "assistant";
                appendMessageBubble(role, msg.text);
            });
            scrollToBottom();
        } else {
            resetChat(false);
        }
    }

    /**
     * Resets conversation history and restores initial greeting
     */
    function resetChat(userInitiated = false) {
        conversationHistory = [];
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch (e) {}

        chatMessagesContainer.innerHTML = "";

        const t = translations[currentLang] || translations.en;
        const greetingText = t.chat_initial_greeting || "Hello! I am your PlantGuard AI Assistant. How can I help you today?";

        appendMessageBubble("assistant", greetingText);

        if (chatInput) {
            chatInput.value = "";
            chatInput.style.height = "auto";
            if (userInitiated) {
                chatInput.focus();
            }
        }
    }

    /**
     * Sends user message to server /api/chat endpoint
     */
    async function sendMessage(customText = null) {
        if (isWaitingForResponse) return;

        const text = (customText !== null ? customText : (chatInput ? chatInput.value : "")).trim();
        if (!text) return;

        const t = translations[currentLang] || translations.en;

        // Clear input
        if (chatInput) {
            chatInput.value = "";
            chatInput.style.height = "auto";
        }

        // Add user bubble
        appendMessageBubble("user", text);

        // Show typing indicator
        const typingEl = appendTypingIndicator();
        isWaitingForResponse = true;
        setFormEnabled(false);
        scrollToBottom();

        try {
            const payload = {
                message: text,
                history: conversationHistory,
                language: currentLang
            };

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            removeTypingIndicator(typingEl);

            if (response.ok && data.success) {
                // Successful AI reply
                appendMessageBubble("assistant", data.reply);

                // Add to history
                conversationHistory.push({ role: "user", text: text });
                conversationHistory.push({ role: "model", text: data.reply });

                // Keep history trimmed to last 10 messages
                if (conversationHistory.length > 10) {
                    conversationHistory = conversationHistory.slice(-10);
                }
                try {
                    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(conversationHistory));
                } catch (e) {}
            } else {
                // Server returned error (missing key, rate limit, malformed request, etc.)
                handleChatError(data, text);
            }

        } catch (netErr) {
            removeTypingIndicator(typingEl);
            const netMsg = currentLang === "or"
                ? "ସର୍ଭର ସହିତ ସଂଯୋଗ ହୋଇପାରିଲା ନାହିଁ। ଦୟାକରି ଯାଞ୍ଚ କରନ୍ତୁ।"
                : currentLang === "hi"
                ? "सर्वर से कनेक्ट करने में असमर्थ। कृपया कनेक्शन जांचें।"
                : "Unable to connect to the server. Please check your network connection.";
            appendErrorBubble(netMsg, text);
        } finally {
            isWaitingForResponse = false;
            setFormEnabled(true);
            if (chatInput) chatInput.focus();
            scrollToBottom();
        }
    }

    /**
     * Handles API error conditions cleanly with explicit guidance
     */
    function handleChatError(data, failedPrompt) {
        const t = translations[currentLang] || translations.en;

        if (data && data.api_key_missing) {
            const warningMsg = t.chat_missing_key_warning || (
                "⚠️ Gemini API key is not configured on the server. Please add your GEMINI_API_KEY in the server .env file to enable live AI chat."
            );
            appendNoticeBubble(warningMsg);
        } else {
            const errorMsg = (data && data.error) ? data.error : "An unexpected error occurred while communicating with Gemini.";
            appendErrorBubble(errorMsg, failedPrompt);
        }
    }

    /**
     * Appends message bubble to chat container
     */
    function appendMessageBubble(role, rawText) {
        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${role}`;

        const avatar = document.createElement("div");
        avatar.className = "chat-avatar";
        avatar.textContent = role === "user" ? "👤" : "🌿";

        const content = document.createElement("div");
        content.className = "chat-content";
        content.innerHTML = formatMarkdownText(rawText);

        bubble.appendChild(avatar);
        bubble.appendChild(content);
        chatMessagesContainer.appendChild(bubble);
        scrollToBottom();
    }

    /**
     * Appends a notice bubble for missing API key
     */
    function appendNoticeBubble(noticeText) {
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble system-notice";

        const avatar = document.createElement("div");
        avatar.className = "chat-avatar";
        avatar.textContent = "⚙️";

        const content = document.createElement("div");
        content.className = "chat-content notice-content";
        content.innerHTML = `<strong>Configuration Notice:</strong><p>${escapeHtml(noticeText)}</p>`;

        bubble.appendChild(avatar);
        bubble.appendChild(content);
        chatMessagesContainer.appendChild(bubble);
        scrollToBottom();
    }

    /**
     * Appends an error bubble with retry action
     */
    function appendErrorBubble(errorMessage, retryText) {
        const t = translations[currentLang] || translations.en;
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble error";

        const avatar = document.createElement("div");
        avatar.className = "chat-avatar";
        avatar.textContent = "⚠️";

        const content = document.createElement("div");
        content.className = "chat-content error-content";
        content.innerHTML = `<strong>${t.chat_error_prefix || "Error:"}</strong> <p>${escapeHtml(errorMessage)}</p>`;

        if (retryText) {
            const retryBtn = document.createElement("button");
            retryBtn.type = "button";
            retryBtn.className = "btn btn-sm btn-retry";
            retryBtn.textContent = `↺ ${t.chat_retry || "Retry"}`;
            retryBtn.addEventListener("click", () => {
                bubble.remove();
                sendMessage(retryText);
            });
            content.appendChild(retryBtn);
        }

        bubble.appendChild(avatar);
        bubble.appendChild(content);
        chatMessagesContainer.appendChild(bubble);
        scrollToBottom();
    }

    /**
     * Typing indicator dots
     */
    function appendTypingIndicator() {
        const t = translations[currentLang] || translations.en;
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble assistant typing-bubble";
        bubble.id = "activeTypingIndicator";

        const avatar = document.createElement("div");
        avatar.className = "chat-avatar";
        avatar.textContent = "🌿";

        const content = document.createElement("div");
        content.className = "chat-content";
        content.innerHTML = `
            <div class="typing-indicator" title="${t.chat_typing || 'Typing...'}">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;

        bubble.appendChild(avatar);
        bubble.appendChild(content);
        chatMessagesContainer.appendChild(bubble);
        return bubble;
    }

    function removeTypingIndicator(el) {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        } else {
            const fallback = document.getElementById("activeTypingIndicator");
            if (fallback) fallback.remove();
        }
    }

    function setFormEnabled(enabled) {
        if (chatInput) chatInput.disabled = !enabled;
        if (chatSendBtn) chatSendBtn.disabled = !enabled;
    }

    function scrollToBottom() {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    /**
     * Converts basic markdown (bold, bullets, paragraphs) into safe HTML
     */
    function formatMarkdownText(text) {
        if (!text) return "";
        let escaped = escapeHtml(text);

        // Bold **text**
        escaped = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Bullet points starting with * or -
        const lines = escaped.split("\n");
        let formatted = "";
        let inList = false;

        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
                if (!inList) {
                    formatted += '<ul class="chat-bullet-list">';
                    inList = true;
                }
                formatted += `<li>${trimmed.substring(2)}</li>`;
            } else {
                if (inList) {
                    formatted += "</ul>";
                    inList = false;
                }
                if (trimmed.length > 0) {
                    formatted += `<p>${line}</p>`;
                }
            }
        });

        if (inList) {
            formatted += "</ul>";
        }

        return formatted;
    }

    function escapeHtml(string) {
        const div = document.createElement("div");
        div.textContent = string;
        return div.innerHTML;
    }
});
