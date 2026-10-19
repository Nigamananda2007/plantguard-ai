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

    // Application State
    let currentSelectedFile = null;
    let currentSelectedSampleId = null;
    let currentAnalysisResult = null; // Stored to allow real-time language re-rendering
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
        modelHonestyText.innerHTML = `<strong>${t.ai_transparency_label}</strong> ${engineLabel}. ${honestDesc}`;
        disclaimerText.textContent = `${t.disclaimer_prefix} ${data.disclaimer}`;

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
});
