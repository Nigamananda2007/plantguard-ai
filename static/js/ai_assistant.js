/**
 * PlantGuard AI - Persistent ChatGPT-Style AI Assistant Widget
 * Powers the persistent floating AI Assistant button and slide-up chat panel.
 * Supports English, Odia, and Hindi for ANY general question and plant care.
 * Maintains session conversation history, provides New Chat, and communicates
 * securely with the Flask /api/chat endpoint without exposing API keys.
 */

(function () {
    // Wait for DOM to be ready
    document.addEventListener("DOMContentLoaded", initAIAssistant);

    function initAIAssistant() {
        const floatingBtn = document.getElementById("aiAssistantFloatingBtn");
        const panel = document.getElementById("aiAssistantPanel");
        const closeBtn = document.getElementById("aiPanelCloseBtn");
        const newChatBtn = document.getElementById("aiPanelNewChatBtn");
        const messagesContainer = document.getElementById("aiPanelMessages");
        const form = document.getElementById("aiPanelForm");
        const input = document.getElementById("aiPanelInput");
        const sendBtn = document.getElementById("aiPanelSendBtn");
        const suggestions = document.getElementById("aiPanelSuggestions");
        const statusDot = document.getElementById("aiPanelStatusDot");
        const statusText = document.getElementById("aiPanelStatusText");

        if (!floatingBtn || !panel) {
            return; // Not present on page
        }

        // State
        const STORAGE_KEY = "plantguard_assistant_history";
        let conversationHistory = [];
        let isWaitingForResponse = false;

        // Current Language
        let currentLang = localStorage.getItem("plantguard_lang") || "en";
        if (typeof translations === "undefined" || !translations[currentLang]) {
            currentLang = "en";
        }

        // 1. Load existing session history or display fresh greeting
        loadSessionHistory();

        // 2. Check health status for live badge indicator
        checkEngineStatus();

        // 3. Event Listeners
        floatingBtn.addEventListener("click", () => {
            const isHidden = panel.classList.contains("hidden");
            if (isHidden) {
                panel.classList.remove("hidden");
                scrollToBottom();
                if (input) input.focus();
            } else {
                panel.classList.add("hidden");
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                panel.classList.add("hidden");
            });
        }

        if (newChatBtn) {
            newChatBtn.addEventListener("click", () => {
                resetConversation(true);
            });
        }

        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                sendMessage();
            });
        }

        if (input) {
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });

            // Auto-expand textarea height
            input.addEventListener("input", () => {
                input.style.height = "auto";
                input.style.height = Math.min(input.scrollHeight, 100) + "px";
            });
        }

        if (suggestions) {
            suggestions.addEventListener("click", (e) => {
                const chip = e.target.closest(".quick-chip");
                if (chip && !isWaitingForResponse) {
                    const promptText = chip.getAttribute("data-prompt") || chip.textContent.trim();
                    if (promptText && input) {
                        input.value = promptText;
                        sendMessage();
                    }
                }
            });
        }

        // Listen for language selector updates
        const langDropdown = document.getElementById("langSelect") || document.getElementById("chatLangSelect");
        if (langDropdown) {
            langDropdown.addEventListener("change", (e) => {
                currentLang = e.target.value;
                applyPanelTranslations(currentLang);
            });
        }

        // Apply translations on load
        applyPanelTranslations(currentLang);

        /**
         * Checks health status from /api/health
         */
        async function checkEngineStatus() {
            try {
                const res = await fetch("/api/health");
                const data = await res.json();
                if (statusDot && statusText) {
                    if (data.chat_ai_configured || data.real_ai_configured) {
                        statusDot.className = "status-dot green";
                        statusText.textContent = getTranslation("assistant_panel_status", "ChatGPT-Style AI");
                    } else {
                        statusDot.className = "status-dot yellow";
                        statusText.textContent = currentLang === "or" ? "କୀ ଆବଶ୍ୟକ" : "Key Needed";
                    }
                }
            } catch (err) {
                if (statusDot) statusDot.className = "status-dot yellow";
            }
        }

        /**
         * Loads conversation history from sessionStorage
         */
        function loadSessionHistory() {
            try {
                const saved = sessionStorage.getItem(STORAGE_KEY);
                if (saved) {
                    conversationHistory = JSON.parse(saved);
                }
            } catch (e) {
                conversationHistory = [];
            }

            renderMessages();
        }

        /**
         * Saves conversation history to sessionStorage
         */
        function saveSessionHistory() {
            try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(conversationHistory));
            } catch (e) {
                // Ignore storage limits
            }
        }

        /**
         * Renders all conversation messages or greeting if empty
         */
        function renderMessages() {
            if (!messagesContainer) return;
            messagesContainer.innerHTML = "";

            if (!conversationHistory || conversationHistory.length === 0) {
                const greeting = getTranslation(
                    "assistant_welcome_greeting",
                    "Hello! I am your PlantGuard AI Assistant. You can ask me ANY question — general knowledge, science, coding, history, or plant health in English & Odia. How can I help you today?"
                );
                appendMessageBubble("assistant", greeting, false);
            } else {
                conversationHistory.forEach((msg) => {
                    const role = msg.role === "user" ? "user" : "assistant";
                    appendMessageBubble(role, msg.text, false);
                });
            }

            scrollToBottom();
        }

        /**
         * Resets conversation history
         */
        function resetConversation(userInitiated = false) {
            conversationHistory = [];
            try {
                sessionStorage.removeItem(STORAGE_KEY);
            } catch (e) {}

            renderMessages();

            if (input) {
                input.value = "";
                input.style.height = "auto";
                if (userInitiated) {
                    input.focus();
                }
            }
        }

        /**
         * Sends message to /api/chat
         */
        async function sendMessage(customText = null) {
            if (isWaitingForResponse) return;

            const text = (customText !== null ? customText : (input ? input.value : "")).trim();
            if (!text) return;

            if (input) {
                input.value = "";
                input.style.height = "auto";
            }

            // Append user bubble to UI
            appendMessageBubble("user", text, true);

            // Add typing indicator
            const typingEl = appendTypingIndicator();
            isWaitingForResponse = true;
            setFormState(false);
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
                    // Successful AI response
                    appendMessageBubble("assistant", data.reply, true);

                    // Add to session history
                    conversationHistory.push({ role: "user", text: text });
                    conversationHistory.push({ role: "model", text: data.reply });

                    // Keep recent 10 messages for performance
                    if (conversationHistory.length > 10) {
                        conversationHistory = conversationHistory.slice(-10);
                    }
                    saveSessionHistory();

                } else {
                    // Display honest error message
                    handleChatError(data, text);
                }

            } catch (err) {
                removeTypingIndicator(typingEl);
                const netError = currentLang === "or"
                    ? "ସର୍ଭର ସହିତ ସଂଯୋଗ ହୋଇପାରିଲା ନାହିଁ। ଦୟାକରି ଆପଣଙ୍କ ଇଣ୍ଟରନେଟ୍ ଯାଞ୍ଚ କରନ୍ତୁ।"
                    : "Unable to connect to the server. Please verify your network connection.";
                appendErrorBubble(netError, text);
            } finally {
                isWaitingForResponse = false;
                setFormState(true);
                if (input) input.focus();
                scrollToBottom();
            }
        }

        /**
         * Handles server errors with clear explanations (no fake answers)
         */
        function handleChatError(data, failedPrompt) {
            let errorMsg = "";

            if (data && data.api_key_missing) {
                errorMsg = data.error || getTranslation(
                    "chat_missing_key_warning",
                    "Gemini API key is not configured on the server. Please add GEMINI_API_KEY in the server .env file to enable live AI chat."
                );
            } else if (data && data.error) {
                errorMsg = data.error;
            } else {
                errorMsg = currentLang === "or"
                    ? "ଏହି ମୁହୂର୍ତ୍ତରେ AI ଉତ୍ତର ପ୍ରଦାନ କରିବାରେ ଅସମର୍ଥ। ଦୟାକରି ପରେ ଚେଷ୍ଟା କରନ୍ତୁ।"
                    : "The AI service is temporarily unavailable. Please try again shortly.";
            }

            appendErrorBubble(errorMsg, failedPrompt);
        }

        /**
         * Appends a message bubble
         */
        function appendMessageBubble(role, text, animate = false) {
            if (!messagesContainer) return;

            const bubble = document.createElement("div");
            bubble.className = `chat-bubble chat-bubble-${role}`;
            if (animate) bubble.classList.add("bubble-appear");

            const avatar = document.createElement("span");
            avatar.className = "chat-avatar";
            avatar.textContent = role === "user" ? "👤" : "🤖";

            const content = document.createElement("div");
            content.className = "chat-bubble-content";
            content.innerHTML = formatText(text);

            bubble.appendChild(avatar);
            bubble.appendChild(content);
            messagesContainer.appendChild(bubble);

            if (animate) {
                scrollToBottom();
            }
        }

        /**
         * Appends an error bubble
         */
        function appendErrorBubble(message, failedPrompt) {
            if (!messagesContainer) return;

            const bubble = document.createElement("div");
            bubble.className = "chat-bubble chat-bubble-error bubble-appear";

            const icon = document.createElement("span");
            icon.className = "chat-avatar";
            icon.textContent = "⚠️";

            const content = document.createElement("div");
            content.className = "chat-bubble-content";

            const textP = document.createElement("p");
            textP.className = "chat-error-text";
            textP.textContent = message;
            content.appendChild(textP);

            if (failedPrompt) {
                const retryBtn = document.createElement("button");
                retryBtn.type = "button";
                retryBtn.className = "btn-chat-retry";
                retryBtn.textContent = currentLang === "or" ? "🔄 ପୁନଃଚେଷ୍ଟା କରନ୍ତୁ" : "🔄 Retry";
                retryBtn.addEventListener("click", () => {
                    bubble.remove();
                    sendMessage(failedPrompt);
                });
                content.appendChild(retryBtn);
            }

            bubble.appendChild(icon);
            bubble.appendChild(content);
            messagesContainer.appendChild(bubble);
            scrollToBottom();
        }

        /**
         * Appends typing indicator
         */
        function appendTypingIndicator() {
            if (!messagesContainer) return null;

            const bubble = document.createElement("div");
            bubble.className = "chat-bubble chat-bubble-assistant chat-typing-bubble";

            const avatar = document.createElement("span");
            avatar.className = "chat-avatar";
            avatar.textContent = "🤖";

            const content = document.createElement("div");
            content.className = "chat-bubble-content chat-typing-content";
            content.innerHTML = `
                <div class="typing-indicator" aria-label="Thinking">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            `;

            bubble.appendChild(avatar);
            bubble.appendChild(content);
            messagesContainer.appendChild(bubble);
            scrollToBottom();

            return bubble;
        }

        function removeTypingIndicator(el) {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }

        function setFormState(enabled) {
            if (input) input.disabled = !enabled;
            if (sendBtn) sendBtn.disabled = !enabled;
        }

        function scrollToBottom() {
            if (!messagesContainer) return;
            requestAnimationFrame(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            });
        }

        /**
         * Formats text with simple markdown support
         */
        function formatText(raw) {
            if (!raw) return "";

            let safe = raw
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            // Bold: **text**
            safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

            // Inline code: `code`
            safe = safe.replace(/`([^`]+)`/g, "<code>$1</code>");

            // Bullet points
            const lines = safe.split("\n");
            let inList = false;
            let resultHtml = "";

            lines.forEach((line) => {
                const trimmed = line.trim();
                if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
                    if (!inList) {
                        resultHtml += '<ul class="chat-bullets">';
                        inList = true;
                    }
                    resultHtml += `<li>${trimmed.substring(2)}</li>`;
                } else if (/^\d+\.\s/.test(trimmed)) {
                    if (!inList) {
                        resultHtml += '<ul class="chat-numbered">';
                        inList = true;
                    }
                    resultHtml += `<li>${trimmed.replace(/^\d+\.\s/, "")}</li>`;
                } else {
                    if (inList) {
                        resultHtml += "</ul>";
                        inList = false;
                    }
                    if (trimmed) {
                        resultHtml += `<p>${line}</p>`;
                    } else {
                        resultHtml += "<br>";
                    }
                }
            });

            if (inList) {
                resultHtml += "</ul>";
            }

            return resultHtml;
        }

        /**
         * Translates UI labels inside the panel
         */
        function applyPanelTranslations(lang) {
            if (typeof translations === "undefined" || !translations[lang]) return;
            const t = translations[lang];

            panel.querySelectorAll("[data-i18n]").forEach((el) => {
                const key = el.getAttribute("data-i18n");
                if (t[key] !== undefined) {
                    el.textContent = t[key];
                }
            });

            panel.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
                const key = el.getAttribute("data-i18n-placeholder");
                if (t[key] !== undefined) {
                    el.setAttribute("placeholder", t[key]);
                }
            });

            panel.querySelectorAll("[data-i18n-title]").forEach((el) => {
                const key = el.getAttribute("data-i18n-title");
                if (t[key] !== undefined) {
                    el.setAttribute("title", t[key]);
                }
            });

            // Update floating button text
            if (floatingBtn) {
                const btnText = floatingBtn.querySelector(".floating-btn-text");
                if (btnText && t.floating_assistant_btn) {
                    btnText.textContent = t.floating_assistant_btn;
                }
            }

            // Update suggestions if chips have data-prompt-key
            if (suggestions) {
                suggestions.querySelectorAll(".quick-chip").forEach((chip) => {
                    const promptKey = chip.getAttribute("data-prompt-key");
                    if (promptKey && t[promptKey]) {
                        chip.textContent = t[promptKey];
                        chip.setAttribute("data-prompt", t[promptKey]);
                    }
                });
            }
        }

        function getTranslation(key, defaultVal) {
            if (typeof translations !== "undefined" && translations[currentLang] && translations[currentLang][key]) {
                return translations[currentLang][key];
            }
            return defaultVal;
        }
    }
})();
