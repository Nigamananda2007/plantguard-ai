/**
 * PlantGuard AI - Interactive Application Logic with Trilingual & Real AI Support
 * Supports English (en), Odia (or), and Hindi (hi).
 * Handles file drop, previews, field context, sample demo loading, API communication,
 * and dynamic multilingual dashboard rendering.
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const dropZone = document.getElementById("dropZone");
    const imageInput = document.getElementById("imageInput");
    const browseBtn = document.getElementById("browseBtn");
    const dropPrompt = document.getElementById("dropPrompt");
    const previewContainer = document.getElementById("previewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const previewDetails = document.getElementById("previewDetails");
    const clearBtn = document.getElementById("clearBtn");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const analyzeBtnText = document.getElementById("analyzeBtnText");
    const samplesContainer = document.getElementById("samplesContainer");
    const langSelect = document.getElementById("langSelect");
    const statusLabel = document.getElementById("statusLabel");
    const statusDot = document.getElementById("statusDot");

    // Optional Field Context Inputs
    const plantNameInput = document.getElementById("plantNameInput");
    const wateringInput = document.getElementById("wateringInput");
    const insectsInput = document.getElementById("insectsInput");

    // Result & State Containers
    const placeholderCard = document.getElementById("placeholderCard");
    const loadingCard = document.getElementById("loadingCard");
    const loadingStatusText = document.getElementById("loadingStatusText");
    const loadingSubtext = document.getElementById("loadingSubtext");
    const errorCard = document.getElementById("errorCard");
    const errorTitle = document.getElementById("errorTitle");
    const errorMessage = document.getElementById("errorMessage");
    const dismissErrorBtn = document.getElementById("dismissErrorBtn");
    const resultsWrapper = document.getElementById("resultsWrapper");

    // Disease Elements
    const diseaseCondition = document.getElementById("diseaseCondition");
    const cropName = document.getElementById("cropName");
    const confidenceValue = document.getElementById("confidenceValue");
    const confidenceBar = document.getElementById("confidenceBar");
    const severityBadge = document.getElementById("severityBadge");
    const pathogenName = document.getElementById("pathogenName");
    const diseaseCauses = document.getElementById("diseaseCauses");
    const symptomsList = document.getElementById("symptomsList");
    const differentialList = document.getElementById("differentialList");
    const differentialSection = document.getElementById("differentialSection");
    const farmerCallout = document.getElementById("farmerCallout");
    const farmerExplanationText = document.getElementById("farmerExplanationText");

    // Uncertainty & Follow-up Elements
    const uncertaintyCard = document.getElementById("uncertaintyCard");
    const uncertaintyText = document.getElementById("uncertaintyText");
    const followupContainer = document.getElementById("followupContainer");
    const followupList = document.getElementById("followupList");

    // Pest Elements
    const pestDamageType = document.getElementById("pestDamageType");
    const pestSeverityBadge = document.getElementById("pestSeverityBadge");
    const pestSummaryText = document.getElementById("pestSummaryText");
    const culpritTags = document.getElementById("culpritTags");
    const ipmList = document.getElementById("ipmList");

    // Treatment & Disclaimer Elements
    const organicTreatmentsList = document.getElementById("organicTreatmentsList");
    const preventionList = document.getElementById("preventionList");
    const chemicalTreatmentsList = document.getElementById("chemicalTreatmentsList");
    const modelHonestyText = document.getElementById("modelHonestyText");
    const disclaimerText = document.getElementById("disclaimerText");

    // Tab buttons
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    // Report Follow-up Chat Elements
    const reportChatCard = document.getElementById("reportChatCard");
    const reportChatResetBtn = document.getElementById("reportChatResetBtn");
    const reportChatContextText = document.getElementById("reportChatContextText");
    const reportChatSuggestions = document.getElementById("reportChatSuggestions");
    const reportChatMessages = document.getElementById("reportChatMessages");
    const reportChatForm = document.getElementById("reportChatForm");
    const reportChatInput = document.getElementById("reportChatInput");
    const reportChatSendBtn = document.getElementById("reportChatSendBtn");

    // Application State
    let currentSelectedFile = null;
    let currentSelectedSampleId = null;
    let currentAnalysisResult = null; // Stored to allow real-time language re-rendering
    let currentReportContext = null;  // Context fed into follow-up chat
    let reportChatHistory = [];       // Multi-turn history for current report
    let isReportChatWaiting = false;
    let cachedSamples = [];
    let isRealAIActive = false;

    // Language State
    let currentLang = localStorage.getItem("plantguard_lang") || "en";
    if (!translations[currentLang]) {
        currentLang = "en";
    }

    // Set initial dropdown value and apply language
    if (langSelect) {
        langSelect.value = currentLang;
        langSelect.addEventListener("change", (e) => {
            switchLanguage(e.target.value);
        });
    }

    applyLanguage(currentLang);

    // 1. Check AI Engine Health Status on Load
    checkAIHealth();

    // 2. Initialize Samples
    loadSampleImages();

    // 3. Event Listeners for Upload
    browseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        imageInput.click();
    });

    dropZone.addEventListener("click", () => {
        if (!currentSelectedFile && !currentSelectedSampleId) {
            imageInput.click();
        }
    });

    imageInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    });

    // Drag and Drop
    ["dragenter", "dragover"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add("dragover");
        });
    });

    ["dragleave", "drop"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove("dragover");
        });
    });

    dropZone.addEventListener("drop", (e) => {
        const dt = e.dataTransfer;
        if (dt.files && dt.files[0]) {
            handleFileSelection(dt.files[0]);
        }
    });

    clearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        resetUploadState();
    });

    dismissErrorBtn.addEventListener("click", () => {
        hideError();
    });

    analyzeBtn.addEventListener("click", () => {
        performAnalysis();
    });

    // Tabs navigation
    tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            tabBtns.forEach((b) => b.classList.remove("active"));
            tabContents.forEach((c) => c.classList.remove("active"));

            btn.classList.add("active");
            const targetId = btn.getAttribute("data-tab");
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add("active");
            }
        });
    });

    // Report Follow-up Chat Event Listeners
    if (reportChatResetBtn) {
        reportChatResetBtn.addEventListener("click", () => {
            initReportChat(true);
        });
    }

    if (reportChatForm) {
        reportChatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            sendReportChatMessage();
        });
    }

    if (reportChatInput) {
        reportChatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendReportChatMessage();
            }
        });
    }

    if (reportChatSuggestions) {
        reportChatSuggestions.addEventListener("click", (e) => {
            const chip = e.target.closest(".quick-chip");
            if (chip && !isReportChatWaiting) {
                const text = chip.textContent.trim();
                if (text && reportChatInput) {
                    reportChatInput.value = text;
                    sendReportChatMessage();
                }
            }
        });
    }

    /**
     * Checks if real AI API is configured
     */
    async function checkAIHealth() {
        try {
            const resp = await fetch("/api/health");
            const data = await resp.json();
            isRealAIActive = !!data.real_ai_configured;
            updateStatusBadge();
        } catch (err) {
            isRealAIActive = false;
            updateStatusBadge();
        }
    }

    function updateStatusBadge() {
        const t = translations[currentLang] || translations.en;
        if (isRealAIActive) {
            statusLabel.textContent = t.status_real_ai;
            statusDot.className = "status-dot green";
        } else {
            statusLabel.textContent = t.status_fallback;
            statusDot.className = "status-dot yellow";
        }
    }

    /**
     * Changes language and persists choice in localStorage
     */
    function switchLanguage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        localStorage.setItem("plantguard_lang", lang);
        applyLanguage(lang);
        updateStatusBadge();

        // Re-render sample labels
        if (cachedSamples.length > 0) {
            renderSamples(cachedSamples);
        }

        // Re-render current analysis results if present
        if (currentAnalysisResult) {
            if (!currentAnalysisResult.is_real_ai && (currentSelectedSampleId || currentSelectedFile)) {
                performAnalysis();
            } else {
                displayResults(currentAnalysisResult);
            }
        }

        // Update Report Follow-up Chat if active
        if (currentReportContext) {
            if (reportChatHistory.length === 0) {
                initReportChat(false);
            } else {
                renderReportChatSuggestions();
            }
        }
    }

    /**
     * Applies UI translations using data-i18n attributes
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

        // Update document title
        if (lang === "or") {
            document.title = "ପ୍ଲାଣ୍ଟଗାର୍ଡ AI 🌿 - ଉନ୍ନତ ଫସଲ ରୋଗ ଓ କୀଟ ପରୀକ୍ଷାଗାର";
        } else if (lang === "hi") {
            document.title = "प्लांटगार्ड AI 🌿 - फसल रोग एवं कीट निदान प्रयोगशाला";
        } else {
            document.title = "PlantGuard AI 🌿 - Crop Disease & Pest Diagnostic Lab";
        }
    }

    /**
     * Handles file selection with client-side validation
     */
    function handleFileSelection(file) {
        hideError();
        const validExtensions = ["image/jpeg", "image/png", "image/jpg"];
        const maxSizeBytes = 5 * 1024 * 1024; // 5MB

        const ext = file.name.split(".").pop().toLowerCase();
        const isExtValid = ["jpg", "jpeg", "png"].includes(ext);

        const t = translations[currentLang] || translations.en;

        if (!validExtensions.includes(file.type) && !isExtValid) {
            const msg = currentLang === "or" 
                ? "ଦୟାକରି ଏକ JPG, JPEG, କିମ୍ବା PNG ପତ୍ର ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ।"
                : currentLang === "hi"
                ? "कृपया केवल JPG, JPEG या PNG पत्ती की फोटो अपलोड करें।"
                : "Please select a JPG, JPEG, or PNG image of a plant leaf.";
            showError(t.error_default_title, msg);
            return;
        }

        if (file.size > maxSizeBytes) {
            const msg = currentLang === "or"
                ? "ଫାଇଲ୍ ସାଇଜ୍ 5MB ରୁ ଅଧିକ ଅଟେ। ଦୟାକରି ଛୋଟ ଫଟୋ ବାଛନ୍ତୁ।"
                : currentLang === "hi"
                ? "फ़ाइल का आकार 5MB से अधिक है। कृपया छोटी फोटो चुनें।"
                : "The selected image exceeds the 5MB size limit. Please choose a smaller image.";
            showError(t.error_default_title, msg);
            return;
        }

        currentSelectedFile = file;
        currentSelectedSampleId = null;

        // Display preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            dropPrompt.classList.add("hidden");
            previewContainer.classList.remove("hidden");
            const sizeKB = (file.size / 1024).toFixed(1);
            previewDetails.textContent = `${file.name} (${sizeKB} KB) • ${t.preview_ready}`;
            analyzeBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    /**
     * Resets upload zone and state
     */
    function resetUploadState() {
        currentSelectedFile = null;
        currentSelectedSampleId = null;
        currentAnalysisResult = null;
        currentReportContext = null;
        reportChatHistory = [];
        if (reportChatMessages) reportChatMessages.innerHTML = "";
        imageInput.value = "";
        imagePreview.src = "";
        previewContainer.classList.add("hidden");
        dropPrompt.classList.remove("hidden");
        analyzeBtn.disabled = true;
        hideError();
        placeholderCard.classList.remove("hidden");
        resultsWrapper.classList.add("hidden");
        loadingCard.classList.add("hidden");
        uncertaintyCard.classList.add("hidden");
    }

    /**
     * Loads available sample images from backend
     */
    async function loadSampleImages() {
        try {
            const resp = await fetch("/api/samples");
            const data = await resp.json();
            if (data.success && data.samples) {
                cachedSamples = data.samples;
                renderSamples(data.samples);
            }
        } catch (err) {
            const t = translations[currentLang] || translations.en;
            samplesContainer.innerHTML = `<p class="sample-error">${t.sample_loading}</p>`;
        }
    }

    /**
     * Renders sample cards in the UI with multilingual titles
     */
    function renderSamples(samples) {
        samplesContainer.innerHTML = "";
        const t = translations[currentLang] || translations.en;

        const sampleKeyMap = {
            "sample_healthy_tomato.jpg": { titleKey: "sample_healthy_title", catKey: "sample_healthy_cat" },
            "sample_early_blight.jpg": { titleKey: "sample_early_blight_title", catKey: "sample_early_blight_cat" },
            "sample_late_blight.jpg": { titleKey: "sample_late_blight_title", catKey: "sample_late_blight_cat" },
            "sample_pest_damage.jpg": { titleKey: "sample_pest_title", catKey: "sample_pest_cat" }
        };

        samples.forEach((sample) => {
            const item = document.createElement("div");
            item.className = "sample-item";
            
            const mapping = sampleKeyMap[sample.id];
            const title = (mapping && t[mapping.titleKey]) ? t[mapping.titleKey] : sample.title;
            const category = (mapping && t[mapping.catKey]) ? t[mapping.catKey] : sample.category;

            item.innerHTML = `
                <img src="${sample.url}" alt="${title}" class="sample-thumb">
                <span class="sample-title">${title}</span>
                <span class="sample-category">${category}</span>
            `;
            item.addEventListener("click", () => {
                selectSampleImage(sample, title);
            });
            samplesContainer.appendChild(item);
        });
    }

    /**
     * Pre-selects a sample image and triggers instant analysis
     */
    function selectSampleImage(sample, localizedTitle) {
        hideError();
        currentSelectedFile = null;
        currentSelectedSampleId = sample.id;

        imagePreview.src = sample.url;
        dropPrompt.classList.add("hidden");
        previewContainer.classList.remove("hidden");
        const t = translations[currentLang] || translations.en;
        previewDetails.textContent = `${t.samples_badge}: ${localizedTitle || sample.title}`;
        analyzeBtn.disabled = false;

        // Automatically trigger analysis for seamless demo experience
        performAnalysis();
    }

    /**
     * Sends image and optional field context to backend /api/analyze
     */
    async function performAnalysis() {
        const t = translations[currentLang] || translations.en;
        if (!currentSelectedFile && !currentSelectedSampleId) {
            const msg = currentLang === "or"
                ? "ଦୟାକରି ପ୍ରଥମେ ଏକ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ କିମ୍ବା ନମୁନା ପତ୍ର ବାଛନ୍ତୁ।"
                : currentLang === "hi"
                ? "कृपया पहले एक फोटो अपलोड करें या एक नमूना पत्ती चुनें।"
                : "Please upload an image or click a sample leaf first.";
            showError(t.error_default_title, msg);
            return;
        }

        hideError();
        placeholderCard.classList.add("hidden");
        resultsWrapper.classList.add("hidden");
        loadingCard.classList.remove("hidden");
        analyzeBtn.disabled = true;

        // Animated progress steps with multilingual text
        const steps = [
            { text: t.loading_step_1_title, sub: t.loading_step_1_sub },
            { text: t.loading_step_2_title, sub: t.loading_step_2_sub },
            { text: t.loading_step_3_title, sub: t.loading_step_3_sub },
            { text: t.loading_step_4_title, sub: t.loading_step_4_sub }
        ];

        let stepIndex = 0;
        const stepInterval = setInterval(() => {
            stepIndex = (stepIndex + 1) % steps.length;
            loadingStatusText.textContent = steps[stepIndex].text;
            loadingSubtext.textContent = steps[stepIndex].sub;
        }, 350);

        try {
            const formData = new FormData();
            if (currentSelectedFile) {
                formData.append("image", currentSelectedFile);
            } else if (currentSelectedSampleId) {
                formData.append("sample_id", currentSelectedSampleId);
            }

            formData.append("language", currentLang);

            // Optional grower context
            const userContext = {
                plant_name: (plantNameInput ? plantNameInput.value : "").trim(),
                watering: (wateringInput ? wateringInput.value : "").trim(),
                insects_seen: (insectsInput ? insectsInput.value : "").trim()
            };
            formData.append("user_context", JSON.stringify(userContext));

            const response = await fetch("/api/analyze", {
                method: "POST",
                body: formData
            });

            clearInterval(stepInterval);
            const data = await response.json();

            loadingCard.classList.add("hidden");
            analyzeBtn.disabled = false;

            if (!response.ok || !data.success) {
                showError(t.error_default_title, data.error || "Unable to analyze leaf image.");
                placeholderCard.classList.remove("hidden");
                return;
            }

            // Cache data and render full diagnosis
            currentAnalysisResult = data;
            displayResults(data);

        } catch (err) {
            clearInterval(stepInterval);
            loadingCard.classList.add("hidden");
            analyzeBtn.disabled = false;
            const netMsg = currentLang === "or"
                ? "ସର୍ଭର ସହିତ ସଂଯୋଗ ହୋଇପାରିଲା ନାହିଁ। ଦୟାକରି ଯାଞ୍ଚ କରନ୍ତୁ।"
                : currentLang === "hi"
                ? "सर्वर से कनेक्ट करने में असमर्थ। कृपया कनेक्शन की जांच करें।"
                : "Unable to connect to the diagnostic server. Please verify your connection.";
            showError("Network Error", netMsg);
            placeholderCard.classList.remove("hidden");
        }
    }

    /**
     * Renders diagnosis into DOM with multimodal reasoning & uncertainty support
     */
    function displayResults(data) {
        const d = data.disease_prediction;
        const p = data.pest_analysis;
        const t = translations[currentLang] || translations.en;

        // 1. Disease Diagnosis with condition localization
        let localizedCondition = d.condition;
        if (!data.is_real_ai && conditionLocalizations[d.condition] && conditionLocalizations[d.condition][currentLang]) {
            localizedCondition = conditionLocalizations[d.condition][currentLang];
        }
        diseaseCondition.textContent = localizedCondition;
        cropName.textContent = d.crop;
        confidenceValue.textContent = `${d.confidence_percentage}%`;
        confidenceBar.style.width = `${Math.min(100, d.confidence_percentage)}%`;

        // Farmer Advisory Note (plain simple language)
        if (d.farmer_explanation) {
            farmerCallout.classList.remove("hidden");
            farmerExplanationText.textContent = d.farmer_explanation;
        } else {
            farmerCallout.classList.add("hidden");
        }

        // Localized severity badge
        const localizedSeverity = getLocalizedSeverity(d.severity, t);
        severityBadge.textContent = localizedSeverity;
        applySeverityColor(severityBadge, d.severity);

        pathogenName.textContent = d.pathogen;
        diseaseCauses.textContent = d.causes;

        // Symptoms list
        symptomsList.innerHTML = "";
        (d.symptoms || []).forEach((sym) => {
            const li = document.createElement("li");
            li.textContent = sym;
            symptomsList.appendChild(li);
        });

        // Differentials
        differentialList.innerHTML = "";
        if (d.top_differential_diagnoses && d.top_differential_diagnoses.length > 0) {
            differentialSection.classList.remove("hidden");
            d.top_differential_diagnoses.forEach((diff) => {
                const chip = document.createElement("div");
                chip.className = "diff-chip";
                let diffCondition = diff.condition;
                if (!data.is_real_ai && conditionLocalizations[diff.condition] && conditionLocalizations[diff.condition][currentLang]) {
                    diffCondition = conditionLocalizations[diff.condition][currentLang];
                }
                chip.innerHTML = `<strong>${diffCondition}</strong>: ${diff.relative_score}%`;
                differentialList.appendChild(chip);
            });
        } else {
            differentialSection.classList.add("hidden");
        }

        // 2. Uncertainty & Follow-up Questions Card
        const hasUncertainty = !!(data.uncertainty_note || (data.followup_questions && data.followup_questions.length > 0));
        if (hasUncertainty) {
            uncertaintyCard.classList.remove("hidden");
            uncertaintyText.textContent = data.uncertainty_note || (currentLang === "or" ? "ପତ୍ରର ବାହ୍ୟ ଲକ୍ଷଣ ଆଧାରରେ ଡାଏଗ୍ନୋଷ୍ଟିକ୍ ମୂଲ୍ୟାଙ୍କନ କରାଯାଇଛି।" : "Diagnostic findings evaluated based on visible morphological patterns.");

            if (data.followup_questions && data.followup_questions.length > 0) {
                followupContainer.classList.remove("hidden");
                followupList.innerHTML = "";
                data.followup_questions.forEach((q) => {
                    const li = document.createElement("li");
                    li.textContent = q;
                    followupList.appendChild(li);
                });
            } else {
                followupContainer.classList.add("hidden");
            }
        } else {
            uncertaintyCard.classList.add("hidden");
        }

        // 3. Pest Damage Assessment
        let localizedPestType = p.damage_type;
        const containsIndic = /[\u0B00-\u0B7F\u0900-\u097F]/.test(p.damage_type || "");
        if (!containsIndic) {
            if (currentLang === "or") {
                if (p.damage_type.includes("Chewing") || p.damage_type.includes("Perforation")) {
                    localizedPestType = "ପତ୍ର କଟା ଓ କଣା କ୍ଷତି (Leaf Chewing Damage)";
                } else if (p.damage_type.includes("Miner")) {
                    localizedPestType = "ସରୁ ଟନେଲ୍ କ୍ଷତି (Serpentine Leaf Miner)";
                } else if (p.damage_type.includes("Piercing") || p.damage_type.includes("Sucking") || p.damage_type.includes("Stippling")) {
                    localizedPestType = "ରସ ଶୋଷକ ପୋକ କ୍ଷତି (Sucking Insect Stippling)";
                } else {
                    localizedPestType = "କୌଣସି ପୋକ ଖାଇଥିବାର କ୍ଷତି ଚିହ୍ନ ନାହିଁ (No Pest Damage)";
                }
            } else if (currentLang === "hi") {
                if (p.damage_type.includes("Chewing") || p.damage_type.includes("Perforation")) {
                    localizedPestType = "पत्ती कुतरने और छेद की क्षति (Leaf Chewing Damage)";
                } else if (p.damage_type.includes("Miner")) {
                    localizedPestType = "लीफ माइनर सुरंग क्षति (Serpentine Leaf Miner)";
                } else if (p.damage_type.includes("Piercing") || p.damage_type.includes("Sucking") || p.damage_type.includes("Stippling")) {
                    localizedPestType = "रस चूसक कीट क्षति (Sucking Insect Stippling)";
                } else {
                    localizedPestType = "कोई स्पष्ट कीट क्षति नहीं पाई गई";
                }
            }
        }

        pestDamageType.textContent = localizedPestType;
        pestSeverityBadge.textContent = getLocalizedSeverity(p.severity, t);
        applySeverityColor(pestSeverityBadge, p.severity);

        if (p.pest_damage_detected) {
            pestSummaryText.textContent = `${t.pest_detected_prefix} ${p.confidence_percentage}%`;
        } else {
            pestSummaryText.textContent = `${t.pest_clean_prefix} (${p.confidence_percentage}%).`;
        }

        // Culprit tags
        culpritTags.innerHTML = "";
        (p.likely_culprits || []).forEach((culprit) => {
            const span = document.createElement("span");
            span.className = "culprit-tag";
            span.textContent = culprit;
            culpritTags.appendChild(span);
        });

        // IPM list
        ipmList.innerHTML = "";
        (p.integrated_pest_management || []).forEach((action) => {
            const li = document.createElement("li");
            li.textContent = action;
            ipmList.appendChild(li);
        });

        // 4. Treatment Tabs
        populateList(organicTreatmentsList, d.organic_treatment);
        populateList(preventionList, d.prevention);
        populateList(chemicalTreatmentsList, d.chemical_treatment);

        // 5. Model Honesty & Disclaimers
        const engineLabel = d.model_transparency && d.model_transparency.active_engine 
            ? d.model_transparency.active_engine 
            : (data.is_real_ai ? "Google Gemini Multimodal Vision AI" : "Botanical Heuristic & Colorimetric System");
        const honestDesc = d.model_transparency && d.model_transparency.honest_note 
            ? d.model_transparency.honest_note 
            : "";

        let retryHtml = "";
        if (data.can_retry_ai && (currentSelectedFile || currentSelectedSampleId)) {
            const retryLabel = t.retry_ai_analysis || (currentLang === "or" ? "🔄 ବାସ୍ତବ AI ବିଶ୍ଳେଷଣ ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ" : "🔄 Retry Real AI Vision Analysis");
            const promptLabel = t.temporary_error_retry_prompt || "Gemini AI temporarily busy. Click below to retry:";
            retryHtml = `<div class="ai-retry-banner" style="margin-top: 12px; padding: 12px; background: rgba(46, 125, 50, 0.12); border: 1px solid rgba(46, 125, 50, 0.35); border-radius: 8px;">
                <p style="margin: 0 0 8px 0; font-size: 0.95rem; font-weight: 500;">${promptLabel}</p>
                <button type="button" id="btnRetryAiAnalysis" class="btn btn-sm btn-primary" style="cursor: pointer; padding: 6px 14px; font-weight: 600;">${retryLabel}</button>
            </div>`;
        }

        modelHonestyText.innerHTML = `<strong>${t.ai_transparency_label}</strong> ${engineLabel}. ${honestDesc}${retryHtml}`;
        disclaimerText.textContent = `${t.disclaimer_prefix} ${data.disclaimer}`;

        if (data.can_retry_ai && (currentSelectedFile || currentSelectedSampleId)) {
            const retryBtnEl = document.getElementById("btnRetryAiAnalysis");
            if (retryBtnEl) {
                retryBtnEl.addEventListener("click", () => {
                    analyzeLeafImage();
                });
            }
        }

        // 6. Connect & Initialize Report Follow-up AI Chat
        currentReportContext = {
            crop: d.crop || "",
            condition: localizedCondition || d.condition || "",
            confidence: d.confidence_percentage,
            severity: d.severity,
            pathogen: d.pathogen,
            symptoms: d.symptoms || [],
            pest_damage: {
                detected: p.pest_damage_detected,
                type: localizedPestType || p.damage_type,
                culprits: p.likely_culprits || [],
                severity: p.severity,
                ipm: p.integrated_pest_management || []
            },
            organic_treatment: d.organic_treatment || [],
            chemical_treatment: d.chemical_treatment || [],
            prevention: d.prevention || []
        };

        if (reportChatContextText) {
            reportChatContextText.textContent = `${d.crop} • ${localizedCondition} (${d.confidence_percentage}% Confidence)`;
        }

        initReportChat(false);

        // Show Results Card
        resultsWrapper.classList.remove("hidden");
        resultsWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function getLocalizedSeverity(severity, t) {
        const sev = (severity || "").toLowerCase();
        if (sev.includes("none") || sev.includes("କିଛି ନାହିଁ") || sev.includes("कोई नहीं")) return t.sev_none;
        if (sev.includes("mild") || sev.includes("low") || sev.includes("ସାମାନ୍ୟ") || sev.includes("हल्की")) return t.sev_mild;
        if (sev.includes("moderate") || sev.includes("ମଧ୍ୟମ") || sev.includes("मध्यम")) return t.sev_moderate;
        if (sev.includes("critical") || sev.includes("severe") || sev.includes("ଗୁରୁତର") || sev.includes("ଅତ୍ୟନ୍ତ") || sev.includes("गंभीर")) return t.sev_critical;
        if (sev.includes("high") || sev.includes("ଅଧିକ") || sev.includes("उच्च")) return t.sev_high;
        return severity;
    }

    function populateList(container, items) {
        container.innerHTML = "";
        if (!items || items.length === 0) {
            const li = document.createElement("li");
            li.textContent = currentLang === "or" ? "କୌଣସି ନିର୍ଦ୍ଦିଷ୍ଟ ଚିକିତ୍ସା ଆବଶ୍ୟକ ନାହିଁ।" : currentLang === "hi" ? "कोई विशिष्ट उपचार की आवश्यकता नहीं है।" : "No specific treatments required.";
            container.appendChild(li);
            return;
        }
        items.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            container.appendChild(li);
        });
    }

    function applySeverityColor(badgeElement, severity) {
        badgeElement.className = "badge";
        const sev = (severity || "").toLowerCase();
        if (sev.includes("none") || sev.includes("କିଛି ନାହିଁ") || sev.includes("कोई नहीं")) {
            badgeElement.style.background = "#e8f5e9";
            badgeElement.style.color = "#2e7d32";
        } else if (sev.includes("mild") || sev.includes("low") || sev.includes("ସାମାନ୍ୟ") || sev.includes("हल्की")) {
            badgeElement.style.background = "#fef3c7";
            badgeElement.style.color = "#92400e";
        } else if (sev.includes("moderate") || sev.includes("ମଧ୍ୟମ") || sev.includes("मध्यम")) {
            badgeElement.style.background = "#fed7aa";
            badgeElement.style.color = "#c2410c";
        } else {
            badgeElement.style.background = "#fee2e2";
            badgeElement.style.color = "#b91c1c";
        }
    }

    function showError(title, message) {
        errorTitle.textContent = title;
        errorMessage.textContent = message;
        errorCard.classList.remove("hidden");
    }

    function hideError() {
        errorCard.classList.add("hidden");
    }

    /**
     * Initializes Report Follow-up AI Chat with current report context
     */
    function initReportChat(userInitiated = false) {
        reportChatHistory = [];
        if (!reportChatMessages) return;
        reportChatMessages.innerHTML = "";

        const crop = currentReportContext ? currentReportContext.crop : "";
        const condition = currentReportContext ? currentReportContext.condition : "";

        let greeting = "";
        if (currentLang === "or") {
            greeting = `ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ପ୍ଲାଣ୍ଟଗାର୍ଡ AI ସହାୟକ। ଆପଣଙ୍କ ${crop || "ଫସଲ"}ର ${condition || "ପରୀକ୍ଷା"} ରିପୋର୍ଟ ସମ୍ପର୍କରେ ଚିକିତ୍ସା, କୀଟ ନିୟନ୍ତ୍ରଣ ବା ପ୍ରତିରୋଧ ବିଷୟରେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରିପାରିବେ।`;
        } else if (currentLang === "hi") {
            greeting = `नमस्ते! मैं आपका प्लांटगार्ड AI सहायक हूँ। आपकी ${crop || "फसल"} की ${condition || "रिपोर्ट"} के बारे में उपचार, रोकथाम या देखभाल से जुड़ा कोई भी सवाल पूछ सकते हैं।`;
        } else {
            greeting = `Hello! I am your PlantGuard AI advisor. I have loaded the diagnostic context for ${crop || "your plant"} (${condition || "diagnosed issue"}). What follow-up questions can I answer about treatments, symptoms, or prevention?`;
        }

        appendReportChatBubble("assistant", greeting);
        renderReportChatSuggestions();

        if (reportChatInput) {
            reportChatInput.value = "";
            if (userInitiated) {
                reportChatInput.focus();
            }
        }
    }

    function renderReportChatSuggestions() {
        if (!reportChatSuggestions) return;
        reportChatSuggestions.innerHTML = "";
        const t = translations[currentLang] || translations.en;

        const chips = [
            t.report_chip_1 || "How fast will this condition spread?",
            t.report_chip_2 || "Can I use organic neem spray for this?",
            t.report_chip_3 || "What immediate action should I take today?",
            t.report_chip_4 || "How should I adjust watering now?"
        ];

        const label = document.createElement("span");
        label.className = "suggestions-label";
        label.textContent = "💡 Suggested:";
        reportChatSuggestions.appendChild(label);

        chips.forEach((chipText) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "quick-chip";
            btn.textContent = chipText;
            reportChatSuggestions.appendChild(btn);
        });
    }

    async function sendReportChatMessage(customText = null) {
        if (isReportChatWaiting) return;

        const text = (customText !== null ? customText : (reportChatInput ? reportChatInput.value : "")).trim();
        if (!text) return;

        if (reportChatInput) {
            reportChatInput.value = "";
        }

        appendReportChatBubble("user", text);
        const typingEl = appendReportTypingIndicator();
        isReportChatWaiting = true;
        setReportFormEnabled(false);
        scrollReportChatToBottom();

        try {
            const payload = {
                message: text,
                history: reportChatHistory,
                report_context: currentReportContext,
                language: currentLang
            };

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            removeReportTypingIndicator(typingEl);

            if (response.ok && data.success) {
                appendReportChatBubble("assistant", data.reply);
                reportChatHistory.push({ role: "user", text: text });
                reportChatHistory.push({ role: "model", text: data.reply });
                if (reportChatHistory.length > 10) {
                    reportChatHistory = reportChatHistory.slice(-10);
                }
            } else {
                handleReportChatError(data, text);
            }
        } catch (err) {
            removeReportTypingIndicator(typingEl);
            const netMsg = currentLang === "or"
                ? "ସର୍ଭର ସହିତ ସଂଯୋଗ ହୋଇପାରିଲା ନାହିଁ। ଦୟାକରି ଯାଞ୍ଚ କରନ୍ତୁ।"
                : currentLang === "hi"
                ? "सर्वर से कनेक्ट करने में असमर्थ। कृपया कनेक्शन जांचें।"
                : "Unable to connect to the server. Please check your network connection.";
            appendReportErrorBubble(netMsg, text);
        } finally {
            isReportChatWaiting = false;
            setReportFormEnabled(true);
            if (reportChatInput) reportChatInput.focus();
            scrollReportChatToBottom();
        }
    }

    function handleReportChatError(data, failedPrompt) {
        const t = translations[currentLang] || translations.en;
        if (data && data.api_key_missing) {
            const warningMsg = t.chat_missing_key_warning || (
                "⚠️ Gemini API key is not configured on the server. Please add your GEMINI_API_KEY in the server .env file to enable live AI chat."
            );
            appendReportNoticeBubble(warningMsg);
        } else {
            const errorMsg = (data && data.error) ? data.error : "An unexpected error occurred while communicating with Gemini.";
            appendReportErrorBubble(errorMsg, failedPrompt);
        }
    }

    function appendReportChatBubble(role, rawText) {
        if (!reportChatMessages) return;
        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${role}`;

        const avatar = document.createElement("div");
        avatar.className = "chat-avatar";
        avatar.textContent = role === "user" ? "👤" : "🌿";

        const content = document.createElement("div");
        content.className = "chat-content";
        content.innerHTML = formatChatMarkdown(rawText);

        bubble.appendChild(avatar);
        bubble.appendChild(content);
        reportChatMessages.appendChild(bubble);
        scrollReportChatToBottom();
    }

    function appendReportNoticeBubble(noticeText) {
        if (!reportChatMessages) return;
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble system-notice";

        const avatar = document.createElement("div");
        avatar.className = "chat-avatar";
        avatar.textContent = "⚙️";

        const content = document.createElement("div");
        content.className = "chat-content notice-content";
        content.innerHTML = `<strong>Configuration Notice:</strong><p>${escapeChatHtml(noticeText)}</p>`;

        bubble.appendChild(avatar);
        bubble.appendChild(content);
        reportChatMessages.appendChild(bubble);
        scrollReportChatToBottom();
    }

    function appendReportErrorBubble(errorMessage, retryText) {
        if (!reportChatMessages) return;
        const t = translations[currentLang] || translations.en;
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble error";

        const avatar = document.createElement("div");
        avatar.className = "chat-avatar";
        avatar.textContent = "⚠️";

        const content = document.createElement("div");
        content.className = "chat-content error-content";
        content.innerHTML = `<strong>${t.chat_error_prefix || "Error:"}</strong> <p>${escapeChatHtml(errorMessage)}</p>`;

        if (retryText) {
            const retryBtn = document.createElement("button");
            retryBtn.type = "button";
            retryBtn.className = "btn btn-sm btn-retry";
            retryBtn.textContent = `↺ ${t.chat_retry || "Retry"}`;
            retryBtn.addEventListener("click", () => {
                bubble.remove();
                sendReportChatMessage(retryText);
            });
            content.appendChild(retryBtn);
        }

        bubble.appendChild(avatar);
        bubble.appendChild(content);
        reportChatMessages.appendChild(bubble);
        scrollReportChatToBottom();
    }

    function appendReportTypingIndicator() {
        if (!reportChatMessages) return null;
        const t = translations[currentLang] || translations.en;
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble assistant typing-bubble";
        bubble.id = "activeReportTypingIndicator";

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
        reportChatMessages.appendChild(bubble);
        return bubble;
    }

    function removeReportTypingIndicator(el) {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        } else {
            const fallback = document.getElementById("activeReportTypingIndicator");
            if (fallback) fallback.remove();
        }
    }

    function setReportFormEnabled(enabled) {
        if (reportChatInput) reportChatInput.disabled = !enabled;
        if (reportChatSendBtn) reportChatSendBtn.disabled = !enabled;
    }

    function scrollReportChatToBottom() {
        if (reportChatMessages) {
            reportChatMessages.scrollTop = reportChatMessages.scrollHeight;
        }
    }

    function formatChatMarkdown(text) {
        if (!text) return "";
        let escaped = escapeChatHtml(text);
        escaped = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

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

    function escapeChatHtml(string) {
        const div = document.createElement("div");
        div.textContent = string;
        return div.innerHTML;
    }
});
